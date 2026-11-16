import React, { useEffect, useMemo, useState } from "react";
import { PageShell, PageHero, Spinner, EmptyState, Icon } from "@/Components/ui";

const API =
    "https://api.open-meteo.com/v1/forecast?latitude=28.128&longitude=-15.433" +
    "&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index" +
    "&hourly=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,uv_index,is_day,precipitation_probability" +
    "&daily=weather_code,sunrise,sunset,uv_index_max,precipitation_sum,wind_speed_10m_max,temperature_2m_max,temperature_2m_min" +
    "&timezone=Atlantic%2FCanary";

const weatherIcon = (code, isDay = 1) => {
    if (code === 0) return isDay ? "☀️" : "🌙";
    if (code <= 2) return isDay ? "🌤️" : "☁️";
    if (code === 3) return "☁️";
    if (code <= 48) return "🌫️";
    if (code <= 67) return "🌧️";
    if (code <= 77) return "❄️";
    if (code <= 82) return "🌦️";
    return "⛈️";
};

const DESCRIPTIONS = {
    0: "Despejado", 1: "Mayormente despejado", 2: "Parcialmente nublado", 3: "Nublado",
    45: "Niebla", 48: "Niebla", 51: "Llovizna ligera", 53: "Llovizna", 55: "Llovizna intensa",
    61: "Lluvia ligera", 63: "Lluvia", 65: "Lluvia fuerte", 80: "Chubascos", 81: "Chubascos", 82: "Chubascos fuertes", 95: "Tormenta",
};

const DIRS = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
const windDir = (deg) => DIRS[Math.round(deg / 45) % 8];

const hhmm = (iso) => iso.slice(11, 16);
const dayLabel = (iso, opts) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Intl.DateTimeFormat("es-ES", opts).format(new Date(y, m - 1, d)).replace(/\./g, "");
};

const uvLevel = (uv) => {
    if (uv < 3) return { label: "Bajo", cls: "text-emerald-600" };
    if (uv < 6) return { label: "Moderado", cls: "text-amber-500" };
    if (uv < 8) return { label: "Alto", cls: "text-orange-500" };
    return { label: "Muy alto", cls: "text-rose-600" };
};

// ¿Buen momento para jugar? Viento, lluvia y luz
const verdict = ({ wind, rain, isDay, code }) => {
    if (!isDay) return { label: "Es de noche", text: "Vuelve mañana con luz.", tone: "slate" };
    if (rain || (code >= 61 && code <= 99)) return { label: "Mejor otro día", text: "Se espera lluvia.", tone: "rose" };
    if (wind >= 30) return { label: "Mucho viento", text: "Rachas difíciles para jugar.", tone: "rose" };
    if (wind >= 18) return { label: "Jugable", text: "Algo de viento: saques cortos y mucho control.", tone: "amber" };
    return { label: "Día ideal", text: "Poco viento y buen tiempo. ¡A la arena!", tone: "emerald" };
};

const TONES = {
    emerald: "bg-emerald-400/20 text-emerald-50 ring-emerald-300/40",
    amber: "bg-amber-300/20 text-amber-50 ring-amber-200/40",
    rose: "bg-rose-400/20 text-rose-50 ring-rose-300/40",
    slate: "bg-white/10 text-white ring-white/20",
};

function Metric({ icon, label, value, unit, sub, subCls = "text-gray-500", children }) {
    return (
        <div className="rounded-2xl bg-white border border-black/5 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <Icon name={icon} className="w-4 h-4 text-[#1CA9C9]" /> {label}
            </div>
            <div className="mt-2 flex items-end gap-1.5">
                <span className="text-3xl font-black tabular-nums">{value}</span>
                {unit && <span className="text-sm text-gray-400 font-semibold mb-1">{unit}</span>}
                {children}
            </div>
            {sub && <div className={`mt-0.5 text-sm font-semibold ${subCls}`}>{sub}</div>}
        </div>
    );
}

function WindArrow({ deg, className = "w-5 h-5" }) {
    // La API indica de dónde viene el viento; la flecha apunta hacia dónde va.
    return (
        <svg className={className} viewBox="0 0 24 24" style={{ transform: `rotate(${deg + 180}deg)` }} aria-hidden="true">
            <path d="M12 3l5 9h-4v9h-2v-9H7z" fill="currentColor" />
        </svg>
    );
}

export default function Forecast() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);
    const [day, setDay] = useState(0);
    const [hour, setHour] = useState(null);

    useEffect(() => {
        fetch(API)
            .then((r) => r.json())
            .then(setData)
            .catch(() => setError(true));
    }, []);

    const hours = useMemo(() => {
        if (!data) return [];
        const date = data.daily.time[day];
        return data.hourly.time
            .map((t, i) => ({ t, i }))
            .filter(({ t }) => t.startsWith(date) && +t.slice(11, 13) >= 7 && +t.slice(11, 13) <= 21);
    }, [data, day]);

    const display = useMemo(() => {
        if (!data) return null;
        const h = data.hourly;
        if (hour !== null) {
            return {
                label: `${dayLabel(data.daily.time[day], { weekday: "long" })}, ${hhmm(h.time[hour])}`,
                temp: h.temperature_2m[hour], code: h.weather_code[hour], wind: h.wind_speed_10m[hour],
                dir: h.wind_direction_10m[hour], uv: h.uv_index[hour], isDay: h.is_day[hour],
                rain: (h.precipitation_probability?.[hour] ?? 0) >= 60,
            };
        }
        if (day === 0) {
            const c = data.current;
            return {
                label: "Ahora mismo", temp: c.temperature_2m, feels: c.apparent_temperature, code: c.weather_code,
                wind: c.wind_speed_10m, dir: c.wind_direction_10m, uv: c.uv_index, isDay: c.is_day,
                humidity: c.relative_humidity_2m, rain: c.precipitation > 0.2,
            };
        }
        const d = data.daily;
        return {
            label: dayLabel(d.time[day], { weekday: "long", day: "numeric", month: "long" }),
            temp: d.temperature_2m_max[day], min: d.temperature_2m_min[day], code: d.weather_code[day],
            wind: d.wind_speed_10m_max[day], dir: null, uv: d.uv_index_max[day], isDay: 1,
            rain: d.precipitation_sum[day] > 1,
        };
    }, [data, day, hour]);

    const sun = data && {
        rise: hhmm(data.daily.sunrise[day]),
        set: hhmm(data.daily.sunset[day]),
    };

    const sunLeft = useMemo(() => {
        if (!data || day !== 0 || hour !== null) return null;
        const now = new Date();
        const set = new Date(data.daily.sunset[0]);
        const rise = new Date(data.daily.sunrise[0]);
        if (now > set) return "Ya anocheció";
        if (now < rise) return "Aún no ha amanecido";
        const ms = set - now;
        return `${Math.floor(ms / 3.6e6)} h ${Math.floor((ms % 3.6e6) / 6e4)} min de sol`;
    }, [data, day, hour]);

    const v = display && verdict(display);
    const maxWind = hours.length ? Math.max(...hours.map(({ i }) => data.hourly.wind_speed_10m[i]), 30) : 30;

    return (
        <PageShell title="Previsión del tiempo - Las Canteras Beach Volley">
            <PageHero
                compact
                eyebrow="Playa de Las Canteras"
                title="¿Hace día de playa?"
                subtitle="Viento, índice UV y horas de sol en Las Canteras para los próximos 7 días."
            >
                {display && (
                    <div className="mt-8 grid md:grid-cols-[1fr_auto] gap-4 items-stretch">
                        <div className="rounded-3xl bg-white/10 ring-1 ring-white/15 backdrop-blur p-5 sm:p-6 flex items-center gap-5">
                            <span className="text-6xl sm:text-7xl leading-none drop-shadow">{weatherIcon(display.code, display.isDay)}</span>
                            <div className="min-w-0">
                                <div className="text-white/60 text-xs font-bold uppercase tracking-wider">{display.label}</div>
                                <div className="text-white text-5xl sm:text-6xl font-black tabular-nums leading-none mt-1">
                                    {Math.round(display.temp)}°
                                    {display.min !== undefined && <span className="text-2xl text-white/50 font-bold ml-2">/ {Math.round(display.min)}°</span>}
                                </div>
                                <div className="text-white/80 font-semibold mt-1">
                                    {DESCRIPTIONS[display.code] ?? "—"}
                                    {display.feels !== undefined && <span className="text-white/50"> · sensación {Math.round(display.feels)}°</span>}
                                </div>
                            </div>
                        </div>
                        <div className={`rounded-3xl ring-1 backdrop-blur p-5 sm:p-6 md:w-72 ${TONES[v.tone]}`}>
                            <div className="text-[11px] font-bold uppercase tracking-wider opacity-70">Para jugar</div>
                            <div className="text-2xl font-black mt-1">{v.label}</div>
                            <div className="text-sm mt-1 opacity-80">{v.text}</div>
                        </div>
                    </div>
                )}
            </PageHero>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                {error ? (
                    <EmptyState icon="cloud" title="No se pudo cargar la previsión">Inténtalo de nuevo en unos minutos.</EmptyState>
                ) : !data ? (
                    <Spinner label="Consultando el tiempo…" />
                ) : (
                    <div className="space-y-10">
                        {/* Métricas */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            <Metric
                                icon="wind"
                                label="Viento"
                                value={Math.round(display.wind)}
                                unit="km/h"
                                sub={display.dir !== null ? `Del ${windDir(display.dir)}` : "Máximo del día"}
                            >
                                {display.dir !== null && <WindArrow deg={display.dir} className="w-6 h-6 text-[#1CA9C9] mb-1.5 ml-1" />}
                            </Metric>
                            <Metric icon="sun" label="Índice UV" value={Math.round(display.uv ?? 0)} sub={`${uvLevel(display.uv ?? 0).label}${(display.uv ?? 0) >= 6 ? " · ¡crema!" : ""}`} subCls={uvLevel(display.uv ?? 0).cls} />
                            <Metric icon="clock" label="Sol" value={sun.set} sub={sunLeft || `Amanece a las ${sun.rise}`} />
                            <Metric
                                icon="cloud"
                                label={display.humidity !== undefined ? "Humedad" : "Lluvia"}
                                value={display.humidity !== undefined ? display.humidity : Math.round((data.daily.precipitation_sum[day] ?? 0) * 10) / 10}
                                unit={display.humidity !== undefined ? "%" : "mm"}
                                sub={display.humidity !== undefined ? `Lluvia hoy: ${data.daily.precipitation_sum[0] ?? 0} mm` : "Acumulado del día"}
                            />
                        </div>

                        {/* Días */}
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Próximos días</h2>
                            <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
                                {data.daily.time.map((t, i) => {
                                    const active = day === i;
                                    return (
                                        <button
                                            key={t}
                                            onClick={() => { setDay(i); setHour(null); }}
                                            className={`shrink-0 w-[88px] rounded-2xl p-3 text-center border transition-all ${active ? "bg-[#0D5C6E] border-[#0D5C6E] text-white shadow-lg" : "bg-white border-black/5 hover:border-[#1CA9C9]/50"}`}
                                        >
                                            <div className={`text-xs font-bold uppercase ${active ? "text-white/70" : "text-gray-400"}`}>
                                                {i === 0 ? "Hoy" : dayLabel(t, { weekday: "short" })}
                                            </div>
                                            <div className="text-3xl my-1">{weatherIcon(data.daily.weather_code[i])}</div>
                                            <div className="text-sm font-black tabular-nums">
                                                {Math.round(data.daily.temperature_2m_max[i])}°
                                                <span className={`font-semibold ml-1 ${active ? "text-white/60" : "text-gray-400"}`}>{Math.round(data.daily.temperature_2m_min[i])}°</span>
                                            </div>
                                            <div className={`mt-1 text-[11px] font-semibold flex items-center justify-center gap-1 ${active ? "text-white/70" : "text-gray-500"}`}>
                                                <Icon name="wind" className="w-3 h-3" /> {Math.round(data.daily.wind_speed_10m_max[i])}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Horas */}
                        <section>
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                                    Por horas · <span className="capitalize">{dayLabel(data.daily.time[day], { weekday: "long" })}</span>
                                </h2>
                                {hour !== null && (
                                    <button onClick={() => setHour(null)} className="text-sm font-bold text-[#0D5C6E] hover:underline">Ver resumen</button>
                                )}
                            </div>
                            <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-3 sm:p-4">
                                <div className="flex gap-1 overflow-x-auto no-scrollbar">
                                    {hours.map(({ t, i }) => {
                                        const h = data.hourly;
                                        const active = hour === i;
                                        const w = h.wind_speed_10m[i];
                                        const wTone = w >= 30 ? "bg-rose-400" : w >= 18 ? "bg-amber-400" : "bg-emerald-400";
                                        return (
                                            <button
                                                key={t}
                                                onClick={() => setHour(i)}
                                                className={`shrink-0 w-16 rounded-2xl py-3 flex flex-col items-center transition-colors ${active ? "bg-[#1CA9C9]/15 ring-2 ring-[#1CA9C9]" : "hover:bg-gray-50"}`}
                                            >
                                                <span className="text-xs font-bold text-gray-500">{hhmm(t)}</span>
                                                <span className="text-2xl my-1">{weatherIcon(h.weather_code[i], h.is_day[i])}</span>
                                                <span className="text-sm font-black tabular-nums">{Math.round(h.temperature_2m[i])}°</span>
                                                <span className="mt-2 h-10 w-2 rounded-full bg-gray-100 flex items-end overflow-hidden" title={`${w} km/h`}>
                                                    <span className={`w-full rounded-full ${wTone}`} style={{ height: `${Math.min(100, (w / maxWind) * 100)}%` }} />
                                                </span>
                                                <span className="mt-1 text-[10px] font-semibold text-gray-500 flex items-center gap-0.5">
                                                    <WindArrow deg={h.wind_direction_10m[i]} className="w-2.5 h-2.5" /> {Math.round(w)}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-4 text-[11px] text-gray-500 px-1">
                                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Ideal (&lt;18 km/h)</span>
                                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Jugable</span>
                                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400" /> Mucho viento (≥30)</span>
                                </div>
                            </div>
                        </section>

                        <p className="text-center text-xs text-gray-500">
                            Datos: <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0D5C6E] hover:underline">Open‑Meteo</a>
                        </p>
                    </div>
                )}
            </main>
        </PageShell>
    );
}

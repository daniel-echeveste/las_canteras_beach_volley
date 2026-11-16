import React, { useMemo, useState } from "react";
import { PageShell, PageHero, Segmented, SearchInput, Modal, Spinner, EmptyState, Icon, RFEVB_TABLE_CSS } from "@/Components/ui";

const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const MONTHS_SHORT = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const parseDate = (s) => {
    const p = s?.split("/");
    return p?.length === 3 ? new Date(+p[2], +p[1] - 1, +p[0]) : null;
};
const keyOf = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const isFem = (t) => t.categoria === "Senior-F";

// Nivel según el factor de puntuación del torneo
const level = (factor) => {
    const f = parseFloat(String(factor).replace(",", "."));
    if (f >= 30) return { label: "Élite", cls: "bg-amber-100 text-amber-800", bar: "bg-amber-400" };
    if (f >= 15) return { label: "CNVP", cls: "bg-violet-100 text-violet-800", bar: "bg-violet-400" };
    if (f >= 4) return { label: "Nacional", cls: "bg-sky-100 text-sky-800", bar: "bg-sky-400" };
    if (f >= 2) return { label: "Regional", cls: "bg-teal-100 text-teal-800", bar: "bg-teal-400" };
    return { label: "Local", cls: "bg-gray-100 text-gray-600", bar: "bg-gray-300" };
};

function GenderBadge({ t }) {
    return isFem(t)
        ? <span className="badge bg-pink-100 text-pink-700">Femenino</span>
        : <span className="badge bg-blue-100 text-blue-700">Masculino</span>;
}

function TournamentCard({ t, onOpen }) {
    const start = parseDate(t.fechaInicio);
    const end = parseDate(t.fechaFin);
    const lv = level(t.factor);
    const multiDay = end && start && keyOf(end) !== keyOf(start);
    const place = t.sede && t.sede !== t.localidad ? `${t.sede}, ${t.localidad}` : t.localidad;

    return (
        <article className="group relative bg-white rounded-3xl border border-black/5 shadow-sm hover:shadow-lg transition-all overflow-hidden flex">
            <span className={`absolute left-0 inset-y-0 w-1 ${lv.bar}`} aria-hidden="true" />
            {start && (
                <div className="shrink-0 w-[76px] sm:w-20 flex flex-col items-center justify-center bg-[#E6F6FA]/60 border-r border-black/5 py-4 pl-1">
                    <span className="text-[11px] font-bold uppercase text-[#1CA9C9]">{MONTHS_SHORT[start.getMonth()]}</span>
                    <span className="text-3xl font-black text-[#0D5C6E] leading-none">{start.getDate()}</span>
                    {multiDay && <span className="text-[10px] font-semibold text-gray-500 mt-1">al {end.getDate()} {MONTHS_SHORT[end.getMonth()]}</span>}
                </div>
            )}
            <div className="flex-1 min-w-0 p-4 sm:p-5 flex flex-col">
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <GenderBadge t={t} />
                    <span className={`badge ${lv.cls}`}>{lv.label} · x{t.factor}</span>
                </div>
                <h3 className="font-extrabold leading-snug text-gray-900">{t.torneo}</h3>
                <div className="mt-2 space-y-1 text-[13px] text-gray-500">
                    {place && (
                        <div className="flex items-center gap-1.5 min-w-0">
                            <Icon name="pin" className="w-3.5 h-3.5 shrink-0 text-[#1CA9C9]" />
                            {t.coordenadas?.startsWith("http") ? (
                                <a href={t.coordenadas} target="_blank" rel="noopener noreferrer" className="truncate hover:text-[#0D5C6E] hover:underline">{place}</a>
                            ) : <span className="truncate">{place}</span>}
                        </div>
                    )}
                    {t.federacion && (
                        <div className="flex items-center gap-1.5 truncate">
                            <Icon name="users" className="w-3.5 h-3.5 shrink-0 text-[#1CA9C9]" />
                            <span className="truncate">{t.federacion}{t.alias ? ` (${t.alias})` : ""}</span>
                        </div>
                    )}
                    {t.fechaTopeInscripcion && (
                        <div className="flex items-center gap-1.5 text-orange-600 font-medium">
                            <Icon name="clock" className="w-3.5 h-3.5 shrink-0" />
                            Inscripción hasta el {t.fechaTopeInscripcion}
                        </div>
                    )}
                </div>
                <div className="mt-4 pt-3 border-t border-dashed border-gray-200 flex justify-end">
                    <button onClick={() => onOpen(t)} className="inline-flex items-center gap-1 text-sm font-bold text-[#0D5C6E] hover:text-[#1CA9C9]">
                        Clasificación <Icon name="arrow" className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </article>
    );
}

function ListView({ torneos, onOpen }) {
    const groups = useMemo(() => {
        const map = new Map();
        [...torneos]
            .sort((a, b) => (parseDate(a.fechaInicio) ?? 0) - (parseDate(b.fechaInicio) ?? 0))
            .forEach((t) => {
                const d = parseDate(t.fechaInicio);
                if (!d) return;
                const k = `${d.getFullYear()}-${d.getMonth()}`;
                if (!map.has(k)) map.set(k, { label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`, items: [] });
                map.get(k).items.push(t);
            });
        return [...map.values()];
    }, [torneos]);

    if (!groups.length) return <EmptyState icon="calendar" title="No hay torneos">Prueba con otra búsqueda o categoría.</EmptyState>;

    return (
        <div className="space-y-10">
            {groups.map((g) => (
                <section key={g.label}>
                    <h2 className="flex items-center gap-3 mb-4 text-lg font-black">
                        {g.label}
                        <span className="text-xs font-bold text-gray-400">{g.items.length}</span>
                        <span className="flex-1 h-px bg-black/10" />
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {g.items.map((t, i) => <TournamentCard key={`${t.id}-${i}`} t={t} onOpen={onOpen} />)}
                    </div>
                </section>
            ))}
        </div>
    );
}

function MonthView({ torneos, onOpen }) {
    const now = new Date();
    const [y, setY] = useState(now.getFullYear());
    const [m, setM] = useState(now.getMonth());
    const [selected, setSelected] = useState(null);

    const events = useMemo(() => {
        const map = {};
        torneos.forEach((t) => {
            const s = parseDate(t.fechaInicio);
            const e = parseDate(t.fechaFin) || s;
            if (!s) return;
            for (const d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) (map[keyOf(d)] ||= []).push(t);
        });
        return map;
    }, [torneos]);

    const move = (delta) => {
        const d = new Date(y, m + delta, 1);
        setY(d.getFullYear());
        setM(d.getMonth());
        setSelected(null);
    };

    const offset = (new Date(y, m, 1).getDay() + 6) % 7;
    const days = new Date(y, m + 1, 0).getDate();
    const cells = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
    while (cells.length % 7) cells.push(null);

    const today = keyOf(now);
    const selKey = selected ? keyOf(new Date(y, m, selected)) : null;
    const selEvents = selKey ? events[selKey] || [] : [];

    return (
        <div>
            <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
                    <button onClick={() => move(-1)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center" aria-label="Mes anterior">
                        <Icon name="arrowLeft" />
                    </button>
                    <h2 className="text-lg font-black">{MONTHS[m]} {y}</h2>
                    <button onClick={() => move(1)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center" aria-label="Mes siguiente">
                        <Icon name="arrow" />
                    </button>
                </div>
                <div className="grid grid-cols-7 text-center text-[11px] font-bold uppercase tracking-wider text-gray-400 py-2 border-b border-gray-100">
                    {WEEKDAYS.map((d) => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7">
                    {cells.map((day, i) => {
                        if (!day) return <div key={i} className="h-16 sm:h-24 border-b border-r border-gray-50" />;
                        const k = keyOf(new Date(y, m, day));
                        const ev = events[k] || [];
                        const isSel = day === selected;
                        return (
                            <button
                                key={i}
                                onClick={() => setSelected(isSel ? null : day)}
                                className={`h-16 sm:h-24 border-b border-r border-gray-100 p-1.5 sm:p-2 flex flex-col items-start text-left transition-colors ${isSel ? "bg-[#1CA9C9]/10" : ev.length ? "hover:bg-gray-50" : ""}`}
                            >
                                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${k === today ? "bg-[#0D5C6E] text-white" : isSel ? "text-[#0D5C6E]" : "text-gray-700"}`}>
                                    {day}
                                </span>
                                {ev.length > 0 && (
                                    <span className="mt-auto flex flex-wrap items-center gap-1">
                                        {ev.some(isFem) && <span className="w-2 h-2 rounded-full bg-pink-400" />}
                                        {ev.some((t) => !isFem(t)) && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                                        <span className="hidden sm:inline text-[10px] font-semibold text-gray-500">{ev.length} torneo{ev.length > 1 ? "s" : ""}</span>
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
                <div className="px-4 sm:px-6 py-3 bg-gray-50/70 flex flex-wrap gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-pink-400" /> Femenino</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Masculino</span>
                    <span className="ml-auto">Pulsa un día para ver sus torneos</span>
                </div>
            </div>

            {selected && (
                <div className="mt-6 animate-fade-in">
                    <h3 className="font-black mb-3">{selected} de {MONTHS[m].toLowerCase()} · <span className="text-gray-500 font-semibold">{selEvents.length ? `${selEvents.length} torneo${selEvents.length > 1 ? "s" : ""}` : "sin torneos"}</span></h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {selEvents.map((t, i) => <TournamentCard key={`${t.id}-${i}`} t={t} onOpen={onOpen} />)}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Calendar({ torneos = [] }) {
    const [view, setView] = useState("lista");
    const [gender, setGender] = useState("all");
    const [search, setSearch] = useState("");
    const [modal, setModal] = useState(null);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return torneos.filter((t) =>
            (gender === "all" || (gender === "f" ? isFem(t) : !isFem(t))) &&
            (!q || [t.torneo, t.localidad, t.sede, t.provincia, t.federacion].some((v) => v?.toLowerCase().includes(q)))
        );
    }, [torneos, gender, search]);

    const open = async (t) => {
        setModal({ t, loading: true, html: "" });
        try {
            const res = await fetch(`/calendario/clasificacion/${t.id}`);
            const data = await res.json();
            setModal({ t, loading: false, html: data.success ? data.html : "<p>No se pudo cargar la clasificación.</p>" });
        } catch {
            setModal({ t, loading: false, html: "<p>Error al cargar la clasificación.</p>" });
        }
    };

    const canarias = torneos.filter((t) => /canari/i.test(t.federacion || "") || /palmas|tenerife/i.test(t.provincia || "")).length;

    return (
        <PageShell title="Calendario de torneos - Las Canteras Beach Volley">
            <PageHero
                compact
                eyebrow="Pruebas puntuables RFEVB"
                title="Calendario de torneos"
                subtitle="Torneos homologados válidos para el ranking nacional en los próximos cuatro meses."
            >
                <div className="mt-8 flex flex-wrap gap-3">
                    <span className="rounded-full bg-white/10 ring-1 ring-white/15 px-4 py-2 text-sm text-white"><b className="font-black">{torneos.length}</b> torneos</span>
                    {canarias > 0 && <span className="rounded-full bg-white/10 ring-1 ring-white/15 px-4 py-2 text-sm text-white"><b className="font-black">{canarias}</b> en Canarias</span>}
                </div>
            </PageHero>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-8">
                    <SearchInput value={search} onChange={setSearch} placeholder="Torneo, localidad, sede o federación…" className="flex-1" />
                    <div className="flex flex-wrap gap-2">
                        <Segmented
                            size="sm"
                            value={gender}
                            onChange={setGender}
                            options={[
                                { value: "all", label: "Todos" },
                                { value: "m", label: "Masculino" },
                                { value: "f", label: "Femenino" },
                            ]}
                        />
                        <Segmented
                            size="sm"
                            value={view}
                            onChange={setView}
                            options={[
                                { value: "lista", label: "Lista", icon: "list" },
                                { value: "mes", label: "Mes", icon: "grid" },
                            ]}
                        />
                    </div>
                </div>

                {view === "lista" ? <ListView torneos={filtered} onOpen={open} /> : <MonthView torneos={filtered} onOpen={open} />}

                <p className="mt-12 text-center text-xs text-gray-500">
                    Fuente: <a href="https://www.rfevb.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0D5C6E] hover:underline">RFEVB</a>
                </p>
            </main>

            <Modal open={!!modal} onClose={() => setModal(null)} subtitle="Clasificación" title={modal?.t.torneo}>
                {modal?.loading ? <Spinner label="Cargando clasificación…" /> : <div className="rfevb-html" dangerouslySetInnerHTML={{ __html: modal?.html || "" }} />}
            </Modal>

            <style>{RFEVB_TABLE_CSS("rfevb-html")}</style>
        </PageShell>
    );
}

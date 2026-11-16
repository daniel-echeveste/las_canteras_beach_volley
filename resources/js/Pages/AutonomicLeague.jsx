import React, { useEffect, useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import SiteFooter from "@/Components/SiteFooter";
import { Icon, Segmented, SectionTitle, TeamAvatar } from "@/Components/ui";

/* -------------------------------------------------------------------------- */
/*  Utilidades de fecha (las fechas de la API ya vienen en hora canaria)       */
/* -------------------------------------------------------------------------- */

const TZ = "Atlantic/Canary";

const todayISO = () =>
    new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

const toDate = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
};

const fmtDay = (iso, opts = { weekday: "short", day: "numeric", month: "short" }) =>
    new Intl.DateTimeFormat("es-ES", opts).format(toDate(iso)).replace(/\./g, "");

const fmtLongDay = (iso) => {
    const s = fmtDay(iso, { weekday: "long", day: "numeric", month: "long" });
    return s.charAt(0).toUpperCase() + s.slice(1);
};

const fmtSynced = (iso) =>
    new Intl.DateTimeFormat("es-ES", {
        timeZone: TZ, weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
    }).format(new Date(iso));

const sortKey = (m) => `${m.date ?? "9999-99-99"} ${m.time ?? "99:99"}`;

const hasScore = (m) => m.finished && m.homeSets !== null && m.awaySets !== null;

const winnerOf = (m) => {
    if (!hasScore(m) || m.homeSets === m.awaySets) return null;
    return m.homeSets > m.awaySets ? m.home?.id : m.away?.id;
};

const involves = (m, teamId) => !teamId || m.home?.id === teamId || m.away?.id === teamId;

const mapsUrl = (f) =>
    f && f.lat && f.lng ? `https://www.google.com/maps/search/?api=1&query=${f.lat},${f.lng}` : null;

/* -------------------------------------------------------------------------- */
/*  Componentes pequeños                                                      */
/* -------------------------------------------------------------------------- */

function StatusBadge({ match, today }) {
    if (match.canceled) return <span className="badge bg-gray-100 text-gray-600">Cancelado</span>;
    if (match.postponed) return <span className="badge bg-red-50 text-red-600">Aplazado</span>;
    if (hasScore(match)) return <span className="badge bg-emerald-50 text-emerald-700">Final</span>;
    if (match.date && match.date === today) return <span className="badge bg-amber-100 text-amber-800">Hoy</span>;
    if (match.date && match.date < today) return <span className="badge bg-gray-100 text-gray-500">Sin resultado</span>;
    return null;
}

function TeamLine({ team, sets, isWinner, isLoser, highlighted }) {
    return (
        <div className="flex items-center gap-3 min-w-0">
            <TeamAvatar team={team} />
            <span
                className={`flex-1 min-w-0 truncate text-[15px] ${isLoser ? "text-gray-400 font-medium" : "text-gray-900 font-semibold"} ${highlighted ? "underline decoration-[#1CA9C9] decoration-2 underline-offset-4" : ""}`}
                title={team?.name}
            >
                {team?.name ?? "Por determinar"}
            </span>
            {sets !== null && sets !== undefined && (
                <span className={`w-8 text-right text-xl tabular-nums ${isWinner ? "font-extrabold text-gray-900" : "font-semibold text-gray-400"}`}>
                    {sets}
                </span>
            )}
        </div>
    );
}

function MatchCard({ match, today, showRound = true, teamId }) {
    const winner = winnerOf(match);
    const score = hasScore(match);
    const map = mapsUrl(match.facility);
    const dim = match.canceled || match.postponed;

    return (
        <article className={`bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow p-4 ${dim ? "opacity-75" : ""}`}>
            <header className="flex items-center justify-between gap-2 mb-3 text-xs text-gray-500">
                <div className="flex items-center gap-2 min-w-0">
                    {showRound && match.round && (
                        <span className="font-bold text-[#0D5C6E] bg-[#E6F6FA] rounded-md px-1.5 py-0.5">J{match.round}</span>
                    )}
                    <span className="capitalize truncate">
                        {match.date ? fmtDay(match.date) : "Fecha por confirmar"}
                        {match.time && <span className="text-gray-400"> · {match.time}</span>}
                    </span>
                </div>
                <StatusBadge match={match} today={today} />
            </header>

            <div className="space-y-2.5">
                <TeamLine
                    team={match.home}
                    sets={score ? match.homeSets : null}
                    isWinner={winner && winner === match.home?.id}
                    isLoser={winner && winner !== match.home?.id}
                    highlighted={teamId && match.home?.id === teamId}
                />
                <TeamLine
                    team={match.away}
                    sets={score ? match.awaySets : null}
                    isWinner={winner && winner === match.away?.id}
                    isLoser={winner && winner !== match.away?.id}
                    highlighted={teamId && match.away?.id === teamId}
                />
            </div>

            {match.facility?.name && (
                <footer className="mt-3 pt-3 border-t border-dashed border-gray-200 text-xs text-gray-500 flex items-center gap-1.5 min-w-0">
                    <Icon name="pin" className="w-3.5 h-3.5 shrink-0 text-[#1CA9C9]" />
                    {map ? (
                        <a href={map} target="_blank" rel="noopener noreferrer" className="truncate hover:text-[#1CA9C9] hover:underline">
                            {match.facility.name}
                        </a>
                    ) : (
                        <span className="truncate">{match.facility.name}</span>
                    )}
                </footer>
            )}
        </article>
    );
}

function FormDots({ form }) {
    if (!form.length) return <span className="text-gray-300">—</span>;
    return (
        <div className="flex gap-1 justify-center">
            {form.map((r, i) => (
                <span
                    key={i}
                    title={r === "W" ? "Victoria" : "Derrota"}
                    className={`w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center ${r === "W" ? "bg-emerald-500" : "bg-rose-400"}`}
                >
                    {r === "W" ? "V" : "D"}
                </span>
            ))}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Clasificación                                                             */
/* -------------------------------------------------------------------------- */

function StandingsTable({ standings, formByTeam, onSelectTeam }) {
    const th = "px-2 sm:px-3 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider";
    const td = "px-2 sm:px-3 py-3 text-center tabular-nums";

    return (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50/80 border-b border-gray-200">
                        <tr>
                            <th className={`${th} text-center w-10`}>#</th>
                            <th className={`${th} text-left`}>Equipo</th>
                            <th className={`${th} text-center`} title="Puntos">Pts</th>
                            <th className={`${th} text-center`} title="Partidos jugados">PJ</th>
                            <th className={`${th} text-center`} title="Ganados">G</th>
                            <th className={`${th} text-center`} title="Perdidos">P</th>
                            <th className={`${th} text-center hidden md:table-cell`} title="Sets a favor : en contra">Sets</th>
                            <th className={`${th} text-center hidden sm:table-cell`} title="Diferencia de sets">Dif</th>
                            <th className={`${th} text-center hidden lg:table-cell`} title="Diferencia de tantos">Tantos</th>
                            <th className={`${th} text-center hidden md:table-cell`}>Últimos</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {standings.map((t) => (
                            <tr
                                key={t.teamId}
                                onClick={() => onSelectTeam(t.teamId)}
                                className="group cursor-pointer hover:bg-[#1CA9C9]/[0.04] transition-colors"
                                title="Ver partidos del equipo"
                            >
                                <td className="px-2 sm:px-3 py-3 text-center">
                                    <span
                                        className={`inline-flex w-7 h-7 rounded-full items-center justify-center text-xs font-extrabold ${
                                            t.position === 1
                                                ? "bg-[#FFD369] text-[#5c3d00]"
                                                : t.position <= 3
                                                    ? "bg-[#1CA9C9]/15 text-[#0D5C6E]"
                                                    : "text-gray-500"
                                        }`}
                                    >
                                        {t.position}
                                    </span>
                                </td>
                                <td className="px-2 sm:px-3 py-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <TeamAvatar team={t} size="w-8 h-8" />
                                        <span className="font-semibold text-gray-900 truncate max-w-[9rem] sm:max-w-none group-hover:text-[#0D5C6E]">
                                            {t.name}
                                        </span>
                                    </div>
                                </td>
                                <td className={td}>
                                    <span className="font-extrabold text-gray-900 text-base">{t.points}</span>
                                </td>
                                <td className={`${td} text-gray-600`}>{t.played}</td>
                                <td className={`${td} text-gray-600`}>{t.won}</td>
                                <td className={`${td} text-gray-600`}>{t.lost}</td>
                                <td className={`${td} text-gray-600 hidden md:table-cell`}>
                                    {t.setsWon}<span className="text-gray-300 mx-0.5">:</span>{t.setsLost}
                                </td>
                                <td className={`${td} hidden sm:table-cell font-semibold ${t.setsDiff > 0 ? "text-emerald-600" : t.setsDiff < 0 ? "text-rose-500" : "text-gray-400"}`}>
                                    {t.setsDiff > 0 ? "+" : ""}{t.setsDiff}
                                </td>
                                <td className={`${td} hidden lg:table-cell ${t.pointsDiff > 0 ? "text-emerald-600" : t.pointsDiff < 0 ? "text-rose-500" : "text-gray-400"}`}>
                                    {t.pointsDiff > 0 ? "+" : ""}{t.pointsDiff}
                                </td>
                                <td className={`${td} hidden md:table-cell`}>
                                    <FormDots form={formByTeam[t.teamId] || []} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/60 text-[11px] text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                <span><b>Pts</b> puntos (3‑0 = 3 · 2‑1 = 2 · 1‑2 = 1)</span>
                <span><b>PJ</b> jugados</span>
                <span><b>G/P</b> ganados / perdidos</span>
                <span><b>Dif</b> diferencia de sets</span>
                <span className="text-[#0D5C6E]">Pulsa un equipo para ver sus partidos</span>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Página                                                                    */
/* -------------------------------------------------------------------------- */

const readQuery = (key, fallback) => {
    if (typeof window === "undefined") return fallback;
    return new URLSearchParams(window.location.search).get(key) || fallback;
};

export default function AutonomicLeague({ season, leagues, syncedAt }) {
    const [category, setCategory] = useState(() => (readQuery("cat", "male") === "female" ? "female" : "male"));
    const [tab, setTab] = useState(() => (readQuery("tab", "") === "calendario" ? "calendario" : "clasificacion"));
    const [calView, setCalView] = useState("proximos");
    const [teamId, setTeamId] = useState(null);
    const [round, setRound] = useState(null);

    const today = useMemo(todayISO, []);
    const league = leagues?.[category] ?? null;

    // Mantener la categoría/pestaña en la URL para poder compartir el enlace
    useEffect(() => {
        const url = new URL(window.location.href);
        url.searchParams.set("cat", category);
        url.searchParams.set("tab", tab);
        window.history.replaceState(window.history.state, "", url);
    }, [category, tab]);

    // Al cambiar de categoría se resetean los filtros
    useEffect(() => {
        setTeamId(null);
        setRound(null);
    }, [category]);

    const data = useMemo(() => {
        if (!league) return null;

        const all = league.rounds.flatMap((r) => r.matches.map((m) => ({ ...m, round: r.number })));
        const played = all.filter(hasScore);
        const live = all.filter((m) => !m.canceled);

        const upcoming = live
            .filter((m) => !m.finished && (!m.date || m.date >= today))
            .sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

        const results = all
            .filter((m) => m.finished || (m.date && m.date < today))
            .sort((a, b) => sortKey(b).localeCompare(sortKey(a)));

        // Racha de los últimos 5 partidos de cada equipo
        const formByTeam = {};
        [...played]
            .sort((a, b) => sortKey(b).localeCompare(sortKey(a)))
            .forEach((m) => {
                const w = winnerOf(m);
                [m.home, m.away].forEach((t) => {
                    if (!t) return;
                    formByTeam[t.id] = formByTeam[t.id] || [];
                    if (formByTeam[t.id].length < 5) formByTeam[t.id].push(w === t.id ? "W" : "L");
                });
            });
        Object.values(formByTeam).forEach((f) => f.reverse());

        // Jornada "actual": la del próximo partido con fecha
        const nextDated = upcoming.find((m) => m.date);
        const currentRound = nextDated?.round ?? league.rounds.at(-1)?.number ?? 1;

        const teams = [...league.teams].sort((a, b) => a.name.localeCompare(b.name));

        return { all, played, upcoming, results, formByTeam, currentRound, teams };
    }, [league, today]);

    const selectedRound = round ?? data?.currentRound;
    const selectedTeam = data?.teams.find((t) => t.id === teamId) ?? null;

    const selectTeamFromTable = (id) => {
        setTeamId(id);
        setTab("calendario");
        setCalView("proximos");
        document.getElementById("liga-contenido")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const leader = league?.standings?.[0];
    const progress = data ? Math.round((data.played.length / Math.max(1, data.all.filter((m) => !m.canceled).length)) * 100) : 0;

    return (
        <>
            <Head title={`Liga 2ª División ${season} · Vóley Playa - Las Canteras Beach Volley`} />

            <div className="min-h-screen bg-[#FFF8E8] text-gray-900 font-sans">
                <Navbar />

                {/* ================= HERO ================= */}
                <section className="relative pt-28 pb-24 overflow-hidden bg-[#0D5C6E]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1CA9C9] via-[#127F98] to-[#0B3F4C]" />
                    <div className="absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-[#FFD369]/20 blur-3xl" />
                    <div className="absolute -bottom-40 -left-20 w-[26rem] h-[26rem] rounded-full bg-white/10 blur-3xl" />
                    {/* Red de vóley decorativa */}
                    <svg className="absolute right-0 top-24 w-[34rem] max-w-[60%] opacity-[0.08] hidden md:block" viewBox="0 0 400 160" fill="none" stroke="white" strokeWidth="1.5" aria-hidden="true">
                        <rect x="10" y="10" width="380" height="20" rx="3" />
                        {Array.from({ length: 19 }).map((_, i) => <line key={`v${i}`} x1={20 + i * 20} y1="30" x2={20 + i * 20} y2="150" />)}
                        {Array.from({ length: 6 }).map((_, i) => <line key={`h${i}`} x1="10" y1={50 + i * 20} x2="390" y2={50 + i * 20} />)}
                    </svg>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                            <div className="max-w-2xl">
                                <span className="inline-flex items-center gap-2 text-[#FFD369] text-xs font-bold uppercase tracking-[0.2em] mb-4">
                                    <span className="w-6 h-px bg-[#FFD369]" />
                                    Vóley Playa · Temporada {season}
                                </span>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">
                                    Liga 2ª División
                                    <span className="block text-white/70 font-extrabold text-2xl sm:text-3xl mt-2">
                                        Nacional · {category === "female" ? "Femenina" : "Masculina"}
                                    </span>
                                </h1>
                                <p className="mt-5 text-white/75 text-base sm:text-lg">
                                    Calendario, resultados y clasificación oficial de la Federación Canaria de Voleibol.
                                </p>
                            </div>

                            <Segmented
                                dark
                                value={category}
                                onChange={setCategory}
                                options={[
                                    { value: "male", label: "Masculino" },
                                    { value: "female", label: "Femenino" },
                                ]}
                            />
                        </div>

                        {data && (
                            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                <HeroStat label="Líder" value={leader?.name ?? "—"} sub={leader ? `${leader.points} pts` : ""} avatar={leader} />
                                <HeroStat label="Equipos" value={league.teams.length} sub={`${league.rounds.length} jornadas`} />
                                <HeroStat label="Partidos jugados" value={`${data.played.length}/${data.all.filter((m) => !m.canceled).length}`} progress={progress} />
                                <HeroStat
                                    label="Próximo partido"
                                    value={data.upcoming.find((m) => m.date) ? fmtDay(data.upcoming.find((m) => m.date).date) : "—"}
                                    sub={data.upcoming.find((m) => m.date)?.time ?? ""}
                                />
                            </div>
                        )}
                    </div>

                    {/* Ola inferior */}
                    <svg className="absolute bottom-0 left-0 w-full h-12 text-[#FFF8E8]" viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true">
                        <path fill="currentColor" d="M0 32c120-18 240-27 360-27s240 9 360 18 240 13 360 9 240-14 360-27v43H0z" />
                    </svg>
                </section>

                {/* ================= TABS ================= */}
                <div id="liga-contenido" className="sticky top-20 z-30 bg-[#FFF8E8]/90 backdrop-blur border-b border-black/5 scroll-mt-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
                        <Segmented
                            value={tab}
                            onChange={setTab}
                            options={[
                                { value: "clasificacion", label: "Clasificación" },
                                { value: "calendario", label: "Calendario y resultados" },
                            ]}
                        />
                        {syncedAt && (
                            <span className="hidden md:flex items-center gap-1.5 text-xs text-gray-500" title="Los datos se actualizan automáticamente cada lunes">
                                <Icon name="refresh" className="w-3.5 h-3.5" />
                                Actualizado el {fmtSynced(syncedAt)}
                            </span>
                        )}
                    </div>
                </div>

                {/* ================= CONTENIDO ================= */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                    {!data ? (
                        <EmptyState />
                    ) : tab === "clasificacion" ? (
                        <div key={`cl-${category}`} className="grid lg:grid-cols-3 gap-8 animate-fade-in">
                            <div className="lg:col-span-2">
                                <SectionTitle icon="trophy">Clasificación</SectionTitle>
                                <StandingsTable standings={league.standings} formByTeam={data.formByTeam} onSelectTeam={selectTeamFromTable} />
                            </div>

                            <aside className="space-y-8">
                                <div>
                                    <SectionTitle
                                        icon="clock"
                                        action={<MoreButton onClick={() => { setTab("calendario"); setCalView("proximos"); }} />}
                                    >
                                        Próximos partidos
                                    </SectionTitle>
                                    <div className="space-y-3">
                                        {data.upcoming.slice(0, 3).map((m) => <MatchCard key={m.id} match={m} today={today} />)}
                                        {!data.upcoming.length && <p className="text-sm text-gray-500">No quedan partidos por jugar.</p>}
                                    </div>
                                </div>
                                <div>
                                    <SectionTitle
                                        icon="calendar"
                                        action={<MoreButton onClick={() => { setTab("calendario"); setCalView("resultados"); }} />}
                                    >
                                        Últimos resultados
                                    </SectionTitle>
                                    <div className="space-y-3">
                                        {data.played
                                            .slice()
                                            .sort((a, b) => sortKey(b).localeCompare(sortKey(a)))
                                            .slice(0, 3)
                                            .map((m) => <MatchCard key={m.id} match={m} today={today} />)}
                                        {!data.played.length && <p className="text-sm text-gray-500">Todavía no hay resultados.</p>}
                                    </div>
                                </div>
                            </aside>
                        </div>
                    ) : (
                        <div key={`ca-${category}`} className="animate-fade-in">
                            {/* Controles */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                                    <Segmented
                                        value={calView}
                                        onChange={setCalView}
                                        options={[
                                            { value: "proximos", label: "Próximos" },
                                            { value: "resultados", label: "Resultados" },
                                            { value: "jornadas", label: "Por jornada" },
                                        ]}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <label htmlFor="team-filter" className="sr-only">Filtrar por equipo</label>
                                    <select
                                        id="team-filter"
                                        value={teamId ?? ""}
                                        onChange={(e) => setTeamId(e.target.value ? Number(e.target.value) : null)}
                                        className="w-full md:w-72 rounded-full border-gray-200 bg-white text-sm font-medium shadow-sm focus:border-[#1CA9C9] focus:ring-[#1CA9C9]"
                                    >
                                        <option value="">Todos los equipos</option>
                                        {data.teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                    {teamId && (
                                        <button
                                            onClick={() => setTeamId(null)}
                                            className="shrink-0 w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center"
                                            aria-label="Quitar filtro"
                                        >
                                            <Icon name="x" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {selectedTeam && <TeamSummary team={selectedTeam} league={league} form={data.formByTeam[selectedTeam.id] || []} />}

                            {calView === "jornadas" && (
                                <RoundPicker rounds={league.rounds} value={selectedRound} current={data.currentRound} onChange={setRound} />
                            )}

                            {calView === "proximos" && (
                                <DayGroups matches={data.upcoming.filter((m) => involves(m, teamId))} today={today} teamId={teamId} empty="No hay partidos pendientes." />
                            )}
                            {calView === "resultados" && (
                                <DayGroups matches={data.results.filter((m) => involves(m, teamId))} today={today} teamId={teamId} empty="Todavía no hay resultados." />
                            )}
                            {calView === "jornadas" && (
                                <MatchGrid
                                    matches={data.all
                                        .filter((m) => m.round === selectedRound && involves(m, teamId))
                                        .sort((a, b) => sortKey(a).localeCompare(sortKey(b)))}
                                    today={today}
                                    teamId={teamId}
                                    showRound={false}
                                    empty="Ningún partido en esta jornada para el equipo seleccionado."
                                />
                            )}
                        </div>
                    )}

                    {league && (
                        <p className="mt-12 text-center text-xs text-gray-500 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                            <span>Fuente oficial: Federación Canaria de Voleibol</span>
                            <a href={league.links.calendar} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#0D5C6E] hover:underline">
                                Calendario FCANVB <Icon name="external" className="w-3 h-3" />
                            </a>
                            <a href={league.links.standings} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#0D5C6E] hover:underline">
                                Clasificación FCANVB <Icon name="external" className="w-3 h-3" />
                            </a>
                            {syncedAt && <span className="md:hidden">Actualizado el {fmtSynced(syncedAt)}</span>}
                        </p>
                    )}
                </main>

                {/* ================= CTA ================= */}
                <section className="px-4 sm:px-6 pb-16">
                    <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-[#FFD369] to-[#FFA500] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black text-black">¿Y el ranking nacional?</h2>
                            <p className="text-black/70 mt-2">Consulta el ranking oficial de la RFEVB con los mejores jugadores de España.</p>
                        </div>
                        <Link
                            href="/ranking"
                            className="shrink-0 inline-flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-full hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
                        >
                            Ver ranking <Icon name="arrow" />
                        </Link>
                    </div>
                </section>

                <SiteFooter />
            </div>

            <style>{`
                .badge { display:inline-flex; align-items:center; border-radius:9999px; padding:2px 8px; font-size:11px; font-weight:700; white-space:nowrap; }
                @keyframes fade-in { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
                .animate-fade-in { animation: fade-in .35s ease-out both; }
                @media (prefers-reduced-motion: reduce) { .animate-fade-in { animation:none; } }
            `}</style>
        </>
    );
}

/* -------------------------------------------------------------------------- */
/*  Piezas de la página                                                       */
/* -------------------------------------------------------------------------- */

function HeroStat({ label, value, sub, progress, avatar }) {
    return (
        <div className="rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/15 p-4 sm:p-5 min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/60">{label}</div>
            <div className="mt-2 flex items-center gap-2.5 min-w-0">
                {avatar && <TeamAvatar team={avatar} size="w-8 h-8" />}
                <div className="text-white font-extrabold text-lg sm:text-2xl truncate capitalize" title={String(value)}>{value}</div>
            </div>
            {progress !== undefined ? (
                <div className="mt-3 h-1.5 rounded-full bg-white/15 overflow-hidden">
                    <div className="h-full rounded-full bg-[#FFD369]" style={{ width: `${progress}%` }} />
                </div>
            ) : (
                sub && <div className="mt-1 text-sm text-white/60">{sub}</div>
            )}
        </div>
    );
}

function MoreButton({ onClick }) {
    return (
        <button onClick={onClick} className="text-sm font-semibold text-[#0D5C6E] hover:text-[#1CA9C9] inline-flex items-center gap-0.5">
            Ver todos <Icon name="arrow" className="w-3.5 h-3.5" />
        </button>
    );
}

function MatchGrid({ matches, today, teamId, showRound = true, empty }) {
    if (!matches.length) return <p className="text-center text-gray-500 py-12">{empty}</p>;
    return (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {matches.map((m) => <MatchCard key={m.id} match={m} today={today} teamId={teamId} showRound={showRound} />)}
        </div>
    );
}

function DayGroups({ matches, today, teamId, empty }) {
    if (!matches.length) return <p className="text-center text-gray-500 py-12">{empty}</p>;

    const groups = [];
    matches.forEach((m) => {
        const key = m.date ?? "sin-fecha";
        const last = groups[groups.length - 1];
        if (last && last.key === key) last.matches.push(m);
        else groups.push({ key, matches: [m] });
    });

    return (
        <div className="space-y-8">
            {groups.map((g) => (
                <section key={g.key}>
                    <h3 className="flex items-center gap-3 mb-3 text-sm font-bold text-gray-700">
                        {g.key === "sin-fecha" ? "Fecha por confirmar" : fmtLongDay(g.key)}
                        {g.key === today && <span className="badge bg-amber-100 text-amber-800">Hoy</span>}
                        <span className="flex-1 h-px bg-gray-200" />
                    </h3>
                    <MatchGrid matches={g.matches} today={today} teamId={teamId} />
                </section>
            ))}
        </div>
    );
}

function RoundPicker({ rounds, value, current, onChange }) {
    return (
        <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
            <div className="flex gap-2 pb-1 w-max">
                {rounds.map((r) => {
                    const active = r.number === value;
                    const done = r.matches.length > 0 && r.matches.every((m) => m.finished || m.canceled);
                    return (
                        <button
                            key={r.number}
                            onClick={() => onChange(r.number)}
                            className={`relative min-w-[3rem] h-11 px-3 rounded-xl text-sm font-bold transition-all border ${
                                active
                                    ? "bg-[#0D5C6E] text-white border-[#0D5C6E] shadow"
                                    : done
                                        ? "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                                        : "bg-white text-gray-800 border-gray-200 hover:border-[#1CA9C9]"
                            }`}
                            title={`Jornada ${r.number}`}
                        >
                            J{r.number}
                            {r.number === current && !active && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FFA500] ring-2 ring-[#FFF8E8]" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function TeamSummary({ team, league, form }) {
    const row = league.standings.find((s) => s.teamId === team.id);
    return (
        <div className="mb-6 bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <TeamAvatar team={team} size="w-12 h-12" />
                <div className="min-w-0">
                    <div className="font-extrabold text-lg truncate">{team.name}</div>
                    {row && <div className="text-sm text-gray-500">{row.position}º en la clasificación</div>}
                </div>
            </div>
            {row && (
                <div className="flex items-center gap-5 sm:gap-6 text-center">
                    <Mini label="Pts" value={row.points} strong />
                    <Mini label="PJ" value={row.played} />
                    <Mini label="G" value={row.won} />
                    <Mini label="P" value={row.lost} />
                    <div className="hidden sm:block"><FormDots form={form} /></div>
                </div>
            )}
        </div>
    );
}

function Mini({ label, value, strong }) {
    return (
        <div>
            <div className={`tabular-nums ${strong ? "text-2xl font-black text-[#0D5C6E]" : "text-lg font-bold text-gray-800"}`}>{value}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="max-w-lg mx-auto text-center py-20">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1CA9C9]/10 text-[#1CA9C9] flex items-center justify-center mb-5">
                <Icon name="calendar" className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold">Datos no disponibles todavía</h2>
            <p className="text-gray-500 mt-2">
                Aún no hemos podido cargar el calendario de esta temporada. Los datos se actualizan automáticamente cada lunes.
            </p>
        </div>
    );
}

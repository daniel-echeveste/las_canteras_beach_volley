import React, { useState, useMemo } from "react";
import { Head } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";

const MONTH_NAMES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function parseDate(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

function getFactorColor(factor) {
    const f = parseFloat(factor);
    if (f >= 30) return { border: "border-amber-500", badge: "bg-amber-500", dot: "bg-amber-400", label: "Elite" };
    if (f >= 15) return { border: "border-purple-500", badge: "bg-purple-500", dot: "bg-purple-400", label: "CNVP" };
    if (f >= 4) return { border: "border-blue-500", badge: "bg-blue-500", dot: "bg-blue-400", label: "Nacional" };
    if (f >= 2) return { border: "border-teal-500", badge: "bg-teal-500", dot: "bg-teal-400", label: "Regional" };
    return { border: "border-gray-400", badge: "bg-gray-400", dot: "bg-gray-300", label: "Local" };
}

// ─── Tournament Card ──────────────────────────────────────────────────────────
function TorneoCard({ torneo, onOpenModal }) {
    const factorInfo = getFactorColor(torneo.factor);
    const isPast = torneo.fechaOrdenacion && new Date(torneo.fechaOrdenacion) < new Date();
    const isFem = torneo.categoria === "Senior-F";

    return (
        <div className={`bg-white rounded-xl shadow-sm border-l-4 ${factorInfo.border} hover:shadow-md transition-all duration-200 overflow-hidden ${isPast ? "opacity-70" : ""}`}>
            <div className="p-4 pb-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight flex-1">{torneo.torneo}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${factorInfo.badge} flex-shrink-0`}>
                        x{torneo.factor}
                    </span>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isFem ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700"}`}>
                    {isFem ? "♀ Femenino" : "♂ Masculino"}
                </span>
            </div>
            <div className="px-4 pb-2 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="flex-shrink-0">📅</span>
                    <span className="font-medium">
                        {torneo.fechaInicio === torneo.fechaFin
                            ? torneo.fechaInicio
                            : `${torneo.fechaInicio} → ${torneo.fechaFin}`}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="flex-shrink-0">📍</span>
                    <span>{torneo.sede && torneo.sede !== torneo.localidad ? `${torneo.sede}, ${torneo.localidad}` : torneo.localidad}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex-shrink-0">🏐</span>
                    <span>{torneo.federacion} ({torneo.alias})</span>
                </div>
                {torneo.fechaTopeInscripcion && (
                    <div className="flex items-center gap-2 text-xs text-orange-600">
                        <span className="flex-shrink-0">⏰</span>
                        <span>Inscripción hasta: {torneo.fechaTopeInscripcion}</span>
                    </div>
                )}
            </div>
            <div className="px-4 py-3 bg-gray-50 flex items-center justify-between gap-2">
                {torneo.coordenadas && torneo.coordenadas.startsWith("http") ? (
                    <a href={torneo.coordenadas} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-[#1CA9C9] transition-colors">
                        📍 Ver mapa
                    </a>
                ) : <span />}
                <button
                    onClick={() => onOpenModal(torneo.id, torneo.torneo)}
                    className="px-3 py-1.5 bg-[#1CA9C9] text-white text-xs font-semibold rounded-lg hover:bg-[#168a9c] transition-colors duration-200 shadow-sm"
                >
                    Ver Clasificación
                </button>
            </div>
        </div>
    );
}

// ─── Gender Sub-section ───────────────────────────────────────────────────────
function GenderSection({ label, icon, torneos, colorClass, bgClass, onOpenModal }) {
    const [open, setOpen] = useState(false);
    if (torneos.length === 0) return null;
    return (
        <div className="mb-4">
            <button
                onClick={() => setOpen(o => !o)}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${bgClass} hover:brightness-95 transition-all duration-200 text-left`}
            >
                <span className={`text-base ${colorClass}`}>{icon}</span>
                <span className={`font-semibold text-sm ${colorClass}`}>{label}</span>
                <span className={`ml-1 text-xs font-normal ${colorClass} opacity-70`}>({torneos.length} torneo{torneos.length !== 1 ? "s" : ""})</span>
                <svg className={`w-4 h-4 ml-auto ${colorClass} transition-transform duration-200 ${open ? "rotate-90" : "rotate-0"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
            {open && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 pl-3 border-l-2 border-gray-200 ml-2">
                    {torneos.map((torneo, idx) => (
                        <TorneoCard key={`${torneo.id}-${idx}`} torneo={torneo} onOpenModal={onOpenModal} />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Month Folder ─────────────────────────────────────────────────────────────
function MonthFolder({ label, masculino, femenino, onOpenModal }) {
    const [open, setOpen] = useState(false);
    const total = masculino.length + femenino.length;
    return (
        <div className="mb-4 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors duration-150 text-left"
            >
                <span className="text-xl leading-none">{open ? "📂" : "📁"}</span>
                <span className="font-bold text-gray-900 text-base sm:text-lg flex-1">{label}</span>
                <span className="text-xs text-gray-400 font-medium mr-2">{total} torneo{total !== 1 ? "s" : ""}</span>
                <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${open ? "rotate-90" : "rotate-0"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
            {open && (
                <div className="px-5 pb-5 pt-2 border-t border-gray-100">
                    <GenderSection label="Femenino" icon="♀" torneos={femenino} colorClass="text-pink-700" bgClass="bg-pink-50" onOpenModal={onOpenModal} />
                    <GenderSection label="Masculino" icon="♂" torneos={masculino} colorClass="text-blue-700" bgClass="bg-blue-50" onOpenModal={onOpenModal} />
                </div>
            )}
        </div>
    );
}

// ─── Calendar Grid View ───────────────────────────────────────────────────────
function CalendarGrid({ torneos, onOpenModal }) {
    const now = new Date();
    const [viewYear, setViewYear] = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth());
    const [selectedDay, setSelectedDay] = useState(null);

    // Build a map: "YYYY-MM-DD" -> [torneos active that day]
    const eventMap = useMemo(() => {
        const map = {};
        torneos.forEach(t => {
            const start = parseDate(t.fechaInicio);
            const end = parseDate(t.fechaFin) || start;
            if (!start) return;
            // Mark every day in the range
            const cur = new Date(start);
            while (cur <= end) {
                const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`;
                if (!map[key]) map[key] = [];
                map[key].push(t);
                cur.setDate(cur.getDate() + 1);
            }
        });
        return map;
    }, [torneos]);

    const prevMonth = () => {
        setSelectedDay(null);
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        setSelectedDay(null);
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    // Days in the grid
    const firstDay = new Date(viewYear, viewMonth, 1);
    // Monday-based weekday offset (0=Mon … 6=Sun)
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    // pad to complete last row
    while (cells.length % 7 !== 0) cells.push(null);

    const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const getKey = (day) => `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const selectedKey = selectedDay ? getKey(selectedDay) : null;
    const selectedTorneos = selectedKey ? (eventMap[selectedKey] || []) : [];

    return (
        <div>
            {/* Month navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
                <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#1CA9C9] to-[#168a9c]">
                    <button onClick={prevMonth} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className="text-white font-bold text-lg">
                        {MONTH_NAMES[viewMonth]} {viewYear}
                    </h2>
                    <button onClick={nextMonth} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 border-b border-gray-100">
                    {DAY_NAMES.map(d => (
                        <div key={d} className="py-2 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7">
                    {cells.map((day, idx) => {
                        if (!day) {
                            return <div key={`empty-${idx}`} className="h-16 sm:h-20 border-b border-r border-gray-50 last:border-r-0" />;
                        }
                        const key = getKey(day);
                        const events = eventMap[key] || [];
                        const isToday = key === todayKey;
                        const isSelected = day === selectedDay;
                        const hasFem = events.some(e => e.categoria === "Senior-F");
                        const hasMasc = events.some(e => e.categoria === "Senior-M");

                        return (
                            <button
                                key={key}
                                onClick={() => setSelectedDay(isSelected ? null : day)}
                                className={`h-16 sm:h-20 border-b border-r border-gray-100 last:border-r-0 p-1.5 text-left transition-colors duration-150 flex flex-col
                                    ${isSelected ? "bg-[#1CA9C9]/10 ring-2 ring-inset ring-[#1CA9C9]" : "hover:bg-gray-50"}
                                    ${events.length > 0 ? "cursor-pointer" : "cursor-default"}
                                `}
                            >
                                <span className={`text-xs sm:text-sm font-semibold w-6 h-6 flex items-center justify-center rounded-full
                                    ${isToday ? "bg-[#1CA9C9] text-white" : "text-gray-700"}`}>
                                    {day}
                                </span>
                                {events.length > 0 && (
                                    <div className="flex flex-wrap gap-0.5 mt-1">
                                        {hasFem && (
                                            <span className="inline-flex items-center gap-0.5 bg-pink-100 text-pink-700 text-[9px] font-bold px-1 py-0.5 rounded">
                                                ♀
                                            </span>
                                        )}
                                        {hasMasc && (
                                            <span className="inline-flex items-center gap-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold px-1 py-0.5 rounded">
                                                ♂
                                            </span>
                                        )}
                                        <span className="text-[9px] text-gray-400 font-medium leading-tight mt-0.5">
                                            {events.length} {events.length === 1 ? "torneo" : "torneos"}
                                        </span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#1CA9C9] inline-block"></span> Hoy
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="bg-pink-100 text-pink-700 text-[9px] font-bold px-1 py-0.5 rounded">♀</span> Femenino
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-1 py-0.5 rounded">♂</span> Masculino
                    </span>
                    <span className="ml-auto text-gray-400 italic">Haz clic en un día para ver los torneos</span>
                </div>
            </div>

            {/* Selected day panel */}
            {selectedDay && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
                    <h3 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
                        <span className="bg-[#1CA9C9] text-white px-3 py-1 rounded-lg text-sm">{selectedDay} de {MONTH_NAMES[viewMonth]}</span>
                        <span className="text-sm text-gray-500 font-normal">
                            {selectedTorneos.length === 0
                                ? "Sin torneos este día"
                                : `${selectedTorneos.length} torneo${selectedTorneos.length !== 1 ? "s" : ""}`}
                        </span>
                    </h3>
                    {selectedTorneos.length === 0 ? (
                        <p className="text-gray-400 text-sm">No hay torneos programados para este día.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedTorneos.map((t, idx) => (
                                <TorneoCard key={`${t.id}-${idx}`} torneo={t} onOpenModal={onOpenModal} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Calendar({ torneos }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [view, setView] = useState("calendario"); // "lista" | "calendario"
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalLoading, setModalLoading] = useState(false);
    const [selectedTorneo, setSelectedTorneo] = useState("");

    const filteredTorneos = useMemo(() => {
        if (!searchTerm) return torneos;
        const q = searchTerm.toLowerCase();
        return torneos.filter(t =>
            t.torneo.toLowerCase().includes(q) ||
            t.localidad.toLowerCase().includes(q) ||
            t.sede.toLowerCase().includes(q)
        );
    }, [torneos, searchTerm]);

    const groupedByMonth = useMemo(() => {
        const groups = {};
        filteredTorneos.forEach(t => {
            const date = parseDate(t.fechaInicio);
            if (!date) return;
            const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`;
            const label = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
            if (!groups[key]) groups[key] = { label, masculino: [], femenino: [], other: [] };
            if (t.categoria === "Senior-M") groups[key].masculino.push(t);
            else if (t.categoria === "Senior-F") groups[key].femenino.push(t);
            else groups[key].other.push(t);
        });
        return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
    }, [filteredTorneos]);

    const openClasificacionModal = async (idTorneo, torneoName) => {
        setSelectedTorneo(torneoName);
        setModalOpen(true);
        setModalLoading(true);
        setModalContent("");
        try {
            const response = await fetch(`/calendario/clasificacion/${idTorneo}`);
            const data = await response.json();
            setModalContent(data.success ? data.html : "<p>No se pudo cargar la clasificación.</p>");
        } catch {
            setModalContent("<p>Error al cargar la clasificación.</p>");
        } finally {
            setModalLoading(false);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalContent("");
        setSelectedTorneo("");
    };

    const totalCount = filteredTorneos.length;

    return (
        <>
            <Head title="Calendario Pruebas Puntuables - Las Canteras Vóley" />
            <div className="min-h-screen bg-[#FFF8E8] text-gray-900 font-sans">
                <Navbar />
                <div className="pt-24 max-w-4xl mx-auto px-4 sm:px-6 pb-12">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1CA9C9] mb-2">
                            📅 Calendario de Pruebas Puntuables
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600">
                            Torneos homologados por la RFEVB válidos para el ranking nacional.
                        </p>
                    </div>

                    {/* Controls row: search + view toggle */}
                    <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 mb-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                            {/* Search */}
                            <div className="flex-1 w-full">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Buscar torneo
                                </label>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Nombre, localidad o sede..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1CA9C9] focus:border-transparent text-sm"
                                    />
                                </div>
                            </div>

                            {/* View toggle */}
                            <div className="flex-shrink-0">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Vista
                                </label>
                                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                                    <button
                                        onClick={() => setView("lista")}
                                        className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-colors duration-200 ${view === "lista" ? "bg-[#1CA9C9] text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                        </svg>
                                        Lista
                                    </button>
                                    <button
                                        onClick={() => setView("calendario")}
                                        className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-colors duration-200 border-l border-gray-300 ${view === "calendario" ? "bg-[#1CA9C9] text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Calendario
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-2 text-xs text-gray-400">
                            {totalCount} torneo{totalCount !== 1 ? "s" : ""} encontrado{totalCount !== 1 ? "s" : ""}
                        </div>
                    </div>

                    {/* Content */}
                    {view === "calendario" ? (
                        <CalendarGrid torneos={filteredTorneos} onOpenModal={openClasificacionModal} />
                    ) : (
                        groupedByMonth.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                <p className="text-gray-500 text-lg">No se encontraron torneos.</p>
                            </div>
                        ) : (
                            groupedByMonth.map(([key, group]) => (
                                <MonthFolder
                                    key={key}
                                    label={group.label}
                                    masculino={group.masculino}
                                    femenino={group.femenino}
                                    onOpenModal={openClasificacionModal}
                                />
                            ))
                        )
                    )}

                    {/* Footer */}
                    <div className="mt-8 text-sm text-gray-500 text-center">
                        Fuente: <a href="https://www.rfevb.com" target="_blank" rel="noopener noreferrer" className="text-[#1CA9C9] hover:underline">RFEVB</a>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeModal}></div>
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#1CA9C9] to-[#168a9c]">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg sm:text-xl font-bold text-white pr-4 leading-tight">{selectedTorneo}</h3>
                                <button onClick={closeModal} className="text-white hover:text-gray-200 transition-colors flex-shrink-0">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            {modalLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1CA9C9]"></div>
                                    <span className="ml-4 text-gray-600">Cargando clasificación...</span>
                                </div>
                            ) : (
                                <div className="clasificacion-content prose max-w-none" dangerouslySetInnerHTML={{ __html: modalContent }} />
                            )}
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                            <button onClick={closeModal} className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .clasificacion-content table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
                .clasificacion-content th, .clasificacion-content td { padding: 0.75rem; border: 1px solid #e5e7eb; text-align: left; }
                .clasificacion-content th { background-color: #f9fafb; font-weight: 600; }
                .clasificacion-content tr:hover { background-color: #f3f4f6; }
                .clasificacion-content h4 { color: #1CA9C9; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem; }
                .clasificacion-content .titulo2 { color: #374151; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.75rem; }
                @media (max-width: 767px) {
                    .clasificacion-content table { border: none; }
                    .clasificacion-content thead { display: none; }
                    .clasificacion-content tbody tr { display: flex; flex-wrap: wrap; align-items: center; background: white; border: 1px solid #e5e7eb; border-left: 3px solid #1CA9C9; border-radius: 6px; margin-bottom: 8px; padding: 10px 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
                    .clasificacion-content td { border: none; padding: 2px 0; font-size: 13px; display: block; width: 100%; }
                    .clasificacion-content td:first-child { font-weight: 700; color: #1CA9C9; font-size: 14px; }
                    .clasificacion-content td:first-child:before { content: "Puesto: "; color: #6b7280; font-weight: 400; }
                    .clasificacion-content td:last-child { color: #1CA9C9; font-weight: 700; }
                    .clasificacion-content td:last-child:before { content: "Puntos: "; color: #6b7280; font-weight: 400; }
                }
            `}</style>
        </>
    );
}

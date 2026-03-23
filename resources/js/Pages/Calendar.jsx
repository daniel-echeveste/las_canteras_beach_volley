import React, { useState, useMemo } from "react";
import { Head } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";

const MONTH_NAMES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function parseDate(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

function getFactorColor(factor) {
    const f = parseFloat(factor);
    if (f >= 30) return { bg: "bg-gradient-to-r from-amber-500 to-yellow-400", border: "border-amber-500", badge: "bg-amber-500", text: "text-amber-700", label: "Elite" };
    if (f >= 15) return { bg: "bg-gradient-to-r from-purple-500 to-indigo-500", border: "border-purple-500", badge: "bg-purple-500", text: "text-purple-700", label: "CNVP" };
    if (f >= 4) return { bg: "bg-gradient-to-r from-blue-500 to-cyan-500", border: "border-blue-500", badge: "bg-blue-500", text: "text-blue-700", label: "Nacional" };
    if (f >= 2) return { bg: "bg-gradient-to-r from-teal-500 to-emerald-500", border: "border-teal-500", badge: "bg-teal-500", text: "text-teal-700", label: "Regional" };
    return { bg: "bg-gradient-to-r from-gray-400 to-gray-500", border: "border-gray-400", badge: "bg-gray-400", text: "text-gray-600", label: "Local" };
}

function getCategoryIcon(cat) {
    if (cat === "Senior-M") return "♂";
    if (cat === "Senior-F") return "♀";
    return "⚡";
}

function getCategoryColor(cat) {
    if (cat === "Senior-M") return "bg-blue-100 text-blue-700";
    if (cat === "Senior-F") return "bg-pink-100 text-pink-700";
    return "bg-gray-100 text-gray-700";
}

export default function Calendar({ torneos }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("Todos");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalLoading, setModalLoading] = useState(false);
    const [selectedTorneo, setSelectedTorneo] = useState("");

    const filteredTorneos = useMemo(() => {
        return torneos.filter(t => {
            const matchesSearch = t.torneo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.localidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.sede.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === "Todos" ||
                (categoryFilter === "Masculino" && t.categoria === "Senior-M") ||
                (categoryFilter === "Femenino" && t.categoria === "Senior-F");
            return matchesSearch && matchesCategory;
        });
    }, [torneos, searchTerm, categoryFilter]);

    const groupedByMonth = useMemo(() => {
        const groups = {};
        filteredTorneos.forEach(t => {
            const date = parseDate(t.fechaInicio);
            if (!date) return;
            const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`;
            const label = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
            if (!groups[key]) groups[key] = { label, torneos: [] };
            groups[key].torneos.push(t);
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
            if (data.success) {
                setModalContent(data.html);
            } else {
                setModalContent("<p>No se pudo cargar la clasificación.</p>");
            }
        } catch (error) {
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
                <div className="pt-24 max-w-6xl mx-auto px-4 sm:px-6 pb-12">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1CA9C9] mb-2">
                            📅 Calendario de Pruebas Puntuables
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600">
                            Torneos homologados por la RFEVB válidos para el ranking nacional.
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1">
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

                            {/* Category Filter */}
                            <div className="sm:w-56">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Categoría
                                </label>
                                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                                    {["Todos", "Masculino", "Femenino"].map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setCategoryFilter(cat)}
                                            className={`flex-1 py-2.5 text-xs font-semibold transition-colors duration-200 ${
                                                categoryFilter === cat
                                                    ? "bg-[#1CA9C9] text-white"
                                                    : "bg-white text-gray-600 hover:bg-gray-50"
                                            }`}
                                        >
                                            {cat === "Masculino" ? "♂ Masc" : cat === "Femenino" ? "♀ Fem" : "Todos"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Results count */}
                        <div className="mt-3 text-xs text-gray-500">
                            {totalCount} torneo{totalCount !== 1 ? "s" : ""} encontrado{totalCount !== 1 ? "s" : ""}
                        </div>
                    </div>

                    {/* Calendar Content */}
                    {groupedByMonth.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <p className="text-gray-500 text-lg">No se encontraron torneos.</p>
                        </div>
                    ) : (
                        groupedByMonth.map(([key, group]) => (
                            <div key={key} className="mb-10">
                                {/* Month Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-[#1CA9C9] text-white px-4 py-2 rounded-lg font-bold text-sm sm:text-base shadow-sm">
                                        {group.label}
                                    </div>
                                    <div className="flex-1 h-px bg-gradient-to-r from-[#1CA9C9]/30 to-transparent"></div>
                                    <span className="text-xs text-gray-400 font-medium">
                                        {group.torneos.length} torneo{group.torneos.length !== 1 ? "s" : ""}
                                    </span>
                                </div>

                                {/* Tournament Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {group.torneos.map((torneo, idx) => {
                                        const factorInfo = getFactorColor(torneo.factor);
                                        const isPast = torneo.fechaOrdenacion && new Date(torneo.fechaOrdenacion) < new Date();

                                        return (
                                            <div
                                                key={`${torneo.id}-${idx}`}
                                                className={`bg-white rounded-xl shadow-sm border-l-4 ${factorInfo.border} hover:shadow-md transition-all duration-200 overflow-hidden ${isPast ? "opacity-70" : ""}`}
                                            >
                                                {/* Card Header with factor badge */}
                                                <div className="p-4 pb-3">
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <h3 className="font-bold text-gray-900 text-sm leading-tight flex-1">
                                                            {torneo.torneo}
                                                        </h3>
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${factorInfo.badge} flex-shrink-0`}>
                                                            x{torneo.factor}
                                                        </span>
                                                    </div>

                                                    {/* Category badge */}
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${getCategoryColor(torneo.categoria)}`}>
                                                        {getCategoryIcon(torneo.categoria)} {torneo.categoria}
                                                    </span>
                                                </div>

                                                {/* Card Details */}
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
                                                        <span>
                                                            {torneo.sede && torneo.sede !== torneo.localidad
                                                                ? `${torneo.sede}, ${torneo.localidad}`
                                                                : torneo.localidad}
                                                        </span>
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

                                                {/* Card Actions */}
                                                <div className="px-4 py-3 bg-gray-50 flex items-center justify-between gap-2">
                                                    {torneo.coordenadas && torneo.coordenadas.startsWith("http") ? (
                                                        <a
                                                            href={torneo.coordenadas}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-gray-500 hover:text-[#1CA9C9] transition-colors"
                                                        >
                                                            📍 Ver mapa
                                                        </a>
                                                    ) : (
                                                        <span></span>
                                                    )}
                                                    <button
                                                        onClick={() => openClasificacionModal(torneo.id, torneo.torneo)}
                                                        className="px-3 py-1.5 bg-[#1CA9C9] text-white text-xs font-semibold rounded-lg hover:bg-[#168a9c] transition-colors duration-200 shadow-sm"
                                                    >
                                                        Ver Clasificación
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
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
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                        onClick={closeModal}
                    ></div>

                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#1CA9C9] to-[#168a9c]">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg sm:text-xl font-bold text-white pr-4 leading-tight">
                                    {selectedTorneo}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-white hover:text-gray-200 transition-colors flex-shrink-0"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            {modalLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1CA9C9]"></div>
                                    <span className="ml-4 text-gray-600">Cargando clasificación...</span>
                                </div>
                            ) : (
                                <div
                                    className="clasificacion-content prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: modalContent }}
                                />
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Styles for classification content */}
            <style>{`
                .clasificacion-content table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1rem 0;
                }
                .clasificacion-content th,
                .clasificacion-content td {
                    padding: 0.75rem;
                    border: 1px solid #e5e7eb;
                    text-align: left;
                }
                .clasificacion-content th {
                    background-color: #f9fafb;
                    font-weight: 600;
                }
                .clasificacion-content tr:hover {
                    background-color: #f3f4f6;
                }
                .clasificacion-content h4 {
                    color: #1CA9C9;
                    font-weight: 700;
                    font-size: 1.1rem;
                    margin-bottom: 0.5rem;
                }
                .clasificacion-content .titulo2 {
                    color: #374151;
                    font-weight: 600;
                    font-size: 0.9rem;
                    margin-bottom: 0.75rem;
                }

                @media (max-width: 767px) {
                    .clasificacion-content table {
                        border: none;
                    }
                    .clasificacion-content thead {
                        display: none;
                    }
                    .clasificacion-content tbody tr {
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;
                        background: white;
                        border: 1px solid #e5e7eb;
                        border-left: 3px solid #1CA9C9;
                        border-radius: 6px;
                        margin-bottom: 8px;
                        padding: 10px 12px;
                        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                    }
                    .clasificacion-content td {
                        border: none;
                        padding: 2px 0;
                        font-size: 13px;
                        display: block;
                        width: 100%;
                    }
                    .clasificacion-content td:first-child {
                        font-weight: 700;
                        color: #1CA9C9;
                        font-size: 14px;
                    }
                    .clasificacion-content td:first-child:before {
                        content: "Puesto: ";
                        color: #6b7280;
                        font-weight: 400;
                    }
                    .clasificacion-content td:last-child {
                        color: #1CA9C9;
                        font-weight: 700;
                    }
                    .clasificacion-content td:last-child:before {
                        content: "Puntos: ";
                        color: #6b7280;
                        font-weight: 400;
                    }
                }
            `}</style>
        </>
    );
}

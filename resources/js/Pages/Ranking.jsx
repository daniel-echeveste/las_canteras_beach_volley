import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";

export default function Ranking({ ranking }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalLoading, setModalLoading] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState("");

    // Filter ranking based on search term while preserving original rank
    const filteredRanking = ranking.filter(item =>
        item.player.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openTorneosModal = async (idPersona, playerName) => {
        setSelectedPlayer(playerName);
        setModalOpen(true);
        setModalLoading(true);
        setModalContent("");

        try {
            const response = await fetch(`/ranking/torneos/${idPersona}`);
            const data = await response.json();

            if (data.success) {
                setModalContent(data.html);
            } else {
                setModalContent("<p>No se pudieron cargar los torneos.</p>");
            }
        } catch (error) {
            setModalContent("<p>Error al cargar los torneos.</p>");
        } finally {
            setModalLoading(false);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalContent("");
        setSelectedPlayer("");
    };

    return (
        <>
            <Head title="Ranking Nacional - Las Canteras Vóley" />
            <div className="min-h-screen bg-[#FFF8E8] text-gray-900 font-sans">
                <Navbar />
                <div className="pt-24 max-w-5xl mx-auto px-6 pb-12">
                    <h1 className="text-4xl font-extrabold text-[#1CA9C9] mb-6">Ranking Nacional Masculino</h1>
                    <p className="text-lg text-gray-700 mb-8">
                        Clasificación actualizada de la Real Federación Española de Voleibol.
                    </p>

                    {/* Search Input */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1CA9C9] focus:border-transparent"
                        />
                    </div>

                    <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Posición</th>
                                    <th scope="col" className="px-6 py-3">Apellidos / Nombre</th>
                                    <th scope="col" className="px-6 py-3">Puntos</th>
                                    <th scope="col" className="px-6 py-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRanking.length > 0 ? (
                                    filteredRanking.map((item, index) => (
                                        <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                                                {item.rank}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {item.player}
                                            </td>
                                            <td className="px-6 py-4 text-[#1CA9C9] font-bold">
                                                {item.points}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {item.idPersona && (
                                                    <button
                                                        onClick={() => openTorneosModal(item.idPersona, item.player)}
                                                        className="px-4 py-2 bg-[#1CA9C9] text-white text-xs font-semibold rounded-lg hover:bg-[#168a9c] transition-colors duration-200 shadow-sm"
                                                    >
                                                        Torneos
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center">
                                            No se encontraron resultados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 text-sm text-gray-500 text-center">
                        Fuente: <a href="https://www.rfevb.com/ranking-voley-playa-masculino" target="_blank" rel="noopener noreferrer" className="text-[#1CA9C9] hover:underline">RFEVB</a>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                        onClick={closeModal}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#1CA9C9] to-[#168a9c]">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white">
                                    Torneos - {selectedPlayer}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-white hover:text-gray-200 transition-colors"
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
                                    <span className="ml-4 text-gray-600">Cargando torneos...</span>
                                </div>
                            ) : (
                                <div
                                    className="torneos-content prose max-w-none"
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

            {/* Styles for tournament content */}
            <style>{`
                .torneos-content table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1rem 0;
                }
                .torneos-content th,
                .torneos-content td {
                    padding: 0.75rem;
                    border: 1px solid #e5e7eb;
                    text-align: left;
                }
                .torneos-content th {
                    background-color: #f9fafb;
                    font-weight: 600;
                }
                .torneos-content tr:hover {
                    background-color: #f3f4f6;
                }
                .torneos-content a {
                    color: #1CA9C9;
                    text-decoration: underline;
                }
            `}</style>
        </>
    );
}


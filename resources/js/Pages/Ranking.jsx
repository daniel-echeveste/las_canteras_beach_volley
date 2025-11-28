import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";

export default function Ranking({ ranking }) {
    const [searchTerm, setSearchTerm] = useState("");

    // Filter ranking based on search term while preserving original rank
    const filteredRanking = ranking.filter(item =>
        item.player.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Head title="Ranking Nacional - Las Canteras Vóley" />
            <div className="min-h-screen bg-[#FFF8E8] text-gray-900 font-sans">
                <Navbar />
                <div className="pt-24 max-w-4xl mx-auto px-6 pb-12">
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
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 text-center">
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
        </>
    );
}

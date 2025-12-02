import React, { useState } from "react";

export default function ScheduleTable({ schedule }) {
    const [expandedJornada, setExpandedJornada] = useState(null);

    // Group schedule by jornada
    const groupedSchedule = schedule.reduce((acc, match) => {
        if (!acc[match.jornada]) {
            acc[match.jornada] = [];
        }
        acc[match.jornada].push(match);
        return acc;
    }, {});

    const toggleJornada = (jornada) => {
        if (expandedJornada === jornada) {
            setExpandedJornada(null);
        } else {
            setExpandedJornada(jornada);
        }
    };

    return (
        <>
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Jornada</th>
                            <th scope="col" className="px-6 py-3">Fecha</th>
                            <th scope="col" className="px-6 py-3">Hora</th>
                            <th scope="col" className="px-6 py-3">Partido</th>
                            <th scope="col" className="px-6 py-3">Cancha</th>
                            <th scope="col" className="px-6 py-3">Resultado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((match, index) => {
                            // Check if this is the last match of a jornada (next match has different jornada)
                            const isLastOfJornada = index < schedule.length - 1 &&
                                schedule[index + 1].jornada !== match.jornada;

                            return (
                                <tr
                                    key={index}
                                    className={`bg-white hover:bg-gray-50 ${isLastOfJornada
                                        ? ' border-b mt-2 border-gray-800'
                                        : 'border-b border-gray-200'
                                        }`}
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {match.jornada}
                                    </td>
                                    <td className="px-6 py-4">
                                        {match.fecha}
                                    </td>
                                    <td className="px-6 py-4">
                                        {match.hora || "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <span className={`font-semibold ${match.local === 'DESCANSA' ? 'text-red-500' : ''}`}>{match.local}</span>
                                            <span className="hidden sm:inline text-gray-400">vs</span>
                                            <span className={`font-semibold ${match.visitante === 'DESCANSA' ? 'text-red-500' : ''}`}>{match.visitante}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {match.cancha || "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {match.resultado || "-"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile View (Accordion) */}
            <div className="md:hidden space-y-4">
                {Object.keys(groupedSchedule).map((jornada) => (
                    <div key={jornada} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                        <button
                            onClick={() => toggleJornada(Number(jornada))}
                            className="w-full flex justify-between items-center p-4 bg-[#1CA9C9] text-white font-bold text-lg"
                        >
                            <span>Jornada {jornada}</span>
                            <svg
                                className={`w-6 h-6 transition-transform duration-200 ${expandedJornada === Number(jornada) ? 'transform rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {expandedJornada === Number(jornada) && (
                            <div className="p-4 space-y-4 bg-gray-50">
                                {groupedSchedule[jornada].map((match, index) => (
                                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                        <div className="flex justify-between items-center mb-2 text-xs text-gray-500 uppercase tracking-wide">
                                            <span>{match.fecha} {match.hora ? `• ${match.hora}` : ''}</span>
                                        </div>

                                        <div className="flex flex-col items-center justify-center py-2 gap-1">
                                            <div className={`text-base font-bold text-center ${match.local === 'DESCANSA' ? 'text-red-500' : 'text-gray-800'}`}>
                                                {match.local}
                                            </div>
                                            <div className="text-xs font-medium text-gray-400">vs</div>
                                            <div className={`text-base font-bold text-center ${match.visitante === 'DESCANSA' ? 'text-red-500' : 'text-gray-800'}`}>
                                                {match.visitante}
                                            </div>
                                        </div>

                                        <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center text-sm">
                                            <div className="text-gray-600 text-xs">
                                                <span className="font-semibold">Cancha:</span> {match.cancha || "-"}
                                            </div>
                                            <div className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded text-xs">
                                                {match.resultado || "-"}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}

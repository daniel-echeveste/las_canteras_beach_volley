import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import ScheduleTable from "@/Components/ScheduleTable";
import Schedule from "@/Components/Schedules";

export default function AutonomicLeague() {
    const [isFemale, setIsFemale] = useState(false);
    const [viewMode, setViewMode] = useState('schedule'); // 'schedule' or 'classification'

    const schedule = Schedule();

    const currentSchedule = isFemale ? schedule.female : schedule.male;
    const leagueTitle = isFemale
        ? "LIGA SEGUNDA DIVISIÓN NACIONAL VOLEY PLAYA FEMENINO 2025/2026"
        : "LIGA SEGUNDA DIVISIÓN NACIONAL VOLEY PLAYA MASCULINO 2025/2026";

    const calculateRanking = (schedule) => {
        const teams = {};

        // Initialize teams from schedule
        schedule.forEach((match) => {
            if (match.local !== "DESCANSA" && !teams[match.local]) {
                teams[match.local] = { name: match.local, played: 0, won: 0, lost: 0, setsWon: 0, setsLost: 0, points: 0 };
            }
            if (match.visitante !== "DESCANSA" && !teams[match.visitante]) {
                teams[match.visitante] = { name: match.visitante, played: 0, won: 0, lost: 0, setsWon: 0, setsLost: 0, points: 0 };
            }
        });

        schedule.forEach((match) => {
            if (match.resultado && match.local !== "DESCANSA" && match.visitante !== "DESCANSA") {
                const [localSets, visitorSets] = match.resultado.split("-").map(Number);

                if (!isNaN(localSets) && !isNaN(visitorSets)) {
                    // Update Local Team
                    teams[match.local].played += 1;
                    teams[match.local].setsWon += localSets;
                    teams[match.local].setsLost += visitorSets;
                    teams[match.local].points += localSets; // Points = Sets Won

                    // Update Visitor Team
                    teams[match.visitante].played += 1;
                    teams[match.visitante].setsWon += visitorSets;
                    teams[match.visitante].setsLost += localSets;
                    teams[match.visitante].points += visitorSets; // Points = Sets Won
                }
            }
        });

        return Object.values(teams).sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.setsWon !== a.setsWon) return b.setsWon - a.setsWon;
            return a.setsLost - b.setsLost;
        });
    };

    const ranking = calculateRanking(currentSchedule);

    return (
        <>
            <Head title="Liga Autonómica - Las Canteras Vóley" />
            <div className="min-h-screen bg-[#FFF8E8] text-gray-900 font-sans">
                <Navbar />
                <div className="pt-24 max-w-6xl mx-auto px-6 pb-12">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                        <h1 className="text-4xl font-extrabold text-[#1CA9C9]">Liga Autonómica</h1>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsFemale(!isFemale)}
                                className="px-4 py-2 bg-[#1CA9C9] text-white rounded-lg font-semibold hover:bg-[#158BA8] transition-colors duration-200 shadow-md"
                            >
                                {isFemale ? "Ver Masculino" : "Ver Femenino"}
                            </button>
                            <button
                                onClick={() => setViewMode(viewMode === 'schedule' ? 'classification' : 'schedule')}
                                className="px-4 py-2 bg-[#F2A900] text-white rounded-lg font-semibold hover:bg-[#D49000] transition-colors duration-200 shadow-md"
                            >
                                {viewMode === 'schedule' ? "Ver Clasificación" : "Ver Calendario"}
                            </button>
                        </div>
                    </div>
                    <p className="text-lg text-gray-700 mb-8">
                        {leagueTitle}
                    </p>

                    {viewMode === 'schedule' ? (
                        <ScheduleTable schedule={currentSchedule} />
                    ) : (
                        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#1CA9C9] text-white">
                                        <th className="p-4 font-bold text-center">Pos</th>
                                        <th className="p-4 font-bold">Equipo</th>
                                        <th className="p-4 font-bold text-center">PJ</th>
                                        <th className="p-4 font-bold text-center">SG</th>
                                        <th className="p-4 font-bold text-center">SP</th>
                                        <th className="p-4 font-bold text-center">Pts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ranking.map((team, index) => (
                                        <tr key={team.name} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-[#FFF8E8]/30'}`}>
                                            <td className="p-4 text-center font-semibold text-gray-600">{index + 1}</td>
                                            <td className="p-4 font-medium text-gray-800">{team.name}</td>
                                            <td className="p-4 text-center text-gray-600">{team.played}</td>
                                            <td className="p-4 text-center text-green-600 font-semibold">{team.setsWon}</td>
                                            <td className="p-4 text-center text-red-500">{team.setsLost}</td>
                                            <td className="p-4 text-center font-bold text-[#1CA9C9] text-lg">{team.points}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

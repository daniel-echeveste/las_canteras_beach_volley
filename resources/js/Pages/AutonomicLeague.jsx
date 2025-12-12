import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import ScheduleTable from "@/Components/ScheduleTable";
import Schedule from "@/Components/Schedules";

// Podium position component for top 3
function PodiumCard({ team, position, delay }) {
    const positionStyles = {
        1: {
            height: "h-40",
            bg: "bg-gradient-to-br from-yellow-400 to-amber-500",
            medal: "🥇",
            order: "order-2"
        },
        2: {
            height: "h-32",
            bg: "bg-gradient-to-br from-gray-300 to-gray-400",
            medal: "🥈",
            order: "order-1"
        },
        3: {
            height: "h-24",
            bg: "bg-gradient-to-br from-amber-600 to-amber-700",
            medal: "🥉",
            order: "order-3"
        }
    };

    const style = positionStyles[position];

    return (
        <div
            className={`${style.order} flex flex-col items-center animate-slide-up`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="text-4xl mb-2">{style.medal}</div>
            <div className={`${style.bg} ${style.height} w-28 md:w-36 rounded-t-xl flex flex-col items-center justify-end pb-4 shadow-lg`}>
                <span className="text-white font-bold text-lg">{position}º</span>
            </div>
            <div className="bg-white shadow-md rounded-b-lg p-3 w-28 md:w-36 text-center">
                <p className="font-bold text-gray-800 text-sm truncate" title={team.name}>
                    {team.name}
                </p>
                <p className="text-[#1CA9C9] font-bold text-lg">{team.points} pts</p>
            </div>
        </div>
    );
}

// Stats card component
function StatsCard({ icon, value, label, color }) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                {icon}
            </div>
            <div className="text-3xl font-extrabold text-gray-900">{value}</div>
            <div className="text-gray-500 text-sm mt-1">{label}</div>
        </div>
    );
}

export default function AutonomicLeague() {
    const [isFemale, setIsFemale] = useState(false);
    const [viewMode, setViewMode] = useState('schedule');
    const [isAnimated, setIsAnimated] = useState(false);

    const schedule = Schedule();
    const currentSchedule = isFemale ? schedule.female : schedule.male;

    const leagueTitle = isFemale
        ? "Liga Segunda División Nacional Voley Playa Femenino 2025/2026"
        : "Liga Segunda División Nacional Voley Playa Masculino 2025/2026";

    useEffect(() => {
        setIsAnimated(true);
    }, []);

    const calculateRanking = (schedule) => {
        const teams = {};

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
                    teams[match.local].played += 1;
                    teams[match.local].setsWon += localSets;
                    teams[match.local].setsLost += visitorSets;
                    teams[match.local].points += localSets;

                    teams[match.visitante].played += 1;
                    teams[match.visitante].setsWon += visitorSets;
                    teams[match.visitante].setsLost += localSets;
                    teams[match.visitante].points += visitorSets;
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
    const topThree = ranking.slice(0, 3);
    const restOfRanking = ranking.slice(3);

    // Calculate stats
    const totalMatches = currentSchedule.length;
    const playedMatches = currentSchedule.filter(m => m.resultado).length;
    const totalTeams = ranking.length;

    return (
        <>
            <Head title="Liga Autonómica - Las Canteras Vóley" />

            <div className="min-h-screen bg-[#FFF8E8] text-gray-900 font-sans">
                <Navbar />

                {/* ===== HERO SECTION ===== */}
                <section className="relative pt-20 pb-6 bg-gradient-to-br from-[#1CA9C9] via-[#158BA8] to-[#0D5C6E] overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                    <div className="absolute top-1/4 left-1/4 text-8xl opacity-10 animate-pulse">🏐</div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6 pt-6">
                        {/* Breadcrumb */}
                        {/* <div className="flex items-center gap-2 text-white/70 text-sm mb-6">
                            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
                            <span>/</span>
                            <span className="text-white">Liga Autonómica</span>
                        </div> */}

                        {/* Title and gender toggle */}
                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                            <div className="animate-slide-up">
                                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                                    Liga Autonómica
                                </h1>
                                <p className="text-white/80 text-lg max-w-2xl">
                                    {leagueTitle}
                                </p>
                            </div>

                            {/* Gender Toggle - Pill Style */}
                            <div className="flex gap-1 bg-white/10 backdrop-blur-md p-1 rounded-full">
                                <button
                                    onClick={() => setIsFemale(false)}
                                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${!isFemale
                                        ? 'bg-white text-[#1CA9C9] shadow-lg'
                                        : 'text-white/80 hover:text-white'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <circle cx="12" cy="7" r="4" strokeWidth="2" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.5 21a7.5 7.5 0 0115 0" />
                                        </svg>
                                        Masculino
                                    </span>
                                </button>
                                <button
                                    onClick={() => setIsFemale(true)}
                                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${isFemale
                                        ? 'bg-white text-[#1CA9C9] shadow-lg'
                                        : 'text-white/80 hover:text-white'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <circle cx="12" cy="7" r="4" strokeWidth="2" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.5 21a7.5 7.5 0 0115 0" />
                                        </svg>
                                        Femenino
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Stats Row */}
                        {/* <div className="grid grid-cols-3 gap-4 mt-12">
                            <StatsCard
                                icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                                value={totalTeams}
                                label="Equipos"
                                color="bg-[#1CA9C9]"
                            />
                            <StatsCard
                                icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                                value={totalMatches}
                                label="Partidos"
                                color="bg-amber-500"
                            />
                            <StatsCard
                                icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                value={playedMatches}
                                label="Jugados"
                                color="bg-emerald-500"
                            />
                        </div> */}
                    </div>
                </section>

                {/* ===== VIEW TOGGLE (Tabs) ===== */}
                <section className="bg-white shadow-sm sticky top-16 z-30">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex gap-0">
                            <button
                                onClick={() => setViewMode('schedule')}
                                className={`px-8 py-4 font-semibold border-b-2 transition-all ${viewMode === 'schedule'
                                    ? 'border-[#1CA9C9] text-[#1CA9C9]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Calendario
                                </span>
                            </button>
                            <button
                                onClick={() => setViewMode('classification')}
                                className={`px-8 py-4 font-semibold border-b-2 transition-all ${viewMode === 'classification'
                                    ? 'border-[#1CA9C9] text-[#1CA9C9]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Clasificación
                                </span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* ===== CONTENT SECTION ===== */}
                <section className="py-12 px-6">
                    <div className="max-w-7xl mx-auto">
                        {viewMode === 'schedule' ? (
                            <div className="animate-fade-in">
                                <ScheduleTable schedule={currentSchedule} />
                            </div>
                        ) : (
                            <div className="space-y-12 animate-fade-in">
                                {/* Podium for Top 3 */}
                                {/* {topThree.length >= 3 && (
                                    <div className="flex justify-center items-end gap-4 py-8">
                                        <PodiumCard team={topThree[1]} position={2} delay={100} />
                                        <PodiumCard team={topThree[0]} position={1} delay={0} />
                                        <PodiumCard team={topThree[2]} position={3} delay={200} />
                                    </div>
                                )} */}

                                {/* Full Classification Table */}
                                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                    <div className="bg-gradient-to-r from-[#1CA9C9] to-[#158BA8] px-6 py-4">
                                        <h2 className="text-white font-bold text-xl">Clasificación Completa</h2>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pos</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Equipo</th>
                                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">PJ</th>
                                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">SG</th>
                                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">SP</th>
                                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Dif</th>
                                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Pts</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {ranking.map((team, index) => (
                                                    <tr
                                                        key={team.name}
                                                        className={`hover:bg-gray-50 transition-colors ${index < 3 ? 'bg-gradient-to-r from-yellow-50/50 to-transparent' : ''
                                                            }`}
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-400 text-yellow-900' :
                                                                index === 1 ? 'bg-gray-300 text-gray-700' :
                                                                    index === 2 ? 'bg-amber-600 text-white' :
                                                                        'bg-gray-100 text-gray-600'
                                                                }`}>
                                                                {index + 1}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="font-semibold text-gray-900">{team.name}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center text-gray-600">{team.played}</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="text-emerald-600 font-semibold">{team.setsWon}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="text-red-500">{team.setsLost}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`font-semibold ${team.setsWon - team.setsLost > 0 ? 'text-emerald-600' :
                                                                team.setsWon - team.setsLost < 0 ? 'text-red-500' : 'text-gray-500'
                                                                }`}>
                                                                {team.setsWon - team.setsLost > 0 ? '+' : ''}{team.setsWon - team.setsLost}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="bg-[#1CA9C9] text-white font-bold px-3 py-1 rounded-full">
                                                                {team.points}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="bg-white rounded-xl p-6 shadow-lg">
                                    <h3 className="font-bold text-gray-900 mb-4">Leyenda</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-500">PJ:</span>
                                            <span className="text-gray-600">Partidos Jugados</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-500">SG:</span>
                                            <span className="text-gray-600">Sets Ganados</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-500">SP:</span>
                                            <span className="text-gray-600">Sets Perdidos</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-500">Dif:</span>
                                            <span className="text-gray-600">Diferencia de Sets</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Podium for Top 3 */}
                                {topThree.length >= 3 && (
                                    <div className="flex justify-center items-end gap-4 py-8">
                                        <PodiumCard team={topThree[1]} position={2} delay={100} />
                                        <PodiumCard team={topThree[0]} position={1} delay={0} />
                                        <PodiumCard team={topThree[2]} position={3} delay={200} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* ===== CTA SECTION ===== */}
                <section className="py-16 px-6 bg-gradient-to-r from-[#FFD369] to-[#FFA500]">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-extrabold text-black mb-4">
                            ¿Quieres ver el ranking nacional?
                        </h2>
                        <p className="text-black/70 mb-8">
                            Consulta el ranking oficial de la RFEVB con los mejores jugadores de España
                        </p>
                        <Link
                            href="/ranking"
                            className="inline-block bg-black text-white font-bold px-10 py-4 rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Ver Ranking Nacional
                        </Link>
                    </div>
                </section>

                {/* ===== FOOTER ===== */}
                <footer className="bg-gray-900 text-white py-12 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/logo-nobg.png"
                                    alt="Las Canteras Vóley"
                                    className="h-10 w-10 object-contain"
                                />
                                <span className="text-lg font-bold">Las Canteras Beach Volley</span>
                            </div>
                            <div className="flex gap-6">
                                <Link href="/blog" className="text-gray-400 hover:text-[#1CA9C9] transition-colors">Blog</Link>
                                <Link href="/ranking" className="text-gray-400 hover:text-[#1CA9C9] transition-colors">Ranking</Link>
                                <Link href="/forecast" className="text-gray-400 hover:text-[#1CA9C9] transition-colors">Pronóstico</Link>
                            </div>
                            <p className="text-gray-500 text-sm">
                                © {new Date().getFullYear()} Las Canteras Beach Volley
                            </p>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Custom animations */}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
                .animate-slide-up {
                    animation: slide-up 0.6s ease-out forwards;
                }
            `}</style>
        </>
    );
}

import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ auth, matches }) {
    const { delete: destroy } = useForm();
    const [categoryFilter, setCategoryFilter] = useState('male');

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar este partido?')) {
            destroy(route('admin.matches.destroy', id));
        }
    };

    const filteredMatches = matches.filter(m => m.category === categoryFilter);

    // Group matches by jornada
    const groupedMatches = filteredMatches.reduce((acc, match) => {
        if (!acc[match.jornada]) {
            acc[match.jornada] = [];
        }
        acc[match.jornada].push(match);
        return acc;
    }, {});

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Liga Autonómica - Partidos</h2>}
        >
            <Head title="Admin - Liga Autonómica" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header with toggle and create button */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                {/* Category Toggle */}
                                <div className="flex gap-1 bg-gray-100 p-1 rounded-full">
                                    <button
                                        onClick={() => setCategoryFilter('male')}
                                        className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${categoryFilter === 'male'
                                            ? 'bg-[#1CA9C9] text-white shadow-lg'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        Masculino
                                    </button>
                                    <button
                                        onClick={() => setCategoryFilter('female')}
                                        className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${categoryFilter === 'female'
                                            ? 'bg-[#1CA9C9] text-white shadow-lg'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        Femenino
                                    </button>
                                </div>

                                <Link
                                    href={route('admin.matches.create')}
                                    className="px-4 py-2 bg-[#1CA9C9] text-white rounded-md hover:bg-[#158BA8]"
                                >
                                    Crear Nuevo Partido
                                </Link>
                            </div>

                            {/* Matches by Jornada */}
                            <div className="space-y-6">
                                {Object.keys(groupedMatches).sort((a, b) => Number(a) - Number(b)).map((jornada) => (
                                    <div key={jornada} className="border rounded-lg overflow-hidden">
                                        <div className="bg-[#1CA9C9] text-white px-4 py-2 font-bold">
                                            Jornada {jornada}
                                        </div>
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">vs</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Visitante</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cancha</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Resultado</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {groupedMatches[jornada].map((match) => (
                                                    <tr key={match.id} className={`hover:bg-gray-50 ${match.postponed ? 'bg-red-50' : ''}`}>
                                                        <td className={`px-4 py-2 whitespace-nowrap text-sm ${match.postponed ? 'text-red-600' : ''}`}>{match.fecha}</td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm">{match.hora || '-'}</td>
                                                        <td className="px-4 py-2 whitespace-nowrap">
                                                            <span className={`text-sm font-semibold ${match.local === 'DESCANSA' ? 'text-red-500' : match.postponed ? 'text-red-700' : ''}`}>
                                                                {match.local}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2 text-center text-gray-400 text-sm">vs</td>
                                                        <td className="px-4 py-2 whitespace-nowrap">
                                                            <span className={`text-sm font-semibold ${match.visitante === 'DESCANSA' ? 'text-red-500' : match.postponed ? 'text-red-700' : ''}`}>
                                                                {match.visitante}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{match.cancha || '-'}</td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-center">
                                                            {match.postponed ? (
                                                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                                                                    POSPUESTO
                                                                </span>
                                                            ) : match.resultado ? (
                                                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                                                                    {match.resultado}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400 text-sm">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-right text-sm">
                                                            <Link
                                                                href={route('admin.matches.edit', match.id)}
                                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                            >
                                                                Editar
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(match.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>

                            {filteredMatches.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    No hay partidos para {categoryFilter === 'male' ? 'masculino' : 'femenino'}.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        category: 'male',
        jornada: 1,
        date: '',
        time: '',
        local_team: '',
        visitor_team: '',
        court: '',
        result: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.matches.store'));
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Crear Nuevo Partido</h2>}
        >
            <Head title="Crear Partido" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Category */}
                                <div>
                                    <InputLabel htmlFor="category" value="Categoría" />
                                    <select
                                        id="category"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1CA9C9] focus:border-[#1CA9C9]"
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        required
                                    >
                                        <option value="male">Masculino</option>
                                        <option value="female">Femenino</option>
                                    </select>
                                    {errors.category && <div className="text-red-500 text-sm mt-1">{errors.category}</div>}
                                </div>

                                {/* Jornada */}
                                <div>
                                    <InputLabel htmlFor="jornada" value="Jornada" />
                                    <TextInput
                                        id="jornada"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.jornada}
                                        onChange={(e) => setData('jornada', e.target.value)}
                                        min="1"
                                        required
                                    />
                                    {errors.jornada && <div className="text-red-500 text-sm mt-1">{errors.jornada}</div>}
                                </div>

                                {/* Date */}
                                <div>
                                    <InputLabel htmlFor="date" value="Fecha" />
                                    <TextInput
                                        id="date"
                                        type="date"
                                        className="mt-1 block w-full"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        required
                                    />
                                    {errors.date && <div className="text-red-500 text-sm mt-1">{errors.date}</div>}
                                </div>

                                {/* Time */}
                                <div>
                                    <InputLabel htmlFor="time" value="Hora (opcional)" />
                                    <TextInput
                                        id="time"
                                        type="time"
                                        className="mt-1 block w-full"
                                        value={data.time}
                                        onChange={(e) => setData('time', e.target.value)}
                                    />
                                    {errors.time && <div className="text-red-500 text-sm mt-1">{errors.time}</div>}
                                </div>

                                {/* Local Team */}
                                <div>
                                    <InputLabel htmlFor="local_team" value="Equipo Local" />
                                    <TextInput
                                        id="local_team"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.local_team}
                                        onChange={(e) => setData('local_team', e.target.value)}
                                        placeholder="Ej: BRAVEHEART GC"
                                        required
                                    />
                                    {errors.local_team && <div className="text-red-500 text-sm mt-1">{errors.local_team}</div>}
                                </div>

                                {/* Visitor Team */}
                                <div>
                                    <InputLabel htmlFor="visitor_team" value="Equipo Visitante" />
                                    <TextInput
                                        id="visitor_team"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.visitor_team}
                                        onChange={(e) => setData('visitor_team', e.target.value)}
                                        placeholder="Ej: CANACANTE"
                                        required
                                    />
                                    {errors.visitor_team && <div className="text-red-500 text-sm mt-1">{errors.visitor_team}</div>}
                                </div>

                                {/* Court */}
                                <div>
                                    <InputLabel htmlFor="court" value="Cancha (opcional)" />
                                    <TextInput
                                        id="court"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.court}
                                        onChange={(e) => setData('court', e.target.value)}
                                        placeholder="Ej: Canteras, Alcaravaneras"
                                    />
                                    {errors.court && <div className="text-red-500 text-sm mt-1">{errors.court}</div>}
                                </div>

                                {/* Result */}
                                <div>
                                    <InputLabel htmlFor="result" value="Resultado (opcional)" />
                                    <TextInput
                                        id="result"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.result}
                                        onChange={(e) => setData('result', e.target.value)}
                                        placeholder="Ej: 2-1"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Formato: sets ganados local - sets ganados visitante
                                    </p>
                                    {errors.result && <div className="text-red-500 text-sm mt-1">{errors.result}</div>}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        Crear Partido
                                    </PrimaryButton>
                                    <Link
                                        href={route('admin.matches.index')}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        Cancelar
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

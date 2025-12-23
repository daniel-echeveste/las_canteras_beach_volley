import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ auth, settings }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        show_ads: settings.show_ads === '1',
        ad_frequency: settings.ad_frequency,
        ad_slot: settings.ad_slot || '',
        ad_client_id: settings.ad_client_id || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.ads.update'));
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Configuración de Anuncios</h2>}
        >
            <Head title="Configuración de Anuncios" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="max-w-xl">
                                {/* Show Ads Toggle */}
                                <div className="mb-6">
                                    <label className="flex items-center cursor-pointer">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={data.show_ads}
                                                onChange={(e) => setData('show_ads', e.target.checked)}
                                            />
                                            <div className={`block w-14 h-8 rounded-full transition-colors ${data.show_ads ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${data.show_ads ? 'transform translate-x-6' : ''}`}></div>
                                        </div>
                                        <div className="ml-3 text-gray-700 font-medium">
                                            {data.show_ads ? 'Anuncios Activados' : 'Anuncios Desactivados'}
                                        </div>
                                    </label>
                                    {errors.show_ads && <div className="text-red-500 text-sm mt-1">{errors.show_ads}</div>}
                                </div>

                                {/* Ad Frequency */}
                                <div className="mb-6">
                                    <InputLabel htmlFor="ad_frequency" value="Frecuencia de Anuncios (cada X posts)" />
                                    <TextInput
                                        id="ad_frequency"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.ad_frequency}
                                        onChange={(e) => setData('ad_frequency', e.target.value)}
                                        min="1"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Ejemplo: Si pones 3, aparecerá un anuncio después de cada 3 posts.
                                    </p>
                                    {errors.ad_frequency && <div className="text-red-500 text-sm mt-1">{errors.ad_frequency}</div>}
                                </div>

                                {/* Ad Slot ID */}
                                <div className="mb-6">
                                    <InputLabel htmlFor="ad_slot" value="Ad Slot ID (Google AdSense)" />
                                    <TextInput
                                        id="ad_slot"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.ad_slot}
                                        onChange={(e) => setData('ad_slot', e.target.value)}
                                        placeholder="e.g., 8111656162"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        El ID del bloque de anuncios de Google AdSense.
                                    </p>
                                    {errors.ad_slot && <div className="text-red-500 text-sm mt-1">{errors.ad_slot}</div>}
                                </div>

                                {/* Ad Client ID */}
                                <div className="mb-6">
                                    <InputLabel htmlFor="ad_client_id" value="Ad Client ID (Google AdSense)" />
                                    <TextInput
                                        id="ad_client_id"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.ad_client_id}
                                        onChange={(e) => setData('ad_client_id', e.target.value)}
                                        placeholder="e.g., ca-pub-4538032873726641"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        El ID de cliente de Google AdSense (empieza por ca-pub-).
                                    </p>
                                    {errors.ad_client_id && <div className="text-red-500 text-sm mt-1">{errors.ad_client_id}</div>}
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        Guardar Cambios
                                    </PrimaryButton>

                                    {recentlySuccessful && (
                                        <p className="text-sm text-green-600">Guardado correctamente.</p>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

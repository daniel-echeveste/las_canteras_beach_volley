import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';

export default function Edit({ auth, post }) {
    const { data, setData, errors, processing } = useForm({
        title: post.title,
        content: post.content,
        image: null,
        is_published: post.is_published,
        post_type: post.post_type || 'noticia',
        event_date: post.event_date ? post.event_date.substring(0, 16) : '',
        has_form: post.has_form !== undefined ? post.has_form : true,
        contact_email: post.contact_email || '',
        email_subject: post.email_subject || '',
        form_fields: post.form_fields || [],
        _method: 'PUT',
    });

    const [newField, setNewField] = useState({
        name: '',
        label: '',
        type: 'text',
        required: false,
        options: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('admin.posts.update', post.id), data);
    };

    const addFormField = () => {
        if (newField.name && newField.label) {
            setData('form_fields', [...data.form_fields, { ...newField }]);
            setNewField({
                name: '',
                label: '',
                type: 'text',
                required: false,
                options: []
            });
        }
    };

    const removeFormField = (index) => {
        const updated = data.form_fields.filter((_, i) => i !== index);
        setData('form_fields', updated);
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar Post</h2>}
        >
            <Head title="Admin - Editar Post" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Post Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Post</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="noticia"
                                                checked={data.post_type === 'noticia'}
                                                onChange={e => setData('post_type', e.target.value)}
                                                className="mr-2"
                                            />
                                            Noticia
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="evento"
                                                checked={data.post_type === 'evento'}
                                                onChange={e => setData('post_type', e.target.value)}
                                                className="mr-2"
                                            />
                                            Evento
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="torneo"
                                                checked={data.post_type === 'torneo'}
                                                onChange={e => setData('post_type', e.target.value)}
                                                className="mr-2"
                                            />
                                            Torneo
                                        </label>
                                    </div>
                                    {errors.post_type && <div className="text-red-500 text-sm mt-1">{errors.post_type}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Título</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contenido</label>
                                    <textarea
                                        value={data.content}
                                        onChange={e => setData('content', e.target.value)}
                                        rows="10"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    ></textarea>
                                    {errors.content && <div className="text-red-500 text-sm mt-1">{errors.content}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Imagen</label>
                                    {post.image_path && (
                                        <div className="mb-2">
                                            <img src={`/storage/${post.image_path}`} alt="Current" className="h-32 object-cover rounded" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        onChange={e => setData('image', e.target.files[0])}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                    {errors.image && <div className="text-red-500 text-sm mt-1">{errors.image}</div>}
                                </div>

                                {/* Event Date - Only for eventos */}
                                {data.post_type === 'evento' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Fecha del Evento</label>
                                        <input
                                            type="datetime-local"
                                            value={data.event_date}
                                            onChange={e => setData('event_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.event_date && <div className="text-red-500 text-sm mt-1">{errors.event_date}</div>}
                                    </div>
                                )}

                                {/* Tournament Fields - Only for torneos */}
                                {data.post_type === 'torneo' && (
                                    <>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="has_form"
                                                checked={data.has_form}
                                                onChange={e => setData('has_form', e.target.checked)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="has_form" className="ml-2 block text-sm text-gray-900">
                                                Habilitar Formulario de Inscripción
                                            </label>
                                        </div>

                                        {data.has_form && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Email de Contacto</label>
                                                    <input
                                                        type="email"
                                                        value={data.contact_email}
                                                        onChange={e => setData('contact_email', e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                    {errors.contact_email && <div className="text-red-500 text-sm mt-1">{errors.contact_email}</div>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Asunto del Email</label>
                                                    <input
                                                        type="text"
                                                        value={data.email_subject}
                                                        onChange={e => setData('email_subject', e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                    {errors.email_subject && <div className="text-red-500 text-sm mt-1">{errors.email_subject}</div>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Campos del Formulario</label>

                                                    {/* Existing Fields */}
                                                    {data.form_fields.map((field, index) => (
                                                        <div key={index} className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded">
                                                            <span className="flex-1">{field.label} ({field.type})</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFormField(index)}
                                                                className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    ))}

                                                    {/* Add New Field */}
                                                    <div className="mt-4 p-4 border border-gray-300 rounded space-y-3">
                                                        <h4 className="font-medium text-sm">Añadir Campo</h4>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="block text-xs text-gray-600">Nombre del Campo</label>
                                                                <input
                                                                    type="text"
                                                                    value={newField.name}
                                                                    onChange={e => setNewField({ ...newField, name: e.target.value })}
                                                                    className="mt-1 block w-full text-sm rounded-md border-gray-300"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs text-gray-600">Etiqueta</label>
                                                                <input
                                                                    type="text"
                                                                    value={newField.label}
                                                                    onChange={e => setNewField({ ...newField, label: e.target.value })}
                                                                    className="mt-1 block w-full text-sm rounded-md border-gray-300"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs text-gray-600">Tipo</label>
                                                                <select
                                                                    value={newField.type}
                                                                    onChange={e => setNewField({ ...newField, type: e.target.value })}
                                                                    className="mt-1 block w-full text-sm rounded-md border-gray-300"
                                                                >
                                                                    <option value="text">Texto</option>
                                                                    <option value="email">Email</option>
                                                                    <option value="tel">Teléfono</option>
                                                                    <option value="textarea">Área de Texto</option>
                                                                    <option value="select">Selección</option>
                                                                </select>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={newField.required}
                                                                    onChange={e => setNewField({ ...newField, required: e.target.checked })}
                                                                    className="h-4 w-4 text-indigo-600 rounded"
                                                                />
                                                                <label className="ml-2 text-xs text-gray-600">Requerido</label>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={addFormField}
                                                            className="px-3 py-1 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600"
                                                        >
                                                            Añadir Campo
                                                        </button>
                                                    </div>
                                                    {errors.form_fields && <div className="text-red-500 text-sm mt-1">{errors.form_fields}</div>}
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.is_published}
                                        onChange={e => setData('is_published', e.target.checked)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900">Publicar inmediatamente</label>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Link
                                        href={route('admin.posts.index')}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                    >
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-[#1CA9C9] text-white rounded-md hover:bg-[#158BA8] disabled:opacity-50"
                                    >
                                        Actualizar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout >
    );
}

import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";

export default function Post({ post }) {
    const [formData, setFormData] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleFormChange = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleTournamentSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const response = await fetch(route('tournament.register', post.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitted(true);
                setFormData({});
            } else {
                setError(data.message || 'Error al enviar el formulario');
            }
        } catch (err) {
            setError('Error al enviar el formulario. Por favor, inténtalo de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    const renderFormField = (field) => {
        const commonClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1CA9C9] focus:ring-[#1CA9C9]";

        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        value={formData[field.name] || ''}
                        onChange={(e) => handleFormChange(field.name, e.target.value)}
                        required={field.required}
                        rows="4"
                        className={commonClasses}
                    />
                );
            case 'select':
                return (
                    <select
                        value={formData[field.name] || ''}
                        onChange={(e) => handleFormChange(field.name, e.target.value)}
                        required={field.required}
                        className={commonClasses}
                    >
                        <option value="">Selecciona una opción</option>
                        {field.options && field.options.map((option, idx) => (
                            <option key={idx} value={option}>{option}</option>
                        ))}
                    </select>
                );
            default:
                return (
                    <input
                        type={field.type}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleFormChange(field.name, e.target.value)}
                        required={field.required}
                        className={commonClasses}
                    />
                );
        }
    };

    return (
        <>
            <Head title={`${post.title} - Las Canteras Vóley`} />
            <div className="min-h-screen bg-[#FFF8E8] text-gray-900 font-sans">
                <Navbar />
                <div className="pt-24 max-w-4xl mx-auto px-6 pb-12">
                    {/* Back to Blog Link */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-[#1CA9C9] hover:text-[#158BA8] font-semibold mb-6 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver al Blog
                    </Link>

                    {/* Post Header */}
                    <article className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Post Type Badge */}
                        <div className="px-8 pt-6">
                            <span className={`px-3 py-1 inline-flex items-center text-sm font-semibold rounded-full gap-2 ${post.post_type === 'noticia' ? 'bg-blue-100 text-blue-800' :
                                post.post_type === 'evento' ? 'bg-purple-100 text-purple-800' :
                                    'bg-orange-100 text-orange-800'
                                }`}>
                                {post.post_type === 'noticia' && (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                )}
                                {post.post_type === 'evento' && (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                                {post.post_type === 'torneo' && (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                )}
                                {post.post_type === 'noticia' ? 'Noticia' :
                                    post.post_type === 'evento' ? 'Evento' :
                                        'Torneo'}
                            </span>
                        </div>

                        {post.image_path && (
                            <img
                                src={`/storage/${post.image_path}`}
                                alt={post.title}
                                className="w-full h-96 object-cover"
                            />
                        )}

                        <div className="p-8">
                            {/* Date */}
                            <div className="text-sm text-gray-500 mb-4">
                                {new Date(post.created_at).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>

                            {/* Event Date - Only for eventos */}
                            {post.post_type === 'evento' && post.event_date && (
                                <div className="mb-6 p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
                                    <div className="flex items-center">
                                        <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <div>
                                            <div className="text-sm font-semibold text-purple-800">Fecha del Evento</div>
                                            <div className="text-lg font-bold text-purple-900">
                                                {new Date(post.event_date).toLocaleDateString('es-ES', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Title */}
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
                                {post.title}
                            </h1>

                            {/* Content */}
                            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">
                                {post.content}
                            </div>

                            {/* Tournament Registration Form */}
                            {post.post_type === 'torneo' && post.has_form && post.form_fields && post.form_fields.length > 0 && (
                                <div className="mt-8 border-t pt-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Inscripción al Torneo</h2>

                                    {submitted ? (
                                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                                            <div className="flex items-center">
                                                <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div>
                                                    <p className="font-semibold text-green-800">¡Inscripción enviada correctamente!</p>
                                                    <p className="text-sm text-green-700">Recibirás una confirmación en tu email.</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleTournamentSubmit} className="space-y-4">
                                            {post.form_fields.map((field, index) => (
                                                <div key={index}>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        {field.label}
                                                        {field.required && <span className="text-red-500 ml-1">*</span>}
                                                    </label>
                                                    {renderFormField(field)}
                                                </div>
                                            ))}

                                            {error && (
                                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                                    <p className="text-red-800">{error}</p>
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full px-6 py-3 bg-[#1CA9C9] text-white rounded-lg font-semibold hover:bg-[#158BA8] transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {submitting ? 'Enviando...' : 'Enviar Inscripción'}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    </article>

                    {/* Back to Blog Button (bottom) */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/blog"
                            className="inline-block px-6 py-3 bg-[#1CA9C9] text-white rounded-lg font-semibold hover:bg-[#158BA8] transition-colors duration-200 shadow-md"
                        >
                            Ver más noticias
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";

export default function Blog({ posts, filters }) {
    const currentFilter = filters?.type || 'all';

    const handleFilter = (type) => {
        if (type === 'all') {
            router.get(route('blog'));
        } else {
            router.get(route('blog'), { type }, { preserveState: true });
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'noticia':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                );
            case 'evento':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'torneo':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Head title="Blog - Las Canteras Vóley" />
            <div className="min-h-screen bg-[#FFF8E8] text-gray-900 font-sans">
                <Navbar />
                <div className="pt-24 max-w-6xl mx-auto px-6">
                    <h1 className="text-4xl font-extrabold text-[#1CA9C9] mb-6">Blog y Noticias</h1>
                    <p className="text-lg text-gray-700 mb-8">
                        Últimas noticias, consejos de entrenamiento y eventos de la comunidad.
                    </p>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mb-12">
                        <button
                            onClick={() => handleFilter('all')}
                            className={`px-4 py-2 rounded-full font-semibold transition-colors ${currentFilter === 'all'
                                ? 'bg-[#1CA9C9] text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => handleFilter('noticia')}
                            className={`px-4 py-2 rounded-full font-semibold transition-colors flex items-center gap-2 ${currentFilter === 'noticia'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-600 hover:bg-blue-50'
                                }`}
                        >
                            {getIcon('noticia')}
                            Noticias
                        </button>
                        <button
                            onClick={() => handleFilter('evento')}
                            className={`px-4 py-2 rounded-full font-semibold transition-colors flex items-center gap-2 ${currentFilter === 'evento'
                                ? 'bg-purple-500 text-white'
                                : 'bg-white text-gray-600 hover:bg-purple-50'
                                }`}
                        >
                            {getIcon('evento')}
                            Eventos
                        </button>
                        <button
                            onClick={() => handleFilter('torneo')}
                            className={`px-4 py-2 rounded-full font-semibold transition-colors flex items-center gap-2 ${currentFilter === 'torneo'
                                ? 'bg-orange-500 text-white'
                                : 'bg-white text-gray-600 hover:bg-orange-50'
                                }`}
                        >
                            {getIcon('torneo')}
                            Torneos
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.isArray(posts) && posts.map((post) => (
                            <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                                {post.image_path && (
                                    <div className="relative">
                                        <img
                                            src={`/storage/${post.image_path}`}
                                            alt={post.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className={`absolute top-4 right-4 p-2 rounded-full shadow-md ${post.post_type === 'noticia' ? 'bg-blue-100 text-blue-600' :
                                            post.post_type === 'evento' ? 'bg-purple-100 text-purple-600' :
                                                'bg-orange-100 text-orange-600'
                                            }`}>
                                            {getIcon(post.post_type)}
                                        </div>
                                    </div>
                                )}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="text-sm text-gray-500 mb-2">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                                        {post.content}
                                    </p>
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="text-[#1CA9C9] font-semibold hover:text-[#158BA8] transition-colors mt-auto inline-flex items-center"
                                    >
                                        Leer más
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {(!Array.isArray(posts) || posts.length === 0) && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🏐</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay publicaciones</h3>
                            <p className="text-gray-500">
                                No se encontraron publicaciones para este filtro.
                            </p>
                            <button
                                onClick={() => handleFilter('all')}
                                className="mt-4 text-[#1CA9C9] hover:underline"
                            >
                                Ver todas las publicaciones
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

import React, { useEffect, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";

// Animated counter component
function AnimatedCounter({ target, duration = 2000, suffix = "" }) {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    const startTime = Date.now();
                    const animate = () => {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(target * easeOut));
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };
                    animate();
                }
            },
            { threshold: 0.5 }
        );

        const element = document.getElementById(`counter-${target}`);
        if (element) observer.observe(element);

        return () => observer.disconnect();
    }, [target, duration, hasAnimated]);

    return (
        <span id={`counter-${target}`}>
            {count}{suffix}
        </span>
    );
}

// Feature card component
function FeatureCard({ icon, title, description, href, color }) {
    return (
        <Link
            href={href}
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`}></div>
            <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#1CA9C9] transition-colors">
                {title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
                {description}
            </p>
            <div className="mt-6 text-[#1CA9C9] font-semibold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Explorar
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </div>
        </Link>
    );
}

// Blog post card component
function PostCard({ post }) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
        >
            {post.image_path ? (
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={`/storage/${post.image_path}`}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
            ) : (
                <div className="h-48 bg-gradient-to-br from-[#1CA9C9] to-[#0D7A99] flex items-center justify-center">
                    <span className="text-6xl">🏐</span>
                </div>
            )}
            <div className="p-6">
                <div className="text-sm text-[#1CA9C9] font-medium mb-2">
                    {new Date(post.created_at).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#1CA9C9] transition-colors">
                    {post.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                    {post.content}
                </p>
            </div>
        </Link>
    );
}

export default function LandingPage({ latestPosts = [] }) {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            ),
            title: "Blog y Noticias",
            description: "Mantente al día con las últimas noticias, eventos y torneos del vóley playa en Las Palmas.",
            href: "/blog",
            color: "bg-blue-500"
        },
        {
            icon: (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "Liga Autonómica",
            description: "Consulta clasificaciones, resultados y calendario de la liga autonómica canaria.",
            href: "/liga-autonomica",
            color: "bg-emerald-500"
        },
        {
            icon: (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            title: "Ranking Nacional",
            description: "Sigue el ranking oficial de la RFEVB y conoce a los mejores jugadores de España.",
            href: "/ranking",
            color: "bg-amber-500"
        },
        {
            icon: (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
            ),
            title: "Pronóstico del Tiempo",
            description: "Consulta las condiciones meteorológicas ideales para jugar en la playa.",
            href: "/forecast",
            color: "bg-cyan-500"
        }
    ];

    return (
        <>
            <Head title="Vóley Playa Las Canteras" />

            <div className="min-h-screen bg-[#FFF8E8] text-gray-900 font-sans">
                <Navbar />

                {/* ===== HERO SECTION ===== */}
                <section
                    id="hero"
                    className="relative min-h-screen bg-[url('https://estaticos-cdn.prensaiberica.es/clip/bbc75e72-3f84-4133-afc1-c27ea269461a_16-9-discover-aspect-ratio_default_0.jpg')] bg-cover bg-center bg-fixed"
                >
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#FFF8E8]"></div>

                    {/* Floating volleyball decoration */}
                    <div
                        className="absolute top-32 right-10 text-8xl animate-bounce opacity-30 hidden lg:block"
                        style={{ animationDuration: '3s' }}
                    >
                        🏐
                    </div>

                    {/* Hero content */}
                    <div className="relative z-10 flex flex-col justify-center items-center min-h-screen text-center text-white px-6 pt-20">
                        {/* Logo badge */}
                        <div className="mb-8 animate-fade-in">
                            <div className="bg-white/10 backdrop-blur-md rounded-full p-4 inline-block">
                                <img
                                    src="/logo-nobg.png"
                                    alt="Las Canteras Vóley"
                                    className="h-20 w-20 object-contain"
                                />
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-lg mb-6 animate-slide-up">
                            <span className="bg-gradient-to-r from-white via-[#FFD369] to-white bg-clip-text text-transparent">
                                Vóley Playa
                            </span>
                            <br />
                            <span className="text-[#1CA9C9]">Las Canteras</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl md:text-2xl max-w-3xl drop-shadow-md opacity-90 mb-10 animate-slide-up-delay">
                            Deporte, arena, comunidad y sol. Vive la experiencia del vóley playa en uno de los mejores rincones de Canarias.
                        </p>

                        {/* CTA buttons */}
                        <div className="flex flex-wrap gap-4 justify-center animate-slide-up-delay-2">
                            <Link
                                href="/liga-autonomica"
                                className="bg-[#FFD369] hover:bg-[#f0c45c] text-black font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                                Liga Autonómica
                            </Link>
                            <Link
                                href="/ranking"
                                className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-bold px-8 py-4 rounded-full shadow-lg border border-white/30 hover:border-white/50 transition-all duration-300 transform hover:scale-105"
                            >
                                Ranking Nacional
                            </Link>
                            <Link
                                href="/blog"
                                className="bg-[#1CA9C9] hover:bg-[#158BA8] text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                                Ver Noticias
                            </Link>
                        </div>

                        {/* Scroll indicator */}
                        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden lg:block">
                            <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                    </div>
                </section>

                {/* ===== FEATURES SECTION ===== */}
                <section id="features" className="py-24 px-6 bg-gradient-to-b from-[#FFF8E8] to-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                                Todo lo que necesitas
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Información, rankings, noticias y mucho más para la comunidad de vóley playa
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, idx) => (
                                <FeatureCard key={idx} {...feature} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ===== LATEST NEWS SECTION ===== */}
                {latestPosts.length > 0 && (
                    <section id="news" className="py-24 px-6 bg-white">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                                        Últimas Noticias
                                    </h2>
                                    <p className="text-xl text-gray-600">
                                        Mantente informado con las últimas novedades
                                    </p>
                                </div>
                                <Link
                                    href="/blog"
                                    className="mt-4 md:mt-0 text-[#1CA9C9] font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                                >
                                    Ver todas las noticias
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {latestPosts.map((post) => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ===== ABOUT / STATS SECTION ===== */}
                <section id="about" className="py-24 px-6 bg-gradient-to-br from-[#1CA9C9] to-[#0D7A99] text-white relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                                    La Playa de Las Canteras
                                </h2>
                                <p className="text-xl opacity-90 mb-8 leading-relaxed">
                                    Con más de 3 kilómetros de arena dorada y aguas cristalinas, Las Canteras es el escenario perfecto para el vóley playa.
                                    Nuestra comunidad reúne a jugadores de todos los niveles, desde principiantes hasta competidores de élite.
                                </p>
                                <p className="text-lg opacity-80 leading-relaxed">
                                    Torneos, ligas y eventos durante todo el año, aprovechando el clima privilegiado de Gran Canaria.
                                    ¡Únete a la comunidad más activa de vóley playa de Canarias!
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
                                    <div className="text-5xl font-extrabold mb-2">
                                        <AnimatedCounter target={8} suffix="" />
                                    </div>
                                    <div className="text-lg opacity-80">Canchas Oficiales</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
                                    <div className="text-5xl font-extrabold mb-2">
                                        <AnimatedCounter target={365} suffix="" />
                                    </div>
                                    <div className="text-lg opacity-80">Días de Sol</div>
                                </div>
                                {/* <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
                                    <div className="text-5xl font-extrabold mb-2">
                                        <AnimatedCounter target={500} suffix="+" />
                                    </div>
                                    <div className="text-lg opacity-80">Jugadores Activos</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
                                    <div className="text-5xl font-extrabold mb-2">
                                        <AnimatedCounter target={20} suffix="+" />
                                    </div>
                                    <div className="text-lg opacity-80">Torneos Anuales</div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== CTA BANNER ===== */}
                <section id="cta" className="py-20 px-6 bg-[#FFF8E8]">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-gradient-to-r from-[#FFD369] to-[#FFA500] rounded-3xl p-12 shadow-2xl">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-4">
                                ¿Listo para jugar?
                            </h2>
                            <p className="text-lg text-black/80 mb-8">
                                Consulta el pronóstico del tiempo y encuentra el mejor momento para tu próximo partido
                            </p>
                            <Link
                                href="/forecast"
                                className="inline-block bg-black text-white font-bold px-10 py-4 rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                Ver Pronóstico
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ===== FOOTER ===== */}
                <footer className="bg-gray-900 text-white py-16 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-4 gap-12 mb-12">
                            {/* Brand */}
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-3 mb-4">
                                    <img
                                        src="/logo-nobg.png"
                                        alt="Las Canteras Vóley"
                                        className="h-12 w-12 object-contain"
                                    />
                                    <span className="text-2xl font-bold">Las Canteras Beach Volley</span>
                                </div>
                                <p className="text-gray-400 leading-relaxed max-w-md">
                                    La comunidad de vóley playa más activa de Las Palmas de Gran Canaria.
                                    Deporte, pasión y diversión en la mejor playa urbana del mundo.
                                </p>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h4 className="font-bold text-lg mb-4">Enlaces Rápidos</h4>
                                <ul className="space-y-2">
                                    <li><Link href="/blog" className="text-gray-400 hover:text-[#1CA9C9] transition-colors">Blog</Link></li>
                                    <li><Link href="/liga-autonomica" className="text-gray-400 hover:text-[#1CA9C9] transition-colors">Liga Autonómica</Link></li>
                                    <li><Link href="/ranking" className="text-gray-400 hover:text-[#1CA9C9] transition-colors">Ranking Nacional</Link></li>
                                    <li><Link href="/forecast" className="text-gray-400 hover:text-[#1CA9C9] transition-colors">Pronóstico</Link></li>
                                </ul>
                            </div>

                            {/* Contact */}
                            <div>
                                <h4 className="font-bold text-lg mb-4">Ubicación</h4>
                                <p className="text-gray-400">
                                    Playa de Las Canteras<br />
                                    Las Palmas de Gran Canaria<br />
                                    Islas Canarias, España
                                </p>
                            </div>
                        </div>

                        {/* Bottom bar */}
                        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-gray-500 text-sm">
                                © {new Date().getFullYear()} Las Canteras Beach Volley. Todos los derechos reservados.
                            </p>
                            <div className="flex gap-6">
                                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1CA9C9] transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                    </svg>
                                </a>
                                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1CA9C9] transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1CA9C9] transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>
                            </div>
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
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }
                .animate-slide-up {
                    animation: slide-up 0.8s ease-out forwards;
                }
                .animate-slide-up-delay {
                    animation: slide-up 0.8s ease-out 0.2s forwards;
                    opacity: 0;
                }
                .animate-slide-up-delay-2 {
                    animation: slide-up 0.8s ease-out 0.4s forwards;
                    opacity: 0;
                }
            `}</style>
        </>
    );
}

import React from "react";
import { Head } from "@inertiajs/react";

export default function WelcomeTest({ appName, version }) {
    return (
        <>
            <Head title="Vóley Playa Las Canteras" />

            <div className="min-h-screen bg-[#FFF8E8] text-gray-900 font-sans">

                {/* NAVBAR */}
                <header className="bg-white/80 backdrop-blur-sm fixed w-full top-0 left-0 shadow-md z-40">
                    <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
                        <h1 className="text-2xl font-extrabold text-[#1CA9C9]">
                            Las Canteras Vóley
                        </h1>

                        <ul className="hidden md:flex gap-8 font-semibold text-gray-700">
                            <li>
                                <a href="#hero" className="hover:text-[#1CA9C9] transition">Inicio</a>
                            </li>
                            <li>
                                <a href="#actividades" className="hover:text-[#1CA9C9] transition">Actividades</a>
                            </li>
                            <li>
                                <a href="#comunidad" className="hover:text-[#1CA9C9] transition">Comunidad</a>
                            </li>
                            <li>
                                <a href="#contacto" className="hover:text-[#1CA9C9] transition">Contacto</a>
                            </li>
                        </ul>

                        {/* Botón (opcional) */}
                        <a
                            href="#contacto"
                            className="hidden md:block bg-[#1CA9C9] hover:bg-[#1c8ea9] text-white px-4 py-2 rounded-xl shadow transition"
                        >
                            Únete
                        </a>
                    </nav>
                </header>

                {/* ----- HERO ----- */}
                <section
                    id="hero"
                    className="relative h-screen bg-[url('https://estaticos-cdn.prensaiberica.es/clip/bbc75e72-3f84-4133-afc1-c27ea269461a_16-9-discover-aspect-ratio_default_0.jpg')] bg-cover bg-center"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20"></div>

                    <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-6">
                        <h1 className="text-6xl font-extrabold drop-shadow-lg">
                            Vóley Playa Las Canteras
                        </h1>
                        <p className="text-xl mt-4 drop-shadow-md max-w-2xl">
                            Deporte, arena, comunidad y sol. Vive la experiencia del vóley playa en uno de los mejores rincones de Canarias.
                        </p>

                        <a
                            href="#actividades"
                            className="mt-8 bg-[#FFD369] hover:bg-[#f0c45c] text-black font-semibold px-8 py-3 rounded-xl shadow-lg transition"
                        >
                            Descubrir Actividades
                        </a>
                    </div>
                </section>

                {/* ----- ACTIVIDADES ----- */}
                <section id="actividades" className="py-24 bg-[#FFF2CC]">
                    <div className="max-w-6xl mx-auto px-6">
                        <h2 className="text-4xl text-center font-extrabold text-[#1CA9C9]">
                            Actividades
                        </h2>
                        <p className="text-center text-gray-700 mt-2 mb-12">
                            Encuentra tu plan ideal en la arena.
                        </p>

                        <div className="grid md:grid-cols-3 gap-10">
                            {[ 
                                {
                                    title: "Partidos Abiertos",
                                    desc: "Únete a partidos informales todos los días. Nivel libre.",
                                    img: "https://images.unsplash.com/photo-1501612780327-45045538702b"
                                },
                                {
                                    title: "Entrenamientos",
                                    desc: "Mejora tu técnica con entrenadores certificados.",
                                    img: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d"
                                },
                                {
                                    title: "Torneos",
                                    desc: "Compite en torneos locales y eventos especiales.",
                                    img: "https://images.unsplash.com/photo-1599053991244-1bf5b459c30b"
                                }
                            ].map((card, idx) => (
                                <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
                                    <img src={card.img} alt={card.title} className="h-48 w-full object-cover" />
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-[#1CA9C9]">
                                            {card.title}
                                        </h3>
                                        <p className="text-gray-700 mt-2">{card.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ----- COMUNIDAD ----- */}
                <section id="comunidad" className="py-24 bg-[#FFF8E8]">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-4xl font-extrabold text-[#1CA9C9]">
                            Comunidad en la playa
                        </h2>
                        <p className="text-lg text-gray-700 mt-6">
                            Seas principiante o jugador experto, aquí siempre tendrás un lugar.
                            Nuestra comunidad está formada por amantes del sol, la arena
                            y el deporte. ¡Ven a formar parte de esta familia!
                        </p>
                    </div>
                </section>

                {/* ----- FOOTER ----- */}
                <footer id="contacto" className="bg-[#1CA9C9] text-white py-8 mt-10">
                    <div className="max-w-6xl mx-auto text-center px-6">
                        <h3 className="text-2xl font-bold">Contáctanos</h3>
                        <p className="mt-2">
                            ¿Quieres unirte o pedir información? Escríbenos por redes o visítanos en Las Canteras.
                        </p>

                        <p className="mt-6 text-sm opacity-80">
                            {appName} v{version} — Vóley Playa Las Canteras © {new Date().getFullYear()}
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}

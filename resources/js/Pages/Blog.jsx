import React from "react";
import { Head } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";

export default function Blog() {
    return (
        <>
            <Head title="Blog - Las Canteras Vóley" />
            <div className="min-h-screen bg-[#FFF8E8] text-gray-900 font-sans">
                <Navbar />
                <div className="pt-24 max-w-6xl mx-auto px-6">
                    <h1 className="text-4xl font-extrabold text-[#1CA9C9] mb-6">Blog y Noticias</h1>
                    <p className="text-lg text-gray-700">
                        Últimas noticias, consejos de entrenamiento y eventos de la comunidad.
                    </p>
                    {/* Contenido futuro aquí */}
                </div>
            </div>
        </>
    );
}

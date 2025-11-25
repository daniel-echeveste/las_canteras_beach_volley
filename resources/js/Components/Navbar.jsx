import React, { useState } from "react";
import { Link } from "@inertiajs/react";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: "Inicio", href: "/" },
        { name: "Actividades", href: "/#actividades" },
        { name: "Comunidad", href: "/#comunidad" },
        { name: "Blog", href: "/blog" },
        { name: "Clubes", href: "/clubes-voleibol" },
        { name: "Liga", href: "/liga-autonomica" },
        { name: "Top Players", href: "/top-players" },
        { name: "Webcams", href: "/webcams" },
        { name: "Experiencias 3D", href: "/webgl" },
    ];

    return (
        <header className="bg-white/80 backdrop-blur-sm fixed w-full top-0 left-0 shadow-md z-40">
            <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link href="/" className="text-2xl font-extrabold text-[#1CA9C9]">
                    Las Canteras Vóley
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden xl:flex gap-6 font-semibold text-gray-700 items-center">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link
                                href={link.href}
                                className="hover:text-[#1CA9C9] transition text-sm uppercase tracking-wide"
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* CTA Button */}
                <div className="hidden xl:block">
                    <a
                        href="#contacto"
                        className="bg-[#1CA9C9] hover:bg-[#1c8ea9] text-white px-5 py-2 rounded-xl shadow transition font-bold"
                    >
                        Únete
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="xl:hidden text-gray-700 focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                        ></path>
                    </svg>
                </button>
            </nav>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="xl:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 top-full">
                    <ul className="flex flex-col p-4 gap-4 font-semibold text-gray-700">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className="block hover:text-[#1CA9C9] transition"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <a
                                href="#contacto"
                                className="block text-center bg-[#1CA9C9] hover:bg-[#1c8ea9] text-white px-4 py-2 rounded-xl shadow transition"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Únete
                            </a>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}

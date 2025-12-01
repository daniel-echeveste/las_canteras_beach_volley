import React, { useState } from "react";
import { Link } from "@inertiajs/react";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Check if we're in development (localhost or .test domain)
    const isDevelopment = window.location.hostname === 'localhost' ||
        window.location.hostname.includes('.test') ||
        window.location.hostname === '127.0.0.1';

    const allNavLinks = [
        { name: "Inicio", href: "/", devOnly: true },
        { name: "Blog", href: "/blog", devOnly: true },
        { name: "Clubes", href: "/clubes-voleibol", devOnly: true },
        { name: "Liga", href: "/liga-autonomica", devOnly: false },
        { name: "Ranking", href: "/ranking", devOnly: false },
        { name: "Webcams", href: "/webcams", devOnly: true },
        { name: "3D ", href: "/webgl", devOnly: true },
    ];

    // Filter links based on environment
    const navLinks = isDevelopment
        ? allNavLinks
        : allNavLinks.filter(link => !link.devOnly);

    return (
        <header className="bg-white/80 backdrop-blur-sm fixed w-full top-0 left-0 shadow-md z-40">
            <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <img
                        src="/logo-nobg.png"
                        alt="Las Canteras Vóley"
                        className="h-12 w-12 object-contain rounded-full"
                        style={{ mixBlendMode: 'multiply' }}
                    />
                    <span className="text-2xl font-extrabold text-[#1CA9C9] hidden sm:block">
                        Las Canteras Beach Volley
                    </span>
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
                    </ul>
                </div>
            )}
        </header>
    );
}

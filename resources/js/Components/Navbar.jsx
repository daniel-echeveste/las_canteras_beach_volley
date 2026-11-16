import React, { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";

// En local (localhost / .test / 127.0.0.1) o con ?developer_permissions=true
// se muestran también las secciones en desarrollo.
const isDevelopment = () => {
    if (typeof window === "undefined") return false;
    const host = window.location.hostname;
    const hasDevPermissions = new URLSearchParams(window.location.search).get("developer_permissions") === "true";
    return host === "localhost" || host.includes(".test") || host === "127.0.0.1" || hasDevPermissions;
};

export const NAV_LINKS = [
    { name: "Inicio", href: "/", devOnly: true },
    { name: "Blog", href: "/blog" },
    { name: "Clubes", href: "/clubes-voleibol", devOnly: true },
    { name: "Liga", href: "/liga-autonomica" },
    { name: "Ranking", href: "/ranking" },
    { name: "Calendario", href: "/calendario" },
    { name: "Tienda", href: "/tienda", devOnly: true },
    { name: "Previsión", href: "/forecast" },
    { name: "Webcams", href: "/webcams", devOnly: true },
    { name: "3D", href: "/webgl", devOnly: true },
];

export default function Navbar() {
    const { url } = usePage();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const links = isDevelopment() ? NAV_LINKS : NAV_LINKS.filter((l) => !l.devOnly);
    const path = url.split("?")[0];
    const isActive = (href) => (href === "/" ? path === "/" : path === href || path.startsWith(href + "/"));

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Bloquear scroll con el menú móvil abierto
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    return (
        <header
            className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
                scrolled || open ? "bg-white/90 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06),0_8px_24px_-12px_rgba(0,0,0,0.15)]" : "bg-white/75 backdrop-blur-sm"
            }`}
        >
            <nav className="max-w-7xl mx-auto h-20 flex items-center justify-between px-4 sm:px-6">
                <Link href="/" className="flex items-center gap-3 shrink-0" onClick={() => setOpen(false)}>
                    <img
                        src="/logo-nobg.png"
                        alt="Las Canteras Beach Volley"
                        className="h-11 w-11 object-contain"
                    />
                    <span className="leading-none hidden sm:block">
                        <span className="block text-lg font-black tracking-tight text-[#0D5C6E]">Las Canteras</span>
                        <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-[#1CA9C9] mt-0.5">Beach Volley</span>
                    </span>
                </Link>

                {/* Escritorio */}
                <ul className="hidden xl:flex items-center gap-1">
                    {links.map((link) => {
                        const active = isActive(link.href);
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`relative px-3.5 py-2 rounded-full text-sm font-semibold transition-colors ${
                                        active ? "text-[#0D5C6E] bg-[#1CA9C9]/10" : "text-gray-600 hover:text-gray-900 hover:bg-black/[0.04]"
                                    }`}
                                >
                                    {link.name}
                                    {link.devOnly && <span className="ml-1 align-super text-[8px] font-bold text-amber-500">DEV</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Botón móvil */}
                <button
                    className="xl:hidden w-11 h-11 -mr-2 rounded-full flex items-center justify-center text-gray-800 hover:bg-black/5"
                    onClick={() => setOpen((o) => !o)}
                    aria-label={open ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={open}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        {open ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h10" />
                        )}
                    </svg>
                </button>
            </nav>

            {/* Menú móvil */}
            {open && (
                // Ojo: el header tiene backdrop-filter, que convierte al header en el
                // bloque contenedor de los hijos `fixed`; por eso se usa absolute +
                // altura explícita en lugar de fixed + bottom-0.
                <div className="xl:hidden absolute inset-x-0 top-full h-[calc(100dvh-5rem)] bg-white border-t border-black/5 overflow-y-auto overscroll-contain animate-[menu-in_.2s_ease-out]">
                    <ul className="max-w-7xl mx-auto px-4 sm:px-6 py-4 grid gap-1">
                        {links.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-lg font-bold ${
                                            active ? "bg-[#1CA9C9]/10 text-[#0D5C6E]" : "text-gray-800 hover:bg-black/[0.04]"
                                        }`}
                                    >
                                        <span>
                                            {link.name}
                                            {link.devOnly && <span className="ml-2 text-[10px] font-bold text-amber-500 align-middle">DEV</span>}
                                        </span>
                                        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    <style>{`@keyframes menu-in { from { opacity:0; transform:translateY(-6px) } to { opacity:1; transform:none } }`}</style>
                </div>
            )}
        </header>
    );
}

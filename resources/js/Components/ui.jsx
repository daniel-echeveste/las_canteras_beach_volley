import React, { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import SiteFooter from "@/Components/SiteFooter";

/* ------------------------------------------------------------------ */
/*  Paleta de la marca (para referencia)                              */
/*  turquesa #1CA9C9 · mar profundo #0D5C6E · arena #FFF8E8           */
/*  sol #FFD369 · naranja #FFA500                                     */
/* ------------------------------------------------------------------ */

const ICONS = {
    calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    trophy: "M8 21h8m-4-4v4m-5-17h10v5a5 5 0 01-10 0V4zm10 1h3v2a3 3 0 01-3 3M7 5H4v2a3 3 0 003 3",
    pin: "M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
    clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    external: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14",
    refresh: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    arrow: "M9 5l7 7-7 7",
    arrowLeft: "M15 19l-7-7 7-7",
    arrowRight: "M17 8l4 4m0 0l-4 4m4-4H3",
    x: "M6 18L18 6M6 6l12 12",
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    news: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
    sparkles: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
    chart: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    sun: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
    cloud: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
    wind: "M3 8h11a3 3 0 10-3-3M3 16h15a3 3 0 11-3 3M3 12h18",
    list: "M4 6h16M4 10h16M4 14h16M4 18h16",
    grid: "M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z",
    users: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    video: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
    bag: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
    lock: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    check: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    cube: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    star: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
};

export function Icon({ name, className = "w-4 h-4", strokeWidth = 2 }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[name]} />
        </svg>
    );
}

/** Estructura común: navbar fijo + contenido + footer. */
export function PageShell({ title, children, footer = true, className = "" }) {
    return (
        <>
            {title && <Head title={title} />}
            <div className={`min-h-screen bg-[#FFF8E8] text-gray-900 font-sans flex flex-col ${className}`}>
                <Navbar />
                <div className="flex-1">{children}</div>
                {footer && <SiteFooter />}
            </div>
            <style>{`
                .badge { display:inline-flex; align-items:center; gap:4px; border-radius:9999px; padding:2px 8px; font-size:11px; font-weight:700; white-space:nowrap; }
                @keyframes fade-in { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
                .animate-fade-in { animation: fade-in .35s ease-out both; }
                .no-scrollbar::-webkit-scrollbar { display:none; } .no-scrollbar { scrollbar-width:none; }
                @media (prefers-reduced-motion: reduce) { .animate-fade-in { animation:none; } }
            `}</style>
        </>
    );
}

/** Cabecera de página con degradado de mar, red decorativa y ola inferior. */
export function PageHero({ eyebrow, title, subtitle, aside, children, compact = false }) {
    return (
        <section className={`relative overflow-hidden bg-[#0D5C6E] ${compact ? "pt-28 pb-20" : "pt-28 pb-24"}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#1CA9C9] via-[#127F98] to-[#0B3F4C]" />
            <div className="absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-[#FFD369]/20 blur-3xl" aria-hidden="true" />
            <div className="absolute -bottom-40 -left-20 w-[26rem] h-[26rem] rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
            <svg className="absolute right-0 top-24 w-[34rem] max-w-[60%] opacity-[0.08] hidden md:block" viewBox="0 0 400 160" fill="none" stroke="white" strokeWidth="1.5" aria-hidden="true">
                <rect x="10" y="10" width="380" height="20" rx="3" />
                {Array.from({ length: 19 }).map((_, i) => <line key={`v${i}`} x1={20 + i * 20} y1="30" x2={20 + i * 20} y2="150" />)}
                {Array.from({ length: 6 }).map((_, i) => <line key={`h${i}`} x1="10" y1={50 + i * 20} x2="390" y2={50 + i * 20} />)}
            </svg>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                    <div className="max-w-2xl">
                        {eyebrow && (
                            <span className="inline-flex items-center gap-2 text-[#FFD369] text-xs font-bold uppercase tracking-[0.2em] mb-4">
                                <span className="w-6 h-px bg-[#FFD369]" />
                                {eyebrow}
                            </span>
                        )}
                        <h1 className={`${compact ? "text-4xl sm:text-5xl" : "text-4xl sm:text-5xl lg:text-6xl"} font-black text-white tracking-tight leading-[1.05]`}>
                            {title}
                        </h1>
                        {subtitle && <p className="mt-5 text-white/75 text-base sm:text-lg">{subtitle}</p>}
                    </div>
                    {aside}
                </div>
                {children}
            </div>

            <svg className="absolute bottom-0 left-0 w-full h-12 text-[#FFF8E8]" viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true">
                <path fill="currentColor" d="M0 32c120-18 240-27 360-27s240 9 360 18 240 13 360 9 240-14 360-27v43H0z" />
            </svg>
        </section>
    );
}

/** Selector tipo "píldora". `dark` para usar sobre la cabecera. */
export function Segmented({ value, onChange, options, dark = false, size = "md" }) {
    const pad = size === "sm" ? "px-3.5 py-1.5 text-[13px]" : "px-4 sm:px-5 py-2 text-sm";
    return (
        <div className={`inline-flex p-1 rounded-full max-w-full overflow-x-auto no-scrollbar ${dark ? "bg-white/10 backdrop-blur" : "bg-black/[0.05]"}`} role="tablist">
            {options.map((o) => {
                const active = value === o.value;
                return (
                    <button
                        key={o.value}
                        role="tab"
                        aria-selected={active}
                        onClick={() => onChange(o.value)}
                        className={`${pad} rounded-full font-semibold transition-all whitespace-nowrap inline-flex items-center gap-1.5 ${
                            active
                                ? dark ? "bg-white text-[#0D5C6E] shadow" : "bg-white text-gray-900 shadow-sm"
                                : dark ? "text-white/80 hover:text-white" : "text-gray-500 hover:text-gray-800"
                        }`}
                    >
                        {o.icon && <Icon name={o.icon} className="w-4 h-4" />}
                        {o.label}
                        {o.count !== undefined && <span className="text-xs opacity-60">{o.count}</span>}
                    </button>
                );
            })}
        </div>
    );
}

export function SearchInput({ value, onChange, placeholder = "Buscar…", className = "" }) {
    return (
        <div className={`relative ${className}`}>
            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-11 pr-10 py-2.5 rounded-full border-gray-200 bg-white text-sm shadow-sm focus:border-[#1CA9C9] focus:ring-[#1CA9C9]"
            />
            {value && (
                <button
                    onClick={() => onChange("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full text-gray-400 hover:text-gray-700 flex items-center justify-center"
                    aria-label="Borrar búsqueda"
                >
                    <Icon name="x" className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    );
}

export function SectionTitle({ icon, children, action, className = "" }) {
    return (
        <div className={`flex items-center justify-between gap-4 mb-4 ${className}`}>
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-gray-900">
                {icon && (
                    <span className="w-8 h-8 rounded-lg bg-[#1CA9C9]/10 text-[#1CA9C9] flex items-center justify-center">
                        <Icon name={icon} />
                    </span>
                )}
                {children}
            </h2>
            {action}
        </div>
    );
}

export function Spinner({ label }) {
    return (
        <div className="flex items-center justify-center gap-3 py-16 text-gray-500">
            <span className="w-8 h-8 rounded-full border-[3px] border-[#1CA9C9]/20 border-t-[#1CA9C9] animate-spin" />
            {label && <span className="text-sm font-medium">{label}</span>}
        </div>
    );
}

export function EmptyState({ icon = "calendar", title, children, action }) {
    return (
        <div className="max-w-md mx-auto text-center py-16">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1CA9C9]/10 text-[#1CA9C9] flex items-center justify-center mb-4">
                <Icon name={icon} className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-extrabold">{title}</h3>
            {children && <p className="text-gray-500 mt-1.5">{children}</p>}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}

/** Ventana modal (hoja inferior en móvil). */
export function Modal({ open, onClose, title, subtitle, children, footer }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-[#0A2E37]/60 backdrop-blur-sm animate-[fade_.2s_ease-out]" onClick={onClose} />
            <div className="relative bg-white w-full sm:max-w-4xl max-h-[92vh] sm:max-h-[88vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-[sheet_.25s_ease-out]">
                <div className="flex items-start justify-between gap-4 px-5 sm:px-7 pt-5 pb-4 border-b border-gray-100">
                    <div className="min-w-0">
                        {subtitle && <div className="text-[11px] font-bold uppercase tracking-wider text-[#1CA9C9] mb-1">{subtitle}</div>}
                        <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-tight">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="shrink-0 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
                        aria-label="Cerrar"
                    >
                        <Icon name="x" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5">{children}</div>
                {footer && <div className="px-5 sm:px-7 py-4 border-t border-gray-100 bg-gray-50/70">{footer}</div>}
            </div>
            <style>{`
                @keyframes fade { from { opacity:0 } to { opacity:1 } }
                @keyframes sheet { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:none } }
            `}</style>
        </div>
    );
}

/** Estilos para las tablas HTML que devuelve la RFEVB dentro de un modal. */
export const RFEVB_TABLE_CSS = (cls) => `
    .${cls} { font-size: 14px; color:#374151; }
    .${cls} table { width:100%; border-collapse:separate; border-spacing:0; margin:0.75rem 0; border:1px solid #e5e7eb; border-radius:14px; overflow:hidden; }
    .${cls} th, .${cls} td { padding:0.65rem 0.8rem; text-align:left; border-bottom:1px solid #f1f1f1; }
    .${cls} th { background:#f8fafb; font-size:11px; text-transform:uppercase; letter-spacing:.04em; color:#6b7280; font-weight:700; }
    .${cls} tr:last-child td { border-bottom:none; }
    .${cls} tbody tr:hover { background:#1CA9C90a; }
    .${cls} a { color:#0D5C6E; font-weight:600; text-decoration:underline; text-underline-offset:3px; }
    .${cls} h4 { color:#0D5C6E; font-weight:800; font-size:1.05rem; margin:0.25rem 0 0.5rem; }
    .${cls} .titulo2 { color:#6b7280; font-weight:600; font-size:0.85rem; margin-bottom:0.75rem; }
    @media (max-width: 767px) {
        .${cls} table { border:none; border-radius:0; }
        .${cls} thead { display:none; }
        .${cls} tbody tr { display:flex; flex-wrap:wrap; gap:4px 12px; align-items:center; background:#fff; border:1px solid #e5e7eb; border-radius:14px; margin-bottom:8px; padding:10px 14px; }
        .${cls} td { border:none; padding:0; font-size:13px; }
    }
`;

/** Escudo de equipo con iniciales de respaldo si la imagen falla. */
export function TeamAvatar({ team, size = "w-9 h-9" }) {
    const [failed, setFailed] = useState(false);
    const initials = (team?.name || "?")
        .split(/\s+/)
        .filter((w) => /[A-ZÁÉÍÓÚÑ0-9]/i.test(w[0]))
        .slice(0, 2)
        .map((w) => w[0])
        .join("");

    if (!team?.avatar || failed) {
        return (
            <span className={`${size} shrink-0 rounded-full bg-[#E6F6FA] text-[#0D5C6E] text-[11px] font-bold flex items-center justify-center ring-1 ring-black/5`}>
                {initials}
            </span>
        );
    }

    return (
        <img
            src={team.avatar}
            alt=""
            loading="lazy"
            onError={() => setFailed(true)}
            className={`${size} shrink-0 rounded-full object-cover bg-white ring-1 ring-black/5`}
        />
    );
}

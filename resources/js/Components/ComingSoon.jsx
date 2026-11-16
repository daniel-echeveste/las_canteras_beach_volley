import React from "react";
import { Link } from "@inertiajs/react";
import { PageShell, PageHero, Icon } from "@/Components/ui";

/** Plantilla para secciones que todavía están en construcción. */
export default function ComingSoon({ title, pageTitle, eyebrow, subtitle, icon, bullets = [] }) {
    return (
        <PageShell title={pageTitle}>
            <PageHero compact eyebrow={eyebrow} title={title} subtitle={subtitle} />
            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
                <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-8 sm:p-12 text-center">
                    <span className="mx-auto w-16 h-16 rounded-2xl bg-[#1CA9C9]/10 text-[#1CA9C9] flex items-center justify-center">
                        <Icon name={icon} className="w-8 h-8" />
                    </span>
                    <span className="mt-6 inline-block badge bg-[#FFD369]/40 text-[#5c3d00]">Próximamente</span>
                    <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight">Estamos preparando esta sección</h2>
                    {bullets.length > 0 && (
                        <ul className="mt-6 grid gap-2 text-left max-w-md mx-auto">
                            {bullets.map((b) => (
                                <li key={b} className="flex items-start gap-2.5 text-gray-600">
                                    <Icon name="check" className="w-5 h-5 text-[#1CA9C9] shrink-0 mt-0.5" /> {b}
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link href="/liga-autonomica" className="inline-flex items-center gap-1.5 rounded-full bg-[#0D5C6E] hover:bg-[#127F98] text-white font-bold px-6 py-3">
                            Ver la liga <Icon name="arrowRight" />
                        </Link>
                        <Link href="/" className="inline-flex items-center rounded-full bg-black/[0.05] hover:bg-black/10 font-bold px-6 py-3">
                            Ir al inicio
                        </Link>
                    </div>
                </div>
            </main>
        </PageShell>
    );
}

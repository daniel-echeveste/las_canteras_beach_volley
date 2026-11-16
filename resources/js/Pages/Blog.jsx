import React from "react";
import { Link, router } from "@inertiajs/react";
import AdUnit from "@/Components/AdUnit";
import { PageShell, PageHero, Segmented, Icon, EmptyState } from "@/Components/ui";

const stripHtml = (html) => {
    if (!html || typeof window === "undefined") return "";
    return new DOMParser().parseFromString(html, "text/html").body.textContent || "";
};

export const POST_TYPES = {
    noticia: { label: "Noticia", icon: "news", cls: "bg-sky-100 text-sky-800" },
    evento: { label: "Evento", icon: "calendar", cls: "bg-violet-100 text-violet-800" },
    torneo: { label: "Torneo", icon: "trophy", cls: "bg-amber-100 text-amber-800" },
};

const fmtDate = (d) => new Date(d).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

function TypeBadge({ type }) {
    const t = POST_TYPES[type];
    if (!t) return null;
    return (
        <span className={`badge ${t.cls}`}>
            <Icon name={t.icon} className="w-3 h-3" /> {t.label}
        </span>
    );
}

function Cover({ post, className = "" }) {
    return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#1CA9C9] to-[#0D5C6E] ${className}`}>
            {post.image_path ? (
                <img src={`/storage/${post.image_path}`} alt="" loading="lazy" onError={(e) => (e.currentTarget.style.display = "none")} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
                <img src="/logo-nobg.png" alt="" className="absolute inset-0 m-auto w-20 h-20 opacity-40" />
            )}
        </div>
    );
}

function FeaturedPost({ post }) {
    return (
        <Link href={`/blog/${post.slug}`} className="group grid lg:grid-cols-2 bg-white rounded-[2rem] overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-all duration-300 mb-8">
            <Cover post={post} className="aspect-[16/10] lg:aspect-auto lg:min-h-[340px]" />
            <div className="p-7 sm:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                    <TypeBadge type={post.post_type} />
                    <time className="text-sm text-gray-500">{fmtDate(post.created_at)}</time>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight group-hover:text-[#0D5C6E]">{post.title}</h2>
                <p className="mt-4 text-gray-600 leading-relaxed line-clamp-3">{stripHtml(post.content)}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 font-bold text-[#0D5C6E]">
                    Leer artículo <Icon name="arrowRight" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
            </div>
        </Link>
    );
}

function PostCard({ post }) {
    return (
        <Link href={`/blog/${post.slug}`} className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <Cover post={post} className="aspect-[16/10]" />
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2.5 mb-3">
                    <TypeBadge type={post.post_type} />
                    <time className="text-xs text-gray-500">{fmtDate(post.created_at)}</time>
                </div>
                <h3 className="text-lg font-extrabold leading-snug line-clamp-2 group-hover:text-[#0D5C6E]">{post.title}</h3>
                <div className="flex-1"><p className="mt-2 text-sm text-gray-500 line-clamp-3">{stripHtml(post.content)}</p></div>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#0D5C6E]">
                    Leer más <Icon name="arrow" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
            </div>
        </Link>
    );
}

export default function Blog({ posts, filters, adSettings }) {
    const current = filters?.type || "all";
    const list = Array.isArray(posts) ? posts : [];
    const [featured, ...rest] = list;

    const setFilter = (type) =>
        router.get(route("blog"), type === "all" ? {} : { type }, { preserveState: true, preserveScroll: true });

    const showAds = adSettings?.show_ads === "1";
    const adFrequency = adSettings?.ad_frequency || 3;

    return (
        <PageShell title="Blog - Las Canteras Beach Volley">
            <PageHero
                compact
                eyebrow="Blog"
                title="Noticias y eventos"
                subtitle="Lo último de la comunidad: crónicas, torneos, eventos y consejos para la arena."
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                <div className="mb-8">
                    <Segmented
                        value={current}
                        onChange={setFilter}
                        options={[
                            { value: "all", label: "Todo" },
                            { value: "noticia", label: "Noticias", icon: "news" },
                            { value: "evento", label: "Eventos", icon: "calendar" },
                            { value: "torneo", label: "Torneos", icon: "trophy" },
                        ]}
                    />
                </div>

                {list.length === 0 ? (
                    <EmptyState
                        icon="news"
                        title="No hay publicaciones"
                        action={current !== "all" && (
                            <button onClick={() => setFilter("all")} className="font-bold text-[#0D5C6E] hover:underline">Ver todas las publicaciones</button>
                        )}
                    >
                        Todavía no hay nada publicado en esta categoría.
                    </EmptyState>
                ) : (
                    <>
                        <FeaturedPost post={featured} />
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {rest.map((post, index) => (
                                <React.Fragment key={post.id}>
                                    <PostCard post={post} />
                                    {showAds && (index + 1) % adFrequency === 0 && index < rest.length - 1 && (
                                        <div className="bg-white rounded-3xl border border-black/5 p-6 flex flex-col items-center justify-center min-h-[220px]">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Publicidad</div>
                                            <AdUnit
                                                format="rectangle"
                                                slot={adSettings?.ad_slot || "8111656162"}
                                                client={adSettings?.ad_client_id || "ca-pub-4538032873726641"}
                                            />
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </PageShell>
    );
}

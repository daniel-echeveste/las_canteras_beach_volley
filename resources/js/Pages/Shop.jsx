import React, { useState } from "react";
import { PageShell, PageHero, Segmented, EmptyState, Icon } from "@/Components/ui";

// ─── PRODUCTOS ──────────────────────────────────────────────────────────────
// Edita este array para añadir / quitar productos.
// Campos:
//   id        → identificador único
//   name      → nombre del producto
//   description → descripción corta (~2 líneas)
//   price     → precio orientativo (string). Pon null si no quieres mostrarlo.
//   image     → URL de la imagen del producto
//   link      → enlace de afiliado Amazon u otra tienda
//   category  → "balones" | "redes" | "ropa" | "gafas" | "accesorios"
//   badge     → "Amazon" | "Tienda Amiga" | null
//   rating    → 1–5 (número). Pon null para no mostrar estrellas.
// ────────────────────────────────────────────────────────────────────────────

const PRODUCTS = [
    {
        id: 1,
        name: "Mikasa Beach Pro BV550C",
        description: "Balón oficial de la Federación Mundial (FIVB) y el Voleibol World (VW)",
        price: "90,91 €",
        image: "https://m.media-amazon.com/images/I/61q-tMNXL8L._AC_SL1000_.jpg",
        link: "https://amzn.to/3PE4tLb",
        category: "balones",
        badge: "Amazon",
        rating: 5,
    },
    {
        id: 2,
        name: "Wilson WTH00020XB Balón de Voléibol",
        description: "Balón de vóley-playa de tamaño oficial de la AVP para que juegues como los profesionales",
        price: "78,71 €",
        image: "https://m.media-amazon.com/images/I/8111KcIjdIL._AC_SL1500_.jpg",
        link: "https://amzn.to/3Nl67AT",
        category: "balones",
        badge: "Amazon",
        rating: 4,
    },
    {
        id: 11,
        name: "Molten Volleybal V5M5000",
        description: "Uso y disfrute en pistas o canchas de interior.",
        price: "78,71 €",
        image: "https://m.media-amazon.com/images/I/81UhGb1hCGL._AC_SX425_.jpg",
        link: "https://amzn.to/4lN6AIM",
        category: "balones",
        badge: "Amazon",
        rating: 4,
    },
    {
        id: 3,
        name: "Navaris Red Voley Portatil ",
        description: "SET COMPLETO: Disfruta de una sesión de voleibol con este set completo de red de voley portatil",
        price: "95,99 €",
        image: "https://m.media-amazon.com/images/I/81DYeGEDsRL._AC_SL1500_.jpg",
        link: "https://amzn.to/3NXrwQL",
        category: "redes",
        badge: "Amazon",
        rating: 4,
    },
    // {
    //     id: 4,
    //     name: "Set Red + Postes Playa",
    //     description: "Kit completo de red y postes ajustables de aluminio para montar tu propia cancha en cualquier playa.",
    //     price: "149,00 €",
    //     image: "https://m.media-amazon.com/images/I/81U5VKvHb7L._AC_SL1500_.jpg",
    //     link: "https://www.amazon.es/dp/B00GMEWT7O?tag=TU_TAG_AQUI",
    //     category: "redes",
    //     badge: "Amazon",
    //     rating: 4,
    // },
    {
        id: 5,
        name: "Camiseta sin Mangas para Hombre",
        description: "Tejido ultraligero de secado rápido con protección UV50+. Perfecta para largas jornadas de sol y arena.",
        price: "13,99€ ",
        image: "https://m.media-amazon.com/images/I/51dcS8VKA8L._AC_SX569_.jpg",
        link: "https://amzn.to/4bYd18t",
        category: "ropa",
        badge: "Amazon",
        rating: 4,
    },
    {
        id: 6,
        name: "Short de Playa Pro",
        description: "Pantalones cortos de surf Diseño de cordón con cintura elástica",
        price: "26,59 €",
        image: "https://m.media-amazon.com/images/I/71Z8qJTc3bL._AC_SX569_.jpg",
        link: "https://amzn.to/4lMpDTB",
        category: "ropa",
        badge: "Amazon",
        rating: 3,
    },
    
    {
        id: 12,
        name: "Lamicall Polarizadas Gafas de Sol ",
        description: " Lentes polarizadas ideales para jugar en la playa sin deslumbramiento.",
        price: "25,64€",
        image: "https://m.media-amazon.com/images/I/512c2FxUdbL._AC_SX425_.jpg",
        link: "https://amzn.to/41kBMWi",
        category: "gafas",
        badge: "Amazon",
        rating: 5,
    },
    {
        id: 7,
        name: "Oakley Oo9463 Sutro Lite",
        description: " Lentes polarizadas ideales para jugar en la playa sin deslumbramiento.",
        price: "138,75 €",
        image: "https://m.media-amazon.com/images/I/51pJBnfMllL._AC_SX679_.jpg",
        link: "https://amzn.to/3NHOg75",
        category: "gafas",
        badge: "Amazon",
        rating: 5,
    },
    {
        id: 8,
        name: "Quiksilver Slash - Gafas de Sol para Hombre",
        description: "Montura ligera flexible con lentes de policarbonato. Diseñadas para el surf y la playa.",
        price: " 120,30€ ",
        image: "https://m.media-amazon.com/images/I/41CPfRnm9pL._AC_SX466_.jpg",
        link: "https://amzn.to/4sqK3Uv",
        category: "gafas",
        badge: "Amazon",
        rating: 4,
    },
    {
        id: 9,
        name: "Cinchas de Amarre, 4 Piezas",
        description: "Cada cinchas de amarretiene 2m de largo y 25mm de ancho y puede soportar hasta 250kg.",
        price: "8,99 €",
        image: "https://m.media-amazon.com/images/I/81S2AenfABL._AC_SL1500_.jpg",
        link: "https://amzn.to/3PnTntT",
        category: "accesorios",
        badge: "Amazon",
        rating: 4,
    },
    {
        id: 10,
        name: "Mobi Lock Herramientas Ball Pump",
        description: "Rápido y fiable:",
        price: "12,99 €",
        image: "https://m.media-amazon.com/images/I/71czaMkxzPL._AC_SX425_.jpg",
        link: "https://amzn.to/47g1qz4",
        category: "accesorios",
        badge: "Amazon",
        rating: 4,
    },
    // ── Ejemplos de "Tienda Amiga" ────────────────────────────────────────────
    // Descomenta y rellena con los datos reales cuando tengas los links:
    // {
    //     id: 11,
    //     name: "Nombre del producto amigo",
    //     description: "Descripción corta del producto de la tienda amiga.",
    //     price: "XX,XX €",
    //     image: "https://url-de-la-imagen.jpg",
    //     link: "https://tiendaamiga.com/producto",
    //     category: "ropa",
    //     badge: "Tienda Amiga",
    //     rating: 5,
    // },
];

// ─── CATEGORÍAS ──────────────────────────────────────────────────────────────
const CATEGORIES = [
    { key: "all",        label: "Todos",       emoji: "⚡" },
    { key: "balones",    label: "Balones",      emoji: "🏐" },
    { key: "redes",      label: "Redes",        emoji: "🕸️" },
    { key: "ropa",       label: "Ropa",         emoji: "👕" },
    { key: "gafas",      label: "Gafas",        emoji: "🕶️" },
    { key: "accesorios", label: "Accesorios",   emoji: "🎒" },
];

// ─── ESTRELLAS ───────────────────────────────────────────────────────────────
function StarRating({ rating }) {
    if (!rating) return null;
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-3 h-3 sm:w-4 sm:h-4 ${star <= rating ? "text-amber-400" : "text-gray-200"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

// ─── BADGE ───────────────────────────────────────────────────────────────────
function Badge({ type }) {
    if (!type) return null;
    const isAmazon = type === "Amazon";
    return (
        <span className={`absolute top-3 left-3 badge shadow-sm ${isAmazon ? "bg-[#232F3E] text-white" : "bg-[#1CA9C9] text-white"}`}>
            {isAmazon ? "Amazon" : "Tienda amiga"}
        </span>
    );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product }) {
    const [imgError, setImgError] = useState(false);

    return (
        <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group bg-white rounded-3xl border border-black/5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden h-full"
        >
            <div className="relative aspect-square bg-white overflow-hidden">
                {!imgError ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-contain p-5 sm:p-7 group-hover:scale-105 transition-transform duration-500"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <img src="/logo-nobg.png" alt="" className="absolute inset-0 m-auto w-16 h-16 opacity-30" />
                )}
                <Badge type={product.badge} />
            </div>

            <div className="p-4 sm:p-5 flex flex-col flex-1 gap-2 border-t border-gray-100">
                <h3 className="font-extrabold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[#0D5C6E]">
                    {product.name}
                </h3>
                <div className="flex-1"><p className="text-xs sm:text-sm text-gray-500 line-clamp-2">{product.description}</p></div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-1">
                    <StarRating rating={product.rating} />
                    {product.price && <span className="text-base sm:text-lg font-black text-gray-900">{product.price.trim()}</span>}
                </div>
                <span className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0D5C6E] group-hover:bg-[#127F98] text-white font-bold py-2.5 text-xs sm:text-sm transition-colors">
                    Ver producto <Icon name="external" className="w-3.5 h-3.5" />
                </span>
            </div>
        </a>
    );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function Shop() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeBadge, setActiveBadge] = useState("all");

    const filtered = PRODUCTS.filter((p) => {
        const categoryMatch = activeCategory === "all" || p.category === activeCategory;
        const badgeMatch =
            activeBadge === "all" ||
            (activeBadge === "amazon" && p.badge === "Amazon") ||
            (activeBadge === "amiga" && p.badge === "Tienda Amiga");
        return categoryMatch && badgeMatch;
    });

    const hasFriendShops = PRODUCTS.some((p) => p.badge === "Tienda Amiga");
    const count = (key) => (key === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === key).length);

    return (
        <PageShell title="Tienda - Las Canteras Beach Volley">
            <PageHero
                compact
                eyebrow="Material recomendado"
                title="Tienda"
                subtitle="Balones, redes, ropa y gafas que usamos y recomendamos para jugar en la arena."
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-8">
                    <Segmented
                        value={activeCategory}
                        onChange={setActiveCategory}
                        options={CATEGORIES.filter((c) => count(c.key) > 0).map((c) => ({ value: c.key, label: c.label, count: count(c.key) }))}
                    />
                    {hasFriendShops && (
                        <Segmented
                            size="sm"
                            value={activeBadge}
                            onChange={setActiveBadge}
                            options={[
                                { value: "all", label: "Todas las tiendas" },
                                { value: "amazon", label: "Amazon" },
                                { value: "amiga", label: "Tiendas amigas" },
                            ]}
                        />
                    )}
                </div>

                {filtered.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                        {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
                    </div>
                ) : (
                    <EmptyState
                        icon="bag"
                        title="No hay productos en esta categoría"
                        action={
                            <button onClick={() => { setActiveCategory("all"); setActiveBadge("all"); }} className="font-bold text-[#0D5C6E] hover:underline">
                                Ver todos los productos
                            </button>
                        }
                    />
                )}

                <p className="mt-12 text-center text-xs text-gray-500 max-w-xl mx-auto">
                    Algunos enlaces son de afiliados de Amazon. Si compras a través de ellos, apoyas a Las Canteras Beach Volley sin ningún coste adicional para ti.
                </p>
            </main>
        </PageShell>
    );
}

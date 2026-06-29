import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [{ count: productCount }, { count: categoryCount }, { count: pendingCount }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    ]);

  const cards = [
    { label: "Productos", value: productCount ?? 0, href: "/admin/productos" },
    { label: "Categorías", value: categoryCount ?? 0, href: "/admin/categorias" },
    { label: "Pedidos pendientes", value: pendingCount ?? 0, href: "/admin/pedidos" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Resumen</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-lg border border-white/10 bg-white/5 p-6 transition hover:border-white/30"
          >
            <p className="text-sm text-white/60">{card.label}</p>
            <p className="mt-2 text-3xl font-bold">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

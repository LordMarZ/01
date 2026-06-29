import Link from "next/link";
import SiteHeader from "@/components/site-header";
import ProductCard from "@/components/product-card";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/types/database";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("active", true)
    .order("sort_order")
    .order("name");

  let query = supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (categoria) {
    const match = (categories as Category[] | null)?.find((c) => c.slug === categoria);
    if (match) query = query.eq("category_id", match.id);
  }

  const { data: products } = await query;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight">Catálogo</h1>
        <p className="mt-1 text-sm text-white/60">
          Coleccionables Darkside Bros. Agrega lo que quieras y coordinamos tu pedido.
        </p>

        {!!categories?.length && (
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/"
              className={`rounded-full border px-3 py-1 text-sm ${
                !categoria ? "border-white bg-white text-black" : "border-white/20 text-white/70"
              }`}
            >
              Todo
            </Link>
            {(categories as Category[]).map((c) => (
              <Link
                key={c.id}
                href={`/?categoria=${c.slug}`}
                className={`rounded-full border px-3 py-1 text-sm ${
                  categoria === c.slug
                    ? "border-white bg-white text-black"
                    : "border-white/20 text-white/70"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {(products as Product[] | null)?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {!products?.length && (
          <p className="mt-10 text-center text-white/50">
            Todavía no hay productos publicados. Vuelve pronto.
          </p>
        )}
      </main>
    </>
  );
}

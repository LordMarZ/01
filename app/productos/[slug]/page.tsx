import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import AddToCartButton from "@/components/add-to-cart-button";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/database";

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle<Product>();

  if (!product) notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-lg border border-white/10 bg-white/5">
            {product.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-white/30">
                Sin imagen
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-xl text-white/80">${product.price.toFixed(2)}</p>
            {product.description && (
              <p className="whitespace-pre-line text-sm text-white/60">{product.description}</p>
            )}
            <p className="text-xs text-white/40">
              {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}
            </p>
            <AddToCartButton
              productId={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.image_url}
              stock={product.stock}
            />
          </div>
        </div>
      </main>
    </>
  );
}

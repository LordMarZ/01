import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { upsertProduct, deleteProduct } from "../actions";
import ProductImageUpload from "@/components/admin/product-image-upload";
import type { Category, Product } from "@/types/database";

export default async function AdminProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const supabase = await createClient();
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("sort_order").order("name"),
  ]);

  const cats = (categories as Category[] | null) ?? [];
  const allProducts = (products as Product[] | null) ?? [];

  const countFor = (categoryId: string | null) =>
    allProducts.filter((p) => p.category_id === categoryId).length;

  let activeCategory: Category | null = null;
  let visibleProducts = allProducts;

  if (categoria === "sin-categoria") {
    visibleProducts = allProducts.filter((p) => !p.category_id);
  } else if (categoria) {
    activeCategory = cats.find((c) => c.slug === categoria) ?? null;
    visibleProducts = activeCategory
      ? allProducts.filter((p) => p.category_id === activeCategory!.id)
      : allProducts;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Productos</h1>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-56">
          <ul className="flex flex-col gap-1 rounded-lg border border-white/10 bg-white/5 p-2">
            <li>
              <Link
                href="/admin/productos"
                className={`flex items-center justify-between rounded px-3 py-2 text-sm ${
                  !categoria ? "bg-white text-black" : "text-white/70 hover:bg-white/10"
                }`}
              >
                Todos
                <span className="text-xs opacity-60">{allProducts.length}</span>
              </Link>
            </li>
            {cats.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/admin/productos?categoria=${c.slug}`}
                  className={`flex items-center justify-between rounded px-3 py-2 text-sm ${
                    categoria === c.slug ? "bg-white text-black" : "text-white/70 hover:bg-white/10"
                  }`}
                >
                  {c.name}
                  <span className="text-xs opacity-60">{countFor(c.id)}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/admin/productos?categoria=sin-categoria"
                className={`flex items-center justify-between rounded px-3 py-2 text-sm ${
                  categoria === "sin-categoria" ? "bg-white text-black" : "text-white/70 hover:bg-white/10"
                }`}
              >
                Sin categoría
                <span className="text-xs opacity-60">{countFor(null)}</span>
              </Link>
            </li>
          </ul>
        </aside>

        <div className="flex-1">
          <form
            action={upsertProduct}
            className="grid grid-cols-1 gap-3 rounded-lg border border-white/10 bg-white/5 p-4 sm:grid-cols-2"
          >
            <input
              name="name"
              required
              placeholder="Nombre"
              className="rounded border border-white/20 bg-black px-3 py-2 text-sm"
            />
            <select
              name="category_id"
              className="rounded border border-white/20 bg-black px-3 py-2 text-sm"
              defaultValue={activeCategory?.id ?? ""}
            >
              <option value="">Sin categoría</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="Precio"
              className="rounded border border-white/20 bg-black px-3 py-2 text-sm"
            />
            <input
              name="stock"
              type="number"
              min="0"
              required
              placeholder="Stock"
              className="rounded border border-white/20 bg-black px-3 py-2 text-sm"
            />
            <ProductImageUpload />
            <textarea
              name="description"
              placeholder="Descripción"
              className="rounded border border-white/20 bg-black px-3 py-2 text-sm sm:col-span-2"
            />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="active" defaultChecked /> Activo
            </label>
            <button className="rounded bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90 sm:col-span-2">
              Agregar producto
            </button>
          </form>

          <ul className="mt-6 divide-y divide-white/10 rounded-lg border border-white/10">
            {visibleProducts.map((product) => (
              <li key={product.id} className="flex flex-col gap-3 p-4">
                <form action={upsertProduct} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input type="hidden" name="id" value={product.id} />
                  <input
                    name="name"
                    defaultValue={product.name}
                    className="rounded border border-white/20 bg-black px-3 py-2 text-sm"
                  />
                  <select
                    name="category_id"
                    defaultValue={product.category_id ?? ""}
                    className="rounded border border-white/20 bg-black px-3 py-2 text-sm"
                  >
                    <option value="">Sin categoría</option>
                    {cats.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={product.price}
                    className="rounded border border-white/20 bg-black px-3 py-2 text-sm"
                  />
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    defaultValue={product.stock}
                    className="rounded border border-white/20 bg-black px-3 py-2 text-sm"
                  />
                  <ProductImageUpload defaultValue={product.image_url} />
                  <textarea
                    name="description"
                    defaultValue={product.description ?? ""}
                    className="rounded border border-white/20 bg-black px-3 py-2 text-sm sm:col-span-2"
                  />
                  <div className="flex items-center justify-between sm:col-span-2">
                    <label className="flex items-center gap-2 text-sm text-white/70">
                      <input type="checkbox" name="active" defaultChecked={product.active} /> Activo
                    </label>
                    <button className="rounded border border-white/20 px-3 py-2 text-sm hover:bg-white/10">
                      Guardar
                    </button>
                  </div>
                </form>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={product.id} />
                  <button className="self-start rounded border border-red-500/40 px-3 py-1 text-xs text-red-400 hover:bg-red-500/10">
                    Eliminar producto
                  </button>
                </form>
              </li>
            ))}
            {!visibleProducts.length && (
              <li className="p-4 text-sm text-white/50">No hay productos en esta categoría.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

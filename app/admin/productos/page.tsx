import { createClient } from "@/lib/supabase/server";
import { upsertProduct, deleteProduct } from "../actions";
import type { Category, Product } from "@/types/database";

export default async function AdminProductosPage() {
  const supabase = await createClient();
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("name"),
  ]);

  const cats = (categories as Category[] | null) ?? [];

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold">Productos</h1>

      <form
        action={upsertProduct}
        className="mt-6 grid grid-cols-1 gap-3 rounded-lg border border-white/10 bg-white/5 p-4 sm:grid-cols-2"
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
          defaultValue=""
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
        <input
          name="image_url"
          placeholder="URL de imagen"
          className="rounded border border-white/20 bg-black px-3 py-2 text-sm sm:col-span-2"
        />
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
        {(products as Product[] | null)?.map((product) => (
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
              <input
                name="image_url"
                defaultValue={product.image_url ?? ""}
                className="rounded border border-white/20 bg-black px-3 py-2 text-sm sm:col-span-2"
              />
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
        {!products?.length && (
          <li className="p-4 text-sm text-white/50">Todavía no hay productos.</li>
        )}
      </ul>
    </div>
  );
}

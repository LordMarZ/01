import { createClient } from "@/lib/supabase/server";
import { upsertCategory, deleteCategory } from "../actions";
import type { Category } from "@/types/database";

export default async function AdminCategoriasPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")
    .order("name");

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">Categorías</h1>

      <form
        action={upsertCategory}
        className="mt-6 flex flex-wrap items-end gap-3 rounded-lg border border-white/10 bg-white/5 p-4"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/60">Nombre</label>
          <input
            name="name"
            required
            className="rounded border border-white/20 bg-black px-3 py-2 text-sm"
            placeholder="Ej. Figuras"
          />
        </div>
        <label className="flex items-center gap-2 pb-2 text-sm">
          <input type="checkbox" name="active" defaultChecked /> Activa
        </label>
        <button className="rounded bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90">
          Agregar
        </button>
      </form>

      <ul className="mt-6 divide-y divide-white/10 rounded-lg border border-white/10">
        {(categories as Category[] | null)?.map((category) => (
          <li key={category.id} className="flex items-center justify-between gap-4 p-4">
            <form action={upsertCategory} className="flex flex-1 items-center gap-3">
              <input type="hidden" name="id" value={category.id} />
              <input
                name="name"
                defaultValue={category.name}
                className="flex-1 rounded border border-white/20 bg-black px-3 py-2 text-sm"
              />
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input type="checkbox" name="active" defaultChecked={category.active} /> Activa
              </label>
              <button className="rounded border border-white/20 px-3 py-2 text-sm hover:bg-white/10">
                Guardar
              </button>
            </form>
            <form action={deleteCategory}>
              <input type="hidden" name="id" value={category.id} />
              <button className="rounded border border-red-500/40 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10">
                Eliminar
              </button>
            </form>
          </li>
        ))}
        {!categories?.length && (
          <li className="p-4 text-sm text-white/50">Todavía no hay categorías.</li>
        )}
      </ul>
    </div>
  );
}

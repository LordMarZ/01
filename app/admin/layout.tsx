import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-6">
          <span className="font-bold tracking-tight">Darkside Bros · Admin</span>
          <nav className="flex gap-4 text-sm text-white/70">
            <Link href="/admin" className="hover:text-white">
              Resumen
            </Link>
            <Link href="/admin/categorias" className="hover:text-white">
              Categorías
            </Link>
            <Link href="/admin/productos" className="hover:text-white">
              Productos
            </Link>
            <Link href="/admin/pedidos" className="hover:text-white">
              Pedidos
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm text-white/60">
          <span>{user?.email}</span>
          <form action={signOut}>
            <button className="rounded border border-white/20 px-3 py-1 hover:bg-white/10">
              Salir
            </button>
          </form>
        </div>
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}

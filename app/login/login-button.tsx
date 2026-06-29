"use client";

import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginButton() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/admin";
  const error = searchParams.get("error");

  async function signInWithGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={signInWithGoogle}
        className="flex items-center gap-3 rounded-md bg-white px-5 py-3 font-medium text-black transition hover:bg-white/90"
      >
        Continuar con Google
      </button>
      {error === "no_autorizado" && (
        <p className="text-sm text-red-400">Tu cuenta no tiene acceso de administrador.</p>
      )}
      {error === "auth" && (
        <p className="text-sm text-red-400">No se pudo iniciar sesión, intenta de nuevo.</p>
      )}
    </div>
  );
}

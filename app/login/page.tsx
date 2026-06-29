import { Suspense } from "react";
import LoginButton from "./login-button";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black px-4 text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Darkside Bros</h1>
        <p className="mt-1 text-sm text-white/60">Acceso al panel de administración</p>
      </div>
      <Suspense>
        <LoginButton />
      </Suspense>
    </main>
  );
}

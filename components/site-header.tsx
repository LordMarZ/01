"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";

export default function SiteHeader() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-neutral-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-bold tracking-tight">
          Darkside Café
        </Link>
        <Link
          href="/carrito"
          className="relative rounded border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10"
        >
          Carrito
          {count > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

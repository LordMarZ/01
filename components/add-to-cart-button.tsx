"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";

export default function AddToCartButton({
  productId,
  name,
  price,
  imageUrl,
  stock,
}: {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  stock: number;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (stock <= 0) {
    return (
      <span className="rounded border border-white/10 px-3 py-1.5 text-xs text-white/40">
        Sin stock
      </span>
    );
  }

  return (
    <button
      onClick={() => {
        addItem({ productId, name, price, imageUrl, stock }, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
      className="rounded bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-white/90"
    >
      {added ? "Agregado ✓" : "Agregar al carrito"}
    </button>
  );
}

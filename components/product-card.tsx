import Link from "next/link";
import AddToCartButton from "./add-to-cart-button";
import type { Product } from "@/types/database";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-white/5">
      <Link href={`/productos/${product.slug}`} className="block aspect-square bg-white/5">
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
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link href={`/productos/${product.slug}`} className="font-medium hover:underline">
          {product.name}
        </Link>
        <p className="text-sm text-white/60">${product.price.toFixed(2)}</p>
        <div className="mt-auto">
          <AddToCartButton
            productId={product.id}
            name={product.name}
            price={product.price}
            imageUrl={product.image_url}
            stock={product.stock}
          />
        </div>
      </div>
    </div>
  );
}

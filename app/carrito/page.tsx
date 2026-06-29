"use client";

import { useState } from "react";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import { useCart } from "@/context/cart-context";
import { createOrder } from "./actions";

export default function CarritoPage() {
  const { items, removeItem, setQuantity, clear, total } = useCart();
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{ orderId: string; total: number } | null>(
    null
  );

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await createOrder({
      ...form,
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    });

    setSubmitting(false);

    if (!result.orderId) {
      setError(result.error ?? "No se pudo crear el pedido.");
      return;
    }

    setConfirmation({ orderId: result.orderId, total: result.total });
    clear();
  }

  if (confirmation) {
    const summary = items
      .map((i) => `${i.quantity}x ${i.name}`)
      .join(", ");
    const message = `Hola! Hice el pedido #${confirmation.orderId.slice(0, 8)} por $${confirmation.total.toFixed(2)} (${summary || "ver detalle"}). Quiero coordinar el pago.`;
    const whatsappUrl = whatsappNumber
      ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
      : null;

    return (
      <>
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">¡Pedido recibido!</h1>
          <p className="text-white/70">
            Tu pedido #{confirmation.orderId.slice(0, 8)} por ${confirmation.total.toFixed(2)} fue
            registrado. Coordina el pago y entrega por WhatsApp.
          </p>
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded bg-green-600 px-5 py-3 font-medium hover:bg-green-500"
            >
              Continuar por WhatsApp
            </a>
          )}
          <Link href="/" className="text-sm text-white/60 hover:underline">
            Volver al catálogo
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-bold">Tu carrito</h1>

        {!items.length ? (
          <p className="mt-8 text-white/60">
            Tu carrito está vacío.{" "}
            <Link href="/" className="underline">
              Ver catálogo
            </Link>
          </p>
        ) : (
          <>
            <ul className="mt-6 divide-y divide-white/10 rounded-lg border border-white/10">
              {items.map((item) => (
                <li key={item.productId} className="flex items-center gap-4 p-4">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-white/60">${item.price.toFixed(2)}</p>
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={item.stock}
                    value={item.quantity}
                    onChange={(e) => setQuantity(item.productId, Number(e.target.value))}
                    className="w-16 rounded border border-white/20 bg-black px-2 py-1 text-center"
                  />
                  <p className="w-20 text-right font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-sm text-red-400 hover:underline"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-right text-xl font-bold">Total: ${total.toFixed(2)}</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
              <h2 className="font-medium">Datos para tu pedido</h2>
              <input
                required
                placeholder="Nombre completo"
                value={form.customerName}
                onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                className="w-full rounded border border-white/20 bg-black px-3 py-2 text-sm"
              />
              <input
                required
                placeholder="Teléfono / WhatsApp"
                value={form.customerPhone}
                onChange={(e) => setForm((f) => ({ ...f, customerPhone: e.target.value }))}
                className="w-full rounded border border-white/20 bg-black px-3 py-2 text-sm"
              />
              <input
                type="email"
                placeholder="Correo (opcional)"
                value={form.customerEmail}
                onChange={(e) => setForm((f) => ({ ...f, customerEmail: e.target.value }))}
                className="w-full rounded border border-white/20 bg-black px-3 py-2 text-sm"
              />
              <input
                placeholder="Dirección de entrega (opcional)"
                value={form.customerAddress}
                onChange={(e) => setForm((f) => ({ ...f, customerAddress: e.target.value }))}
                className="w-full rounded border border-white/20 bg-black px-3 py-2 text-sm"
              />
              <textarea
                placeholder="Notas (opcional)"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full rounded border border-white/20 bg-black px-3 py-2 text-sm"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                disabled={submitting}
                className="w-full rounded bg-white px-4 py-3 font-medium text-black hover:bg-white/90 disabled:opacity-50"
              >
                {submitting ? "Enviando..." : "Confirmar pedido"}
              </button>
            </form>
          </>
        )}
      </main>
    </>
  );
}

import { createClient } from "@/lib/supabase/server";
import { updateOrderStatus } from "../actions";
import type { OrderStatus, OrderWithItems } from "@/types/database";

const STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmado" },
  { value: "preparing", label: "Preparando" },
  { value: "ready", label: "Listo" },
  { value: "delivered", label: "Entregado" },
  { value: "cancelled", label: "Cancelado" },
];

export default async function AdminPedidosPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold">Pedidos</h1>

      <ul className="mt-6 space-y-4">
        {(orders as OrderWithItems[] | null)?.map((order) => (
          <li key={order.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{order.customer_name}</p>
                <p className="text-sm text-white/60">{order.customer_phone}</p>
                {order.customer_address && (
                  <p className="text-sm text-white/60">{order.customer_address}</p>
                )}
                {order.notes && <p className="mt-1 text-sm text-white/50">Nota: {order.notes}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm text-white/50">
                  {new Date(order.created_at).toLocaleString("es-MX")}
                </p>
                <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
              </div>
            </div>

            <ul className="mt-3 space-y-1 text-sm text-white/70">
              {order.order_items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>
                    {item.quantity} × {item.product_name}
                  </span>
                  <span>${item.subtotal.toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <form action={updateOrderStatus} className="mt-3 flex items-center gap-2">
              <input type="hidden" name="id" value={order.id} />
              <select
                name="status"
                defaultValue={order.status}
                className="rounded border border-white/20 bg-black px-3 py-1.5 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button className="rounded border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10">
                Actualizar estado
              </button>
            </form>
          </li>
        ))}
        {!orders?.length && <li className="text-sm text-white/50">Todavía no hay pedidos.</li>}
      </ul>
    </div>
  );
}

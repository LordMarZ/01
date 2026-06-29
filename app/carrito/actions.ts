"use server";

import { createClient } from "@/lib/supabase/server";

interface OrderItemInput {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  notes?: string;
  items: OrderItemInput[];
}

type CreateOrderResult =
  | { error: string; orderId?: undefined; total?: undefined }
  | { error?: undefined; orderId: string; total: number };

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  if (!input.items.length) {
    return { error: "El carrito está vacío." };
  }
  if (!input.customerName.trim() || !input.customerPhone.trim()) {
    return { error: "Nombre y teléfono son obligatorios." };
  }

  const supabase = await createClient();
  const total = input.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      customer_name: input.customerName.trim(),
      customer_phone: input.customerPhone.trim(),
      customer_email: input.customerEmail?.trim() || null,
      customer_address: input.customerAddress?.trim() || null,
      notes: input.notes?.trim() || null,
      total,
    })
    .select("id")
    .single();

  if (error || !order) {
    return { error: "No se pudo crear el pedido, intenta de nuevo." };
  }

  const itemsPayload = input.items.map((i) => ({
    order_id: order.id,
    product_id: i.productId,
    product_name: i.name,
    unit_price: i.price,
    quantity: i.quantity,
    subtotal: i.price * i.quantity,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(itemsPayload);
  if (itemsError) {
    return { error: "No se pudo guardar el detalle del pedido." };
  }

  return { orderId: order.id as string, total };
}

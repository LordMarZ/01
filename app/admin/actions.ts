"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/types/database";

const DIACRITICS = new RegExp("[̀-ͯ]", "g");

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function uniqueSlug(value: string) {
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${slugify(value)}-${suffix}`;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function upsertCategory(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim() ?? "";
  const active = formData.get("active") === "on";
  if (!name) return;

  if (id) {
    await supabase.from("categories").update({ name, active }).eq("id", id);
  } else {
    const { error } = await supabase
      .from("categories")
      .insert({ name, slug: slugify(name), active });
    if (error?.code === "23505") {
      await supabase.from("categories").insert({ name, slug: uniqueSlug(name), active });
    }
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/");
}

export async function deleteCategory(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id")?.toString();
  if (!id) return;
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categorias");
  revalidatePath("/");
}

export async function upsertProduct(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() || null;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const image_url = formData.get("image_url")?.toString().trim() || null;
  const category_id = formData.get("category_id")?.toString() || null;
  const active = formData.get("active") === "on";

  if (!name || Number.isNaN(price) || Number.isNaN(stock)) return;

  const base = { name, description, price, stock, image_url, category_id, active };

  if (id) {
    await supabase.from("products").update(base).eq("id", id);
  } else {
    const { error } = await supabase
      .from("products")
      .insert({ ...base, slug: slugify(name) });
    if (error?.code === "23505") {
      await supabase.from("products").insert({ ...base, slug: uniqueSlug(name) });
    }
  }

  revalidatePath("/admin/productos");
  revalidatePath("/");
}

export async function deleteProduct(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id")?.toString();
  if (!id) return;
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/productos");
  revalidatePath("/");
}

export async function updateOrderStatus(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id")?.toString();
  const status = formData.get("status")?.toString() as OrderStatus | undefined;
  if (!id || !status) return;
  await supabase.from("orders").update({ status }).eq("id", id);
  revalidatePath("/admin/pedidos");
}

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "darkside_bros-products";

export default function ProductImageUpload({
  name = "image_url",
  defaultValue,
}: {
  name?: string;
  defaultValue?: string | null;
}) {
  const [imageUrl, setImageUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const supabase = createClient();
    const extension = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
    });

    if (uploadError) {
      setError("No se pudo subir la imagen.");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    setImageUrl(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="flex items-center gap-3 sm:col-span-2">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded border border-white/20 bg-black">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs text-white/30">Sin foto</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-xs text-white/70"
        />
        {uploading && <p className="text-xs text-white/50">Subiendo...</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
      <input type="hidden" name={name} value={imageUrl} />
    </div>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAuth } from "@/lib/supabase/auth";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAuth } from "@/lib/supabase/auth";

export async function buatDeskripsiAI(nama, harga) {
  const supabase = await supabaseAuth();
  const { data } = await supabase.auth.getUser();
  if (!data?.user) return { error: "Kamu harus login dulu." };

  const namaBersih = String(nama ?? "").trim().slice(0, 100);
  if (!namaBersih) return { error: "Isi nama produk dulu." };

  const angka = Number(harga);
  const infoHarga = Number.isFinite(angka) && angka > 0
    ? ` berharga Rp ${new Intl.NumberFormat("id-ID").format(angka)}`
    : "";

  const kunci = process.env.ANTHROPIC_API_KEY;
  if (!kunci) return { error: "ANTHROPIC_API_KEY belum diisi di environment variable." };

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": kunci,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-5-5",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content:
              `Tulis deskripsi singkat (2 sampai 3 kalimat) dalam bahasa Indonesia yang ramah untuk produk UMKM bernama "${namaBersih}"${infoHarga}. ` +
              `Jangan mengarang bahan, komposisi, atau klaim kesehatan. Jangan pakai emoji. ` +
              `Keluarkan hanya teks deskripsinya.`,
          },
        ],
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      return { error: "Gagal membuat deskripsi: " + (json?.error?.message ?? res.status) };
    }
    const teks = (json.content ?? [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    if (!teks) return { error: "AI tidak mengembalikan teks." };
    return { teks };
  } catch {
    return { error: "Tidak bisa menghubungi layanan AI." };
  }
}
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import TombolWhatsApp from "@/components/TombolWhatsApp";

export const dynamic = "force-dynamic";

export default async function DetailProduk({ params }) {
  const { id } = await params; // di Next.js 16, params adalah Promise

  const { data, error } = await supabaseServer()
    .from("produk")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  // 22P02 = format id tidak valid (mis. /produk/abc) -> anggap tidak ditemukan
  if (error && error.code !== "22P02") throw error;
  if (!data) notFound();

  return (
    <main>
      {/* Pertahankan tampilan lama (foto, nama, harga, deskripsi) di sini,
          cukup ganti sumber datanya menjadi `data`. */}
      <h1>{data.nama}</h1>
      <p>{data.deskripsi}</p>
      <TombolWhatsApp produk={data} />
    </main>
  );
}
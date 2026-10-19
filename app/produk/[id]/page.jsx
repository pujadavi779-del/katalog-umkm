import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import TombolWhatsApp from "@/components/TombolWhatsApp";

export const dynamic = "force-dynamic";

export default async function DetailProduk({ params }) {
  const { id } = await params;

  const { data, error } = await supabaseServer()
    .from("produk")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error && error.code !== "22P02") throw error;
  if (!data) notFound();

  return (
    <main>
      {/* Tempel tampilan lamamu di sini, pakai data.nama, data.harga, data.deskripsi */}
      <h1>{data.nama}</h1>
      <p>{data.deskripsi}</p>
      <TombolWhatsApp produk={data} />
    </main>
  );
}
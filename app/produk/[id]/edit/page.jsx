import { notFound } from "next/navigation";
import FormProduk from "@/components/FormProduk";
import { supabaseServer } from "@/lib/supabase/server";
import { ubahProduk } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function HalamanUbahProduk({ params }) {
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
      <FormProduk aksi={ubahProduk.bind(null, data.id)} produk={data} label="Simpan perubahan" />
    </main>
  );
}
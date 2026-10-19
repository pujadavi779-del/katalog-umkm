import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { ubahProduk } from "@/app/admin/actions";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanUbahProduk({ params, searchParams }) {
  const { id } = await params;
  const p = await searchParams;
  const pesanError = p?.error;

  let produk = null;

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      produk = data;
    }
  } catch (err) {
    // Abaikan error agar produk tetap null
  }

  if (!produk) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold">Ubah produk</h1>
        <p className="mt-1 text-sm text-teks-lembut">Perbarui informasi produk di tokomu.</p>
      </div>

      {pesanError && (
        <p className="max-w-xl rounded-lg border border-garis bg-permukaan p-3 text-sm text-bahaya">
          {pesanError}
        </p>
      )}

      <FormProduk produk={produk} labelTombol="Simpan perubahan" action={ubahProduk} />
    </div>
  );
}

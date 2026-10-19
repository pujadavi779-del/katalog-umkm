import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin({ searchParams }) {
  const params = await searchParams;
  const pesanSukses = params?.sukses;
  const pesanError = params?.error;

  let daftarProduk = [];
  let errorMsg = null;

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      errorMsg = error.message;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    errorMsg = err.message;
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />

      {pesanSukses && (
        <p className="rounded-lg border border-garis bg-permukaan p-3 text-sm font-medium text-utama">
          {pesanSukses}
        </p>
      )}

      {(pesanError || errorMsg) && (
        <p className="rounded-lg border border-garis bg-permukaan p-3 text-sm text-bahaya">
          {pesanError || `Gagal memuat produk: ${errorMsg}`}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>

      <TabelProduk daftarProduk={daftarProduk} />
    </div>
  );
}

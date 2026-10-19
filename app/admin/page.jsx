import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { hapusProduk } from "./actions";
import TombolHapus from "@/components/TombolHapus";

export const dynamic = "force-dynamic";

export default async function AdminProduk() {
  let produk = [];
  let pesanError = null;

  try {
    const { data, error } = await supabaseServer()
      .from("produk")
      .select("*")
      .order("id", { ascending: true });
    if (error) throw error;
    produk = data ?? [];
  } catch (e) {
    pesanError = e?.message || "Terjadi kesalahan yang tidak diketahui.";
  }

  return (
    <main>
      <Link href="/admin/produk/baru">Tambah produk</Link>
      {pesanError ? (
        <p role="alert">Gagal mengambil data produk: {pesanError}</p>
      ) : produk.length === 0 ? (
        <p>Belum ada produk</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Harga</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {produk.map((p) => (
              <tr key={p.id}>
                <td>{p.nama}</td>
                <td>{"Rp " + new Intl.NumberFormat("id-ID").format(p.harga)}</td>
                <td>
                  <Link href={`/admin/produk/${p.id}/edit`}>Ubah</Link>
                  <TombolHapus aksi={hapusProduk.bind(null, p.id)} nama={p.nama} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
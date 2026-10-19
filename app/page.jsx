import KartuProduk from "@/components/KartuProduk";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Beranda({ searchParams }) {
  const { q } = await searchParams;
  const kata = (typeof q === "string" ? q : "").trim();

  let produk = [];
  let pesanError = null;

  try {
    let query = supabaseServer().from("produk").select("*").order("id", { ascending: true });
    if (kata) query = query.ilike("nama", `%${kata}%`);
    const { data, error } = await query;
    if (error) throw error;
    produk = data ?? [];
  } catch (e) {
    pesanError = e?.message || "Terjadi kesalahan yang tidak diketahui.";
  }

  return (
    <main>
      <form action="/" method="get">
        <input name="q" defaultValue={kata} placeholder="Cari produk..." />
        <button type="submit">Cari</button>
      </form>

      {pesanError ? (
        <p role="alert">Gagal mengambil data produk: {pesanError}</p>
      ) : produk.length === 0 ? (
        <p>{kata ? `Produk "${kata}" tidak ditemukan` : "Belum ada produk"}</p>
      ) : (
        <div>
          {produk.map((p) => (
            <KartuProduk key={p.id} produk={p} />
          ))}
        </div>
      )}
    </main>
  );
}
import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import { toko } from "@/lib/toko";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog({ searchParams }) {
  const params = await searchParams;
  const q = (params?.q || "").trim();
  const kategori = (params?.kategori || "").trim();

  let daftarProduk = [];
  let daftarKategori = [];
  let pesanError = null;

  try {
    const supabase = createServerClient();

    // Ambil daftar unik semua kategori
    const { data: allKategoriData } = await supabase
      .from("produk")
      .select("kategori");
    
    daftarKategori = Array.from(
      new Set((allKategoriData || []).map((item) => item.kategori).filter(Boolean))
    );

    // Filter produk berdasarkan nama dan kategori
    let query = supabase.from("produk").select("*");

    if (q) {
      query = query.ilike("nama", `%${q}%`);
    }

    if (kategori && kategori !== "Semua") {
      query = query.eq("kategori", kategori);
    }

    const { data, error } = await query.order("id", { ascending: true });

    if (error) {
      pesanError = `Gagal memuat produk: ${error.message}`;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = `Gagal memuat produk: ${err.message}`;
  }

  const isFiltering = Boolean(q || (kategori && kategori !== "Semua"));

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-6 pb-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="judul-produk" className="text-xl font-bold">
            Produk kami
          </h2>

          {/* Form Pencarian */}
          <form method="GET" action="/" className="flex w-full items-center gap-2 sm:w-auto">
            {kategori && kategori !== "Semua" && (
              <input type="hidden" name="kategori" value={kategori} />
            )}
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Cari produk..."
              className="w-full rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none sm:w-60"
            />
            <button
              type="submit"
              className="rounded-lg bg-utama px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-utama-gelap"
            >
              Cari
            </button>
            {isFiltering && (
              <Link
                href="/"
                className="whitespace-nowrap text-xs text-teks-lembut underline underline-offset-4 hover:text-utama"
              >
                Reset
              </Link>
            )}
          </form>
        </div>

        {/* Filter Kategori */}
        {daftarKategori.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={q ? `/?q=${encodeURIComponent(q)}` : "/"}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                !kategori || kategori === "Semua"
                  ? "bg-utama text-white"
                  : "border border-garis bg-permukaan text-teks hover:bg-garis"
              }`}
            >
              Semua
            </Link>
            {daftarKategori.map((kat) => {
              const href = q
                ? `/?q=${encodeURIComponent(q)}&kategori=${encodeURIComponent(kat)}`
                : `/?kategori=${encodeURIComponent(kat)}`;
              const isActive = kategori === kat;

              return (
                <Link
                  key={kat}
                  href={href}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-utama text-white"
                      : "border border-garis bg-permukaan text-teks hover:bg-garis"
                  }`}
                >
                  {kat}
                </Link>
              );
            })}
          </div>
        )}

        {pesanError ? (
          <p className="rounded-lg border border-garis bg-permukaan p-4 text-sm text-bahaya">
            {pesanError}
          </p>
        ) : daftarProduk.length === 0 ? (
          <p className="text-teks-lembut">
            {isFiltering
              ? "Produk yang Anda cari tidak ditemukan"
              : "Belum ada produk"}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

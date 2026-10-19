import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { tambahProduk } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function HalamanTambahProduk({ searchParams }) {
  const params = await searchParams;
  const pesanError = params?.error;

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold">Tambah produk</h1>
        <p className="mt-1 text-sm text-teks-lembut">Tambahkan produk baru ke dalam katalog tokomu.</p>
      </div>

      {pesanError && (
        <p className="max-w-xl rounded-lg border border-garis bg-permukaan p-3 text-sm text-bahaya">
          {pesanError}
        </p>
      )}

      <FormProduk labelTombol="Simpan produk" action={tambahProduk} />
    </div>
  );
}

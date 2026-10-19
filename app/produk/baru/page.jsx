import FormProduk from "@/components/FormProduk";
import { tambahProduk } from "../../actions";

export default function HalamanTambahProduk() {
  return (
    <main>
      <FormProduk aksi={tambahProduk} label="Tambah produk" />
    </main>
  );
}
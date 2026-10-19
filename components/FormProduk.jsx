"use client";

import { useActionState } from "react";

export default function FormProduk({ aksi, produk = {}, label = "Simpan" }) {
  const [state, jalankan, proses] = useActionState(aksi, null);
  const nilai = (kolom) => state?.nilai?.[kolom] ?? produk[kolom] ?? "";

  return (
    <form action={jalankan}>
      <input name="nama" placeholder="Nama produk" defaultValue={nilai("nama")} required />
      <input name="harga" type="number" min="0" placeholder="Harga" defaultValue={nilai("harga")} required />
      <textarea name="deskripsi" placeholder="Deskripsi" defaultValue={nilai("deskripsi")} />
      <input name="foto" placeholder="Alamat foto (URL)" defaultValue={nilai("foto")} />
      {state?.error && <p role="alert">{state.error}</p>}
      <button type="submit" disabled={proses}>
        {proses ? "Menyimpan..." : label}
      </button>
    </form>
  );
}
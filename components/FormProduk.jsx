"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { buatDeskripsiAI } from "@/app/admin/actions";

export default function FormProduk({ aksi, produk = {}, label = "Simpan" }) {
  const [state, jalankan, proses] = useActionState(aksi, null);
  const formRef = useRef(null);
  const [pesanAI, setPesanAI] = useState(null);
  const [sedangAI, mulaiAI] = useTransition();
  const nilai = (kolom) => state?.nilai?.[kolom] ?? produk[kolom] ?? "";

  function buatDeskripsi() {
    const isian = formRef.current.elements;
    setPesanAI(null);
    mulaiAI(async () => {
      const hasil = await buatDeskripsiAI(isian.nama.value, isian.harga.value);
      if (hasil?.error) setPesanAI(hasil.error);
      else isian.deskripsi.value = hasil.teks;
    });
  }

  return (
    <form ref={formRef} action={jalankan}>
      <input name="nama" placeholder="Nama produk" defaultValue={nilai("nama")} required />
      <input name="harga" type="number" min="0" placeholder="Harga" defaultValue={nilai("harga")} required />
      <textarea name="deskripsi" placeholder="Deskripsi" defaultValue={nilai("deskripsi")} />
      <button type="button" onClick={buatDeskripsi} disabled={sedangAI}>
        {sedangAI ? "Membuat deskripsi..." : "Buat deskripsi dengan AI"}
      </button>
      {pesanAI && <p role="alert">{pesanAI}</p>}
      <input name="foto" placeholder="Alamat foto (URL)" defaultValue={nilai("foto")} />
      {state?.error && <p role="alert">{state.error}</p>}
      <button type="submit" disabled={proses}>
        {proses ? "Menyimpan..." : label}
      </button>
    </form>
  );
}
"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { generateDeskripsiAI } from "@/app/admin/actions";

export default function FormProduk({ produk = {}, labelTombol, action }) {
  const [nama, setNama] = useState(produk.nama || "");
  const [kategori, setKategori] = useState(produk.kategori || "");
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [pesanAI, setPesanAI] = useState("");

  async function handleGenerateAI(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!nama.trim()) {
      setPesanAI("Isi nama produk terlebih dahulu untuk membuat deskripsi AI.");
      return;
    }

    setIsGenerating(true);
    setPesanAI("");

    try {
      const res = await generateDeskripsiAI(nama, kategori);
      if (res?.deskripsi) {
        setDeskripsi(res.deskripsi);
        setPesanAI("Deskripsi berhasil dibuat dengan AI.");
      } else if (res?.error) {
        setPesanAI(res.error);
      }
    } catch (err) {
      setPesanAI("Gagal membuat deskripsi AI: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  }

  const labelDeskripsi = (
    <span className="flex items-center justify-between">
      <span>Deskripsi</span>
      <button
        type="button"
        onClick={handleGenerateAI}
        disabled={isGenerating}
        className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-garis bg-permukaan px-2.5 py-1 text-xs font-semibold text-utama transition-colors hover:bg-garis disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isGenerating ? "Sedang membuat..." : "✨ Generate Deskripsi AI"}
      </button>
    </span>
  );

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      {produk.id && <input type="hidden" name="id" value={produk.id} />}

      <Input
        label="Nama produk"
        name="nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        required
      />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={produk.harga}
        required
      />
      <Input
        label="Kategori"
        name="kategori"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
      />
      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={produk.foto_url}
      />

      <div>
        <Input
          label={labelDeskripsi}
          name="deskripsi"
          textarea
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
        />
        {pesanAI && (
          <p className="mt-1 text-xs text-teks-lembut">
            {pesanAI}
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Tombol type="submit">{labelTombol}</Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}

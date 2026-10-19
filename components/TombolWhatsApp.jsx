"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);
  const [varian, setVarian] = useState("");

  const nomor = (toko.nomorWhatsApp || "").replace(/\D/g, "");
  const totalHarga = formatRupiah(produk.harga * jumlah);
  const varianText = varian.trim() ? ` - Varian: ${varian.trim()}` : "";
  const pesan = `Halo, saya mau pesan ${produk.nama}${varianText} - Jumlah: ${jumlah} (Total: ${totalHarga}).`;
  const href = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Pemilih Jumlah */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-teks-lembut">Jumlah</span>
          <div className="inline-flex items-center rounded-lg border border-garis bg-latar">
            <button
              type="button"
              onClick={() => setJumlah((prev) => Math.max(1, prev - 1))}
              disabled={jumlah <= 1}
              className="flex h-9 w-9 items-center justify-center font-bold text-teks transition-colors hover:bg-permukaan disabled:opacity-40"
              aria-label="Kurangi jumlah"
            >
              −
            </button>
            <span className="w-10 text-center text-sm font-semibold">{jumlah}</span>
            <button
              type="button"
              onClick={() => setJumlah((prev) => prev + 1)}
              className="flex h-9 w-9 items-center justify-center font-bold text-teks transition-colors hover:bg-permukaan"
              aria-label="Tambah jumlah"
            >
              +
            </button>
          </div>
        </div>

        {/* Pemilih Varian Opsional */}
        <div className="flex flex-1 flex-col gap-1.5 min-w-[150px]">
          <span className="text-xs font-semibold text-teks-lembut">Pilihan varian (opsional)</span>
          <input
            type="text"
            value={varian}
            onChange={(e) => setVarian(e.target.value)}
            placeholder="Misal: Pedas / Manis / Original"
            className="rounded-lg border border-garis bg-latar px-3 py-1.5 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
        </div>
      </div>

      {/* Subtotal */}
      <div className="flex items-center justify-between rounded-lg border border-garis bg-permukaan px-3 py-2 text-sm">
        <span className="text-teks-lembut">Estimasi Total:</span>
        <span className="font-bold text-harga">{totalHarga}</span>
      </div>

      {/* Tombol Pesan via WhatsApp */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white transition-colors hover:bg-utama-gelap sm:w-auto"
      >
        Pesan via WhatsApp
      </a>
    </div>
  );
}

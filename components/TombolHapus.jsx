"use client";

export default function TombolHapus({ aksi, nama }) {
  return (
    <form
      action={aksi}
      onSubmit={(e) => {
        if (!confirm(`Hapus produk "${nama}"?`)) e.preventDefault();
      }}
    >
      <button type="submit">Hapus</button>
    </form>
  );
}
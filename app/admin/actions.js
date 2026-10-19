"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAuth } from "@/lib/supabase/auth";
import { supabaseServer } from "@/lib/supabase/server";

async function wajibLogin() {
  const supabase = await supabaseAuth();
  const { data } = await supabase.auth.getUser();
  if (!data?.user) redirect("/admin/login");
}

function bacaProduk(formData) {
  const nama = String(formData.get("nama") ?? "").trim();
  const hargaMentah = String(formData.get("harga") ?? "").trim();
  const deskripsi = String(formData.get("deskripsi") ?? "").trim();
  const foto = String(formData.get("foto") ?? "").trim();
  const nilai = { nama, harga: hargaMentah, deskripsi, foto };

  if (!nama) return { error: "Nama produk wajib diisi.", nilai };
  const harga = Number(hargaMentah);
  if (hargaMentah === "" || !Number.isFinite(harga) || harga < 0) {
    return { error: "Harga harus berupa angka 0 atau lebih.", nilai };
  }
  return { data: { nama, harga, deskripsi, foto } };
}

export async function tambahProduk(_stateSebelumnya, formData) {
  await wajibLogin();
  const hasil = bacaProduk(formData);
  if (hasil.error) return hasil;

  const { error } = await supabaseServer().from("produk").insert(hasil.data);
  if (error) return { error: "Gagal menyimpan: " + error.message, nilai: hasil.data };

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function ubahProduk(id, _stateSebelumnya, formData) {
  await wajibLogin();
  const hasil = bacaProduk(formData);
  if (hasil.error) return hasil;

  const { error } = await supabaseServer().from("produk").update(hasil.data).eq("id", id);
  if (error) return { error: "Gagal menyimpan: " + error.message, nilai: hasil.data };

  revalidatePath("/");
  revalidatePath(`/produk/${id}`);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function hapusProduk(id) {
  await wajibLogin();
  const { error } = await supabaseServer().from("produk").delete().eq("id", id);
  if (error) throw new Error("Gagal menghapus: " + error.message);

  revalidatePath("/");
  revalidatePath("/admin");
}
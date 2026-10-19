"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function login(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    redirect(
      `/admin/login?error=${encodeURIComponent("Email dan password wajib diisi.")}`
    );
  }

  let signInError = null;

  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(email).trim(),
      password: String(password),
    });

    if (error) {
      signInError = error;
    }
  } catch (err) {
    signInError = err;
  }

  if (signInError) {
    redirect(
      `/admin/login?error=${encodeURIComponent(
        "Email atau password salah."
      )}&email=${encodeURIComponent(String(email).trim())}`
    );
  }

  redirect("/admin");
}

export async function keluar() {
  try {
    const supabase = await createAdminClient();
    await supabase.auth.signOut();
  } catch {
    // Abaikan error jika sesi sudah berakhir
  }

  redirect("/admin/login");
}

export async function gantiPassword(formData) {
  const passwordBaru = formData.get("password_baru");
  const konfirmasiPassword = formData.get("konfirmasi_password");

  if (!passwordBaru || passwordBaru.length < 8) {
    redirect(
      `/admin/password?error=${encodeURIComponent(
        "Password baru minimal 8 karakter."
      )}`
    );
  }

  if (passwordBaru !== konfirmasiPassword) {
    redirect(
      `/admin/password?error=${encodeURIComponent(
        "Konfirmasi password tidak sama."
      )}`
    );
  }

  const supabase = await createAdminClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  const { error } = await supabase.auth.updateUser({
    password: String(passwordBaru),
  });

  if (error) {
    redirect(
      `/admin/password?error=${encodeURIComponent(
        `Gagal mengganti password: ${error.message}`
      )}`
    );
  }

  redirect(
    `/admin/password?sukses=${encodeURIComponent(
      "Password berhasil diganti."
    )}`
  );
}

export async function tambahProduk(formData) {
  const supabase = await createAdminClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  const nama = formData.get("nama");
  const harga = formData.get("harga");
  const kategori = formData.get("kategori");
  const foto_url = formData.get("foto_url");
  const deskripsi = formData.get("deskripsi");

  if (!nama || !harga || isNaN(harga) || Number(harga) < 0) {
    redirect(
      `/admin/produk/baru?error=${encodeURIComponent(
        "Nama dan harga (>= 0) wajib diisi dengan benar."
      )}`
    );
  }

  const { error } = await supabase.from("produk").insert({
    nama: String(nama).trim(),
    harga: parseInt(harga, 10),
    kategori: kategori ? String(kategori).trim() : null,
    foto_url: foto_url ? String(foto_url).trim() : null,
    deskripsi: deskripsi ? String(deskripsi).trim() : null,
  });

  if (error) {
    redirect(
      `/admin/produk/baru?error=${encodeURIComponent(
        `Gagal menambah produk: ${error.message}`
      )}`
    );
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect(
    `/admin?sukses=${encodeURIComponent(
      `Produk "${String(nama).trim()}" berhasil ditambahkan.`
    )}`
  );
}

export async function ubahProduk(formData) {
  const supabase = await createAdminClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  const id = formData.get("id");
  const nama = formData.get("nama");
  const harga = formData.get("harga");
  const kategori = formData.get("kategori");
  const foto_url = formData.get("foto_url");
  const deskripsi = formData.get("deskripsi");

  if (!id || !nama || !harga || isNaN(harga) || Number(harga) < 0) {
    redirect(
      `/admin/produk/${id}/ubah?error=${encodeURIComponent(
        "Nama dan harga (>= 0) wajib diisi dengan benar."
      )}`
    );
  }

  const { error } = await supabase
    .from("produk")
    .update({
      nama: String(nama).trim(),
      harga: parseInt(harga, 10),
      kategori: kategori ? String(kategori).trim() : null,
      foto_url: foto_url ? String(foto_url).trim() : null,
      deskripsi: deskripsi ? String(deskripsi).trim() : null,
    })
    .eq("id", id);

  if (error) {
    redirect(
      `/admin/produk/${id}/ubah?error=${encodeURIComponent(
        `Gagal mengubah produk: ${error.message}`
      )}`
    );
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/produk/${id}`);
  redirect(
    `/admin?sukses=${encodeURIComponent(
      `Produk "${String(nama).trim()}" berhasil diperbarui.`
    )}`
  );
}

export async function hapusProduk(formData) {
  const supabase = await createAdminClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  const id = formData.get("id");
  if (!id) {
    redirect(`/admin?error=${encodeURIComponent("ID produk tidak valid.")}`);
  }

  const { error } = await supabase.from("produk").delete().eq("id", id);

  if (error) {
    redirect(
      `/admin?error=${encodeURIComponent(
        `Gagal menghapus produk: ${error.message}`
      )}`
    );
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect(
    `/admin?sukses=${encodeURIComponent("Produk berhasil dihapus.")}`
  );
}

export async function generateDeskripsiAI(nama, kategori) {
  const supabase = await createAdminClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Harus login sebagai admin." };
  }

  if (!nama) {
    return { error: "Nama produk harus diisi terlebih dahulu." };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const prompt = `Buatkan deskripsi produk yang menarik, singkat, dan menjual dalam 2-3 kalimat untuk produk UMKM berikut:
Nama: ${nama}
Kategori: ${kategori || "Umum"}
Balas HANYA dengan teks deskripsi produk tanpa tanda kutip, tanpa kata pengantar, dan tanpa penutup.`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (text) {
        return { deskripsi: text };
      }
    } catch (err) {
      console.error("Gemini API error:", err);
    }
  }

  const fallbackDeskripsi = `${nama} merupakan produk pilihan berkualitas dalam kategori ${kategori || "unggulan"}. Dibuat dengan bahan terbaik dan cita rasa khas yang higienis, sangat cocok untuk dinikmati bersama keluarga maupun dijadikan buah tangan.`;

  return { deskripsi: fallbackDeskripsi };
}

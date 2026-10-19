"use server";

import { redirect } from "next/navigation";
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



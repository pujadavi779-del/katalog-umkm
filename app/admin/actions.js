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


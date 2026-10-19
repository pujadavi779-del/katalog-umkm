import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getCleanUrl(url) {
  if (!url) return "";
  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

export async function createAdminClient() {
  const cookieStore = await cookies();
  const supabaseUrl = getCleanUrl(process.env.SUPABASE_URL);
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY harus diatur di environment variable."
    );
  }

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Mengabaikan jika dipanggil pada konteks yang tidak mengizinkan penulisan cookie
        }
      },
    },
  });
}


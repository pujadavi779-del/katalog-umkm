import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

function getCleanUrl(url) {
  if (!url) return "";
  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

export async function proxy(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = getCleanUrl(process.env.SUPABASE_URL);
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const cleanPath = pathname.replace(/\/$/, "");

  // Proteksi semua rute /admin kecuali /admin/login
  if (cleanPath.startsWith("/admin") && cleanPath !== "/admin/login") {
    if (!user) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};


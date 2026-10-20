import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// US-06: proteksi semua halaman /admin kecuali /admin/login.
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Halaman login boleh dibuka siapa saja.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Untuk semua halaman /admin lainnya, periksa sesi.
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};

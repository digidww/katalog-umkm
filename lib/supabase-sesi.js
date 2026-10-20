import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Buat Supabase client berbasis sesi (cookie) untuk admin.
 * Dipakai di Server Component, Server Action, dan proxy.js.
 * Jangan import dari file yang memakai "use client".
 */
export async function buatSupabaseSesi() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    {
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
            // Diabaikan jika dipanggil dari Server Component (tidak bisa set cookie).
          }
        },
      },
    }
  );
}

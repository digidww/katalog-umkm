"use server";

import { redirect } from "next/navigation";
import { buatSupabaseSesi } from "@/lib/supabase-sesi";

// US-04: Login admin dengan email dan password.
export async function loginAdmin(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const supabase = await buatSupabaseSesi();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(
      "/admin/login?error=" + encodeURIComponent("Email atau password salah.")
    );
  }

  redirect("/admin");
}

// US-04: Keluar dari sesi admin.
export async function keluarAdmin() {
  const supabase = await buatSupabaseSesi();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// US-05: Ganti password admin yang sedang login.
export async function gantiPasswordAdmin(formData) {
  const passwordBaru = formData.get("password_baru");
  const konfirmasi = formData.get("konfirmasi_password");

  if (passwordBaru !== konfirmasi) {
    redirect(
      "/admin/password?error=" +
        encodeURIComponent("Password baru dan konfirmasinya tidak cocok.")
    );
  }

  if (passwordBaru.length < 8) {
    redirect(
      "/admin/password?error=" +
        encodeURIComponent("Password minimal 8 karakter.")
    );
  }

  const supabase = await buatSupabaseSesi();

  // Pastikan admin sudah login sebelum mengubah data.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }

  const { error } = await supabase.auth.updateUser({ password: passwordBaru });

  if (error) {
    redirect(
      "/admin/password?error=" + encodeURIComponent(error.message)
    );
  }

  redirect("/admin/password?sukses=1");
}

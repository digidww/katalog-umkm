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

// US-08: Tambah produk baru oleh admin terautentikasi.
export async function tambahProdukAdmin(formData) {
  const supabase = await buatSupabaseSesi();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const nama = formData.get("nama")?.toString().trim();
  const harga = parseInt(formData.get("harga"), 10) || 0;
  const kategori = formData.get("kategori")?.toString().trim() || "Cookies";
  const foto_url =
    formData.get("foto_url")?.toString().trim() || "/produk/nastar.svg";
  const deskripsi = formData.get("deskripsi")?.toString().trim() || "";

  if (!nama) {
    throw new Error("Nama produk wajib diisi.");
  }

  const { error } = await supabase.from("produk").insert({
    nama,
    harga,
    kategori,
    foto_url,
    deskripsi,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin");
}

// US-09: Ubah produk oleh admin terautentikasi.
export async function ubahProdukAdmin(formData) {
  const supabase = await buatSupabaseSesi();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const id = formData.get("id");
  const nama = formData.get("nama")?.toString().trim();
  const harga = parseInt(formData.get("harga"), 10) || 0;
  const kategori = formData.get("kategori")?.toString().trim() || "Cookies";
  const foto_url =
    formData.get("foto_url")?.toString().trim() || "/produk/nastar.svg";
  const deskripsi = formData.get("deskripsi")?.toString().trim() || "";

  if (!id || !nama) {
    throw new Error("ID dan Nama produk wajib diisi.");
  }

  const { error } = await supabase
    .from("produk")
    .update({
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin");
}

// US-10: Hapus produk oleh admin terautentikasi.
export async function hapusProdukAdmin(formData) {
  const supabase = await buatSupabaseSesi();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const id = formData.get("id");
  if (!id) {
    throw new Error("ID produk tidak valid.");
  }

  const { error } = await supabase.from("produk").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin");
}




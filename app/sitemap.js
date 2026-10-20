import { buatSupabaseServer } from "@/lib/supabase";

// US-27: sitemap.xml dibuat dari database dan memuat halaman beranda serta produk.
export default async function sitemap() {
  const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

  let daftarProduk = [];
  try {
    const supabase = buatSupabaseServer();
    const { data } = await supabase.from("produk").select("id, created_at");
    daftarProduk = data ?? [];
  } catch {
    daftarProduk = [];
  }

  const ruteProduk = daftarProduk.map((p) => ({
    url: `${baseUrl}/produk/${p.id}`,
    lastModified: p.created_at ? new Date(p.created_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...ruteProduk,
  ];
}

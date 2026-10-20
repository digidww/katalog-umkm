import Link from "next/link";
import { notFound } from "next/navigation";
import KartuProduk from "@/components/KartuProduk";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import TombolBagikan from "@/components/TombolBagikan";
import { buatSupabaseServer } from "@/lib/supabase";
import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";

// US-26: Metadata SEO dan Open Graph dinamis sesuai produk
export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const supabase = buatSupabaseServer();
    const { data: produk } = await supabase
      .from("produk")
      .select("nama, deskripsi, foto_url")
      .eq("id", id)
      .single();

    if (!produk) return { title: "Produk Tidak Ditemukan" };

    return {
      title: `${produk.nama} | ${toko.nama}`,
      description: produk.deskripsi || `${produk.nama} dari ${toko.nama}`,
      openGraph: {
        title: produk.nama,
        description: produk.deskripsi || "",
        images: [
          {
            url: produk.foto_url,
            alt: produk.nama,
          },
        ],
      },
    };
  } catch {
    return { title: `Produk | ${toko.nama}` };
  }
}

// US-02: data diambil dari tabel "produk" di Supabase berdasarkan id, di sisi server.
export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;

  const supabase = buatSupabaseServer();
  const { data: produk, error } = await supabase
    .from("produk")
    .select("id, nama, harga, deskripsi, foto_url, kategori")
    .eq("id", id)
    .single();

  if (error || !produk) {
    notFound();
  }

  // US-17: Produk terkait dari kategori yang sama
  const { data: produkTerkaitData } = await supabase
    .from("produk")
    .select("id, nama, harga, foto_url, kategori")
    .eq("kategori", produk.kategori)
    .neq("id", id)
    .limit(3);
  const produkTerkait = produkTerkaitData ?? [];

  return (
    <>
      <article className="grid gap-8 py-8 md:grid-cols-2 md:py-12">
        <img
          src={produk.foto_url}
          alt={produk.nama}
          className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover"
        />
        <div className="flex flex-col gap-4">
          <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
            Kembali ke katalog
          </Link>
          <p className="text-sm text-teks-lembut">{produk.kategori}</p>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{produk.nama}</h1>
          <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-xl font-bold text-harga">
            {formatRupiah(produk.harga)}
          </p>
          <p className="max-w-prose leading-relaxed text-teks-lembut">{produk.deskripsi}</p>
          <div className="flex flex-wrap items-center gap-3">
            <TombolWhatsApp produk={produk} />
            <TombolBagikan nama={produk.nama} />
          </div>
        </div>
      </article>

      {produkTerkait.length > 0 && (
        <section aria-labelledby="judul-terkait" className="border-t border-garis py-8">
          <h2 id="judul-terkait" className="mb-4 text-xl font-bold">
            Produk terkait
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {produkTerkait.map((item) => (
              <KartuProduk key={item.id} produk={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

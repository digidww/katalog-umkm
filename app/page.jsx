import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import { buatSupabaseServer } from "@/lib/supabase";
import { toko } from "@/lib/toko";

// US-01, US-11 (filter & search), US-15 (urutkan)
export default async function HalamanKatalog({ searchParams }) {
  const { cari = "", kategori = "", urut = "terbaru" } =
    (await searchParams) ?? {};

  let daftarProduk = [];
  let daftarKategori = [];
  let pesanError = null;

  try {
    const supabase = buatSupabaseServer();

    // Ambil daftar kategori unik dari tabel produk
    const { data: dataKategori } = await supabase
      .from("produk")
      .select("kategori");
    daftarKategori = Array.from(
      new Set((dataKategori ?? []).map((p) => p.kategori).filter(Boolean))
    );

    // Bangun query sesuai filter pencarian, kategori, dan pengurutan
    let query = supabase
      .from("produk")
      .select("id, nama, harga, foto_url, kategori");

    if (cari) {
      query = query.ilike("nama", `%${cari}%`);
    }

    if (kategori && kategori !== "semua") {
      query = query.eq("kategori", kategori);
    }

    if (urut === "termurah") {
      query = query.order("harga", { ascending: true });
    } else if (urut === "termahal") {
      query = query.order("harga", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      pesanError = error.message;
    } else {
      daftarProduk = data ?? [];
    }
  } catch (err) {
    pesanError = err.message;
  }

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="judul-produk" className="text-xl font-bold">
            Produk kami
          </h2>

          {/* Form Pencarian & Urutan (US-11 & US-15) */}
          <form method="GET" action="/" className="flex flex-wrap items-center gap-2">
            {kategori && kategori !== "semua" && (
              <input type="hidden" name="kategori" value={kategori} />
            )}
            <input
              type="search"
              name="cari"
              defaultValue={cari}
              placeholder="Cari cookies..."
              className="rounded-lg border border-garis bg-latar px-3 py-1.5 text-sm outline-none focus:border-utama"
            />
            <select
              name="urut"
              defaultValue={urut}
              className="rounded-lg border border-garis bg-latar px-2.5 py-1.5 text-sm outline-none focus:border-utama text-teks-lembut"
            >
              <option value="terbaru">Terbaru</option>
              <option value="termurah">Termurah</option>
              <option value="termahal">Termahal</option>
            </select>
            <button
              type="submit"
              className="rounded-lg bg-utama px-3 py-1.5 text-sm font-semibold text-white hover:bg-utama-gelap"
            >
              Cari
            </button>
            {(cari || (kategori && kategori !== "semua") || urut !== "terbaru") && (
              <Link
                href="/"
                className="text-xs text-teks-lembut underline hover:text-bahaya"
              >
                Reset
              </Link>
            )}
          </form>
        </div>

        {/* Filter Kategori (US-11) */}
        {daftarKategori.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/?${new URLSearchParams({
                ...(cari ? { cari } : {}),
                ...(urut !== "terbaru" ? { urut } : {}),
              }).toString()}`}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                !kategori || kategori === "semua"
                  ? "bg-utama text-white"
                  : "border border-garis bg-latar text-teks-lembut hover:border-utama"
              }`}
            >
              Semua
            </Link>
            {daftarKategori.map((kat) => {
              const aktif = kategori === kat;
              const params = new URLSearchParams({
                kategori: kat,
                ...(cari ? { cari } : {}),
                ...(urut !== "terbaru" ? { urut } : {}),
              });
              return (
                <Link
                  key={kat}
                  href={`/?${params.toString()}`}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                    aktif
                      ? "bg-utama text-white"
                      : "border border-garis bg-latar text-teks-lembut hover:border-utama"
                  }`}
                >
                  {kat}
                </Link>
              );
            })}
          </div>
        )}

        {pesanError ? (
          <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            Gagal memuat produk: {pesanError}
          </p>
        ) : daftarProduk.length === 0 ? (
          <p className="py-8 text-center text-teks-lembut">
            Tidak ada produk yang cocok dengan pencarian atau filter Anda.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

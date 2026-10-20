import Link from "next/link";
import { toko } from "@/lib/toko";

// US-22: Halaman Tentang dan kontak toko
export const metadata = {
  title: `Tentang Kami | ${toko.nama}`,
  description: `Profil dan kontak resmi ${toko.nama}`,
};

export default function HalamanTentang() {
  return (
    <div className="mx-auto max-w-2xl py-12 flex flex-col gap-6">
      <Link href="/" className="text-sm text-teks-lembut underline hover:text-utama self-start">
        ← Kembali ke katalog
      </Link>
      <h1 className="text-3xl font-extrabold">{toko.nama}</h1>
      <p className="text-lg text-teks-lembut leading-relaxed">{toko.tagline}</p>
      
      <div className="rounded-2xl border border-garis bg-latar p-6 flex flex-col gap-4">
        <h2 className="text-lg font-bold">Informasi Kontak & Toko</h2>
        <div>
          <p className="text-xs text-teks-lembut">Alamat</p>
          <p className="font-medium text-teks">{toko.alamat}</p>
        </div>
        <div>
          <p className="text-xs text-teks-lembut">Jam Buka</p>
          <p className="font-medium text-teks">{toko.jamBuka}</p>
        </div>
        <div>
          <p className="text-xs text-teks-lembut">WhatsApp</p>
          <a
            href={`https://wa.me/${toko.nomorWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-utama hover:underline"
          >
            +{toko.nomorWhatsApp}
          </a>
        </div>
      </div>
    </div>
  );
}

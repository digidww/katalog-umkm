# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
Halaman katalog di app/page.jsx berhasil mengambil 6 produk dari tabel `produk` di Supabase secara server-side dan menampilkannya dengan KartuProduk.

**Perbaikan:**
Memperbaiki SUPABASE_URL di .env.local agar tidak menyertakan path ekstra `/rest/v1/` yang menyebabkan `fetch failed`.

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
Halaman detail produk di app/produk/[id]/page.jsx mengambil produk secara server-side dari Supabase berdasarkan params.id, memanggil notFound() jika produk tidak ditemukan, dan menampilkan informasi produk lengkap.

**Perbaikan:**
Tidak ada error, berfungsi sesuai rancangan.

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
Tombol WhatsApp mengarahkan ke link https://wa.me/nomor dengan format pesan otomatis nama produk dan harga rupiah yang di-encode dengan encodeURIComponent, serta target="_blank".

**Perbaikan:**
Format nomor WhatsApp di lib/toko.js dipastikan diawali 62 tanpa tanda + atau 0.

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
Server Action loginAdmin dan keluarAdmin dibuat di app/admin/actions.js memakai createServerClient dari @supabase/ssr. NavAdmin memiliki tombol keluar. Form login menampilkan pesan error jika autentikasi gagal.

**Perbaikan:**
Memastikan cookies di Next.js 16 di-await dengan `await cookies()`.

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
Server Action gantiPasswordAdmin di app/admin/actions.js memvalidasi kecocokan password, panjang minimal 8 karakter, memeriksa sesi admin aktif, dan melakukan updateUser({ password }).

**Perbaikan:**
Menambahkan pesan konfirmasi sukses atau error yang jelas pada halaman /admin/password.

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
File proxy.js di root proyek memvalidasi sesi cookie admin untuk semua matcher `/admin/:path*` kecuali `/admin/login`. CatatanBelumAktif dihapus dari app/admin/page.jsx.

**Perbaikan:**
Menggunakan konvensi Next.js 16 export named `proxy` di proxy.js dan menghapus file middleware lama agar tidak konflik.

## US-07 List Produk

**Prompt:**
[SENDIRI] Baca docs/user-stories.md bagian US-07. Ubah app/admin/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, bukan data contoh.

**Hasil:**
Daftar produk di halaman /admin kini mengambil data produk dari Supabase secara dinamis dan menampilkannya pada TabelProduk.

**Perbaikan:**
Menambahkan penanganan jika tabel kosong atau gagal mengambil data.

## US-08 Tambah produk

**Prompt:**
[SENDIRI] Baca docs/user-stories.md bagian US-08. Buat Server Action tambahProdukAdmin di app/admin/actions.js yang menyimpan produk baru ke database Supabase dan dialihkan kembali ke /admin. Lindungi aksinya dengan autentikasi admin di server. Sambungkan ke form di app/admin/produk/baru/page.jsx dan hapus CatatanBelumAktif.

**Hasil:**
Form di /admin/produk/baru menyimpan data produk baru ke tabel `produk` di Supabase, divalidasi login server-side, dan setelah simpan kembali ke /admin.

**Perbaikan:**
Memberikan nilai default kategori dan foto_url jika kosong.

## US-09 Ubah produk

**Prompt:**
[SENDIRI] Baca docs/user-stories.md bagian US-09. Ubah app/admin/produk/[id]/ubah/page.jsx supaya mengambil data lama dari Supabase berdasarkan id. Buat Server Action ubahProdukAdmin di app/admin/actions.js yang memperbarui produk di database dan dialihkan kembali ke /admin. Lindungi aksinya dengan autentikasi admin di server. Hapus CatatanBelumAktif.

**Hasil:**
Form di /admin/produk/[id]/ubah terisi dengan data lama produk dari Supabase, dan jika disimpan akan memperbarui tabel produk di Supabase secara terotentikasi lalu kembali ke /admin.

**Perbaikan:**
Menambahkan input hidden `id` pada FormProduk.

## US-10 Hapus produk

**Prompt:**
[SENDIRI] Baca docs/user-stories.md bagian US-10. Buat Server Action hapusProdukAdmin di app/admin/actions.js yang menghapus produk dari database Supabase dan dialihkan ke /admin, dengan proteksi autentikasi di server. Buat komponen TombolHapus dengan dialog konfirmasi sebelum menghapus, dan hubungkan di TabelProduk.

**Hasil:**
Tombol Hapus pada tabel produk memunculkan prompt konfirmasi browser (`confirm`). Jika disetujui, produk terhapus dari Supabase dan halaman /admin diperbarui.

**Perbaikan:**
Membuat komponen client terpisah TombolHapus agar konfirmasi interaktif berjalan tanpa mengorbankan keamanan Server Action.

## US-11 Filter Kategori & Pencarian

**Prompt:**
[SENDIRI] Baca docs/user-stories.md bagian US-11. Buat fitur pencarian nama produk dan filter kategori dinamis dari database di app/page.jsx via searchParams.

**Hasil:**
Pengunjung dapat mencari nama cookies dan menyaring berdasarkan kategori tombol pilihan dengan query ilike dan filter Supabase.

## US-15 Urutkan Produk

**Prompt:**
[SENDIRI] Baca docs/user-stories.md bagian US-15. Tambahkan pilihan urutan (terbaru, termurah, termahal) yang dieksekusi langsung di query database Supabase.

**Hasil:**
Dropdown pengurutan langsung mengurutkan data dari sisi database (order asc/desc pada kolom harga dan created_at).

## US-17 Produk Terkait

**Prompt:**
[SENDIRI] Baca docs/user-stories.md bagian US-17. Tampilkan produk terkait dari kategori yang sama pada halaman detail produk tanpa menyertakan produk yang sedang dibuka.

**Hasil:**
Bagian 'Produk terkait' tampil rapi di bawah detail produk mengambil 3 produk serupa dari kategori yang sama.

## US-22 Halaman Tentang dan Kontak Toko

**Prompt:**
[SENDIRI] Baca docs/user-stories.md bagian US-22. Buat halaman /tentang berisi profil toko cookies, alamat, jam buka, dan kontak WhatsApp, serta tautkan di Header dan Footer.

**Hasil:**
Halaman /tentang berhasil dibuat dan ditautkan di Header serta Footer.

## US-23 Bagikan dan Salin Link Produk

**Prompt:**
[SENDIRI] Baca docs/user-stories.md bagian US-23. Buat tombol bagikan produk menggunakan Web Share API dan fallback salin link clipboard dengan notifikasi umpan balik 'Link tersalin!'.

**Hasil:**
Komponen TombolBagikan menampilkan opsi share native di HP atau menyalin link ke clipboard di laptop dengan pesan feedback.

## US-26 Metadata SEO dan Open Graph

**Prompt:**
[SENDIRI] Baca docs/user-stories.md bagian US-26. Tambahkan generateMetadata pada app/produk/[id]/page.jsx untuk judul, deskripsi, dan Open Graph image produk.

**Hasil:**
Setiap halaman produk memiliki metadata dinamis dan Open Graph card untuk media sosial.

## US-27 Sitemap dan Robots.txt

**Prompt:**
[SENDIRI] Baca docs/user-stories.md bagian US-27 dan K-8. Buat sitemap.xml dinamis dari database Supabase dan robots.txt yang valid serta memblokir indexing pada rute /admin.

**Hasil:**
app/sitemap.js dan app/robots.js menghasilkan endpoint XML dan TXT yang valid dan dinamis.

## US-28 Halaman 404 dan Skeleton Loading

**Prompt:**
[SENDIRI] Baca docs/user-stories.md bagian US-28. Sediakan halaman 404 kustom dan loading.jsx dengan animasi skeleton saat data diambil.

**Hasil:**
not-found.jsx dan loading.jsx siap memberikan visual loading yang halus dan navigasi saat rute salah.

## Keamanan Lanjutan (K-6 s/d K-13)

**Implementasi:**
- **K-6 & K-11**: Menambahkan security headers lengkap (X-Frame-Options: DENY, nosniff, strict-origin-when-cross-origin, Permissions-Policy, HSTS, dan Content-Security-Policy ketat) di next.config.mjs.
- **K-7**: Memastikan 0 penggunaan dangerouslySetInnerHTML atau eval berbahaya.
- **K-8**: Rute /admin dilarang di-crawl pada robots.txt.
- **K-9**: Pesan error ramah pengguna tanpa kebocoran stack trace database.
- **K-10**: npm audit bersih dengan 0 vulnerabilities.
- **K-13**: Bebas dari console.log data sensitif atau kredensial.





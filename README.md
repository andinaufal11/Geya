# Geya Nawasena Nunukan

Website React + Vite untuk informasi bimbel persiapan Kedinasan, TNI, dan Polri. Domain aktif: https://geya.vercel.app/.

## Menjalankan dan deploy

- `npm install`
- `npm run dev` untuk pengembangan.
- `npm run build` membuat HTML siap dibaca mesin pencari di `dist/`, kemudian interaksi React diaktifkan melalui hydration.
- `npm run test:seo` memeriksa HTML hasil build, metadata, aset, data terstruktur, dan konsistensi sitemap.
- `npm run preview` untuk meninjau hasil produksi.
- Hosting memakai build command `npm run build` dan output directory `dist`. Jangan menggantinya dengan `vite build` langsung karena akan melewati prerender dan generator SEO.

## Pengaturan SEO

Default domain produksi di `scripts/seo-config.mjs` sudah mengarah ke https://geya.vercel.app/. Jika memakai domain sendiri, atur environment variable `SITE_URL=https://domain-utama` di hosting dan build ulang. Lihat `.env.example`. Canonical, Open Graph, sitemap, robots.txt dan URL data terstruktur dibuat dari sumber yang sama. Hanya URL halaman utama dimasukkan sitemap; anchor seperti `#program` bukan halaman terpisah.

Judul dan deskripsi produksi dikelola di `scripts/seo-config.mjs` dan otomatis diterapkan saat build. `index.html` menyertakan nilai awal untuk mode pengembangan. Data terstruktur memakai EducationalOrganization, WebSite, dan WebPage. Alamat detail hanya ditambahkan jika `contact.address` sudah diisi. Tidak ada rating, harga, jam operasional atau jaminan kelulusan yang dibuat-buat. Jadwal kelas tidak diperlakukan sebagai jam buka kantor. Foto ilustrasi tidak diperlakukan sebagai dokumentasi bisnis.

Setelah deploy:

1. Verifikasi kepemilikan domain di Google Search Console dan Bing Webmaster Tools melalui akun pemilik.
2. Kirim URL `https://geya.vercel.app/sitemap.xml` (sesuaikan jika domain berubah).
3. Periksa URL utama melalui URL Inspection, lalu ajukan pengindeksan jika diperlukan.
4. Lengkapi Google Business Profile cabang Nunukan dengan data nyata dan konsisten.
5. Jika mengganti domain, arahkan domain lama ke domain utama dengan redirect permanen di hosting.

Verifikasi akun dan pengajuan pengindeksan tidak dilakukan oleh kode website. SEO tidak menjamin posisi pertama atau waktu pengindeksan. Halaman yang belum ada tidak ditambahkan ke sitemap. Tidak ada meta keywords atau schema FAQ untuk menjanjikan rich result.

## Konten bisnis

Edit `src/content.js` untuk program, FAQ, jadwal AK8, nomor WhatsApp format internasional, alamat, dan URL Maps. WhatsApp sudah diisi. Lengkapi alamat, lokasi Maps, biaya, alur pendaftaran dan rincian program dengan informasi resmi sebelum publikasi penuh. Jangan menaruh password atau API key di kode frontend.

Logo: `public/assets/logo.jpeg`. Poster jadwal: `assets/jadwal.jpeg`, dibuka melalui popup. Foto dokumentasi bisa ditambahkan ke `assets/galeri/` dengan nama deskriptif. Jika belum ada, carousel memakai foto ilustrasi Indonesia dari URL di `src/galleryPhotos.js`, dengan label dan kredit sumber. Foto luar memerlukan koneksi ke penyedia gambar.

Chat di `src/ChatDemo.jsx` adalah demo lokal tanpa API AI. Jawaban contoh di `src/chatDemo.js` memakai informasi program dan jadwal yang sama; informasi yang belum tersedia diarahkan ke admin WhatsApp. Percakapan tidak disimpan ke server.
## Tema tampilan

Switch ikon bulan/matahari di header mengubah mode terang dan gelap. Pada kunjungan pertama, tema mengikuti perangkat. Pilihan manual disimpan di localStorage dengan key geya-theme dan disinkronkan antar-tab. Hapus key tersebut untuk kembali mengikuti perangkat. Skrip public/theme-init.js menerapkan tema sebelum halaman tampil; src/theme.css mengatur palet kedua mode.

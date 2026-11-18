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

## Automation testing

- `npm test`: build produksi, 6 pemeriksaan SEO, lalu 54 browser tests (18 alur pada desktop 1440px, HP 390px, dan HP kecil 320px).
- `npm run test:e2e`: ulangi tes browser terhadap build `dist` yang sudah dibuat.
- `npx playwright show-report`: buka laporan HTML setelah tes.
- Windows memakai Microsoft Edge yang terpasang. Linux/CI memakai Chromium; jalankan `npx playwright install --with-deps chromium` saat menyiapkan environment Linux.

Suite mencakup navigasi, program, jadwal dan hari kosong, FAQ, popup dan fokus keyboard, demo chat, batas input, teks markup, carousel otomatis/manual, reduced motion, penyimpanan tema, sinkronisasi tab, perubahan tema perangkat, storage diblokir, layout kedua tema, dan tujuan tautan WhatsApp. Tes tidak mengirim pesan ke WhatsApp.

Foto Pexels dan font eksternal diganti respons lokal saat tes interaksi agar hasil tidak tergantung jaringan pihak ketiga. Suite ini tidak mengukur kualitas visual foto, Core Web Vitals produksi, peringkat Google, atau kompatibilitas Safari/Firefox. Emulasi HP dijalankan di Chromium/Edge, bukan perangkat fisik. Jika tes gagal, screenshot dan trace disimpan di `test-results/`; hasil tersebut tidak masuk Git.

Workflow `.github/workflows/test.yml` menjalankan suite setelah push ke main dan pada pull request, lalu menyimpan laporan HTML sebagai artifact GitHub Actions selama 14 hari.
Autoplay carousel memakai interval 4,5 detik. Kursor pada area foto dan fokus pada kontrol lain menjeda sementara. Klik Play melanjutkan putaran meskipun fokus tetap di tombol Play. Reduced motion menonaktifkan autoplay awal; pengguna tetap dapat menyalakannya secara manual.

## Lokasi cabang

Bagian `#lokasi` menampilkan Tarakan, Nunukan, dan Tanjung Selor. Kelola `branches` di `src/content.js`: isi `address`, `mapUrl`, dan data `photo` sesuai data resmi. Sementara alamat dan pin belum tersedia, tombol membuka pencarian Google Maps berdasarkan nama Geya dan kotanya; ini bukan pin lokasi terverifikasi. Kontak Nunukan tetap bisa memakai fallback `contact.address` dan `contact.mapUrl` yang sudah ada.

Foto saat ini adalah suasana kota, bukan gedung cabang. File lokal di `public/locations/` tidak masuk carousel kegiatan. Sumber dan lisensi: Tarakan skyline — Sekretariat Kabinet Indonesia (domain publik), Alun-Alun Kota Nunukan dan Taman Tepian Tanjung Selor — Ezagren (CC BY-SA 4.0). Tautan sumber, atribusi, lisensi dan keterangan pemotongan tersedia di kredit foto pada bagian lokasi. Mengganti foto dengan dokumentasi asli cabang dianjurkan saat tersedia. Tidak ada koordinat atau alamat cabang yang dikarang dalam data terstruktur SEO.
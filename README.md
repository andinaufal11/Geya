# Geya Nawasena Nunukan

Website company profile menggunakan React, Vite, CSS responsif, dan ikon Lucide.

## Menjalankan

- `npm install`
- `npm run dev`
- `npm run build` untuk hasil produksi di folder `dist`.

## Mengubah konten

Edit `src/content.js` untuk program, materi, FAQ, alamat, nomor WhatsApp (format internasional tanpa +), serta URL Google Maps. Deskripsi dan materi saat ini merupakan draf yang perlu disetujui pengelola. Jadwal belum diisi karena data resmi belum tersedia. Komponen jadwal ada di `src/main.jsx`.

Logo asli berada di `public/assets/logo.jpeg`. Foto kegiatan atau pengajar belum disertakan karena belum tersedia. Efek mix-blend-mode menyamarkan bidang putih logo secara visual; file logo asli belum dihapus background-nya.

## Pengelolaan admin

Untuk tahap awal, gunakan berkas konten agar sederhana. Belum ada login atau dashboard admin. Jika pembaruan rutin dilakukan staf nonteknis, langkah berikutnya adalah CMS dengan autentikasi dan penyimpanan backend (misalnya Supabase Auth + database dengan Row Level Security). URL tersembunyi saja bukan autentikasi. Jangan menaruh password atau kunci privat dalam source frontend. Perubahan localStorage juga tidak dapat menggantikan CMS karena tidak dibagikan ke pengunjung lain.

## Sebelum publikasi

Lengkapi alamat, titik peta, WhatsApp, jadwal, biaya bila ingin ditampilkan, foto resmi dan deskripsi materi terverifikasi. Saat WhatsApp belum diisi, tombol konsultasi mengarahkan ke keterangan kontak yang belum tersedia. Tidak ada nomor, testimoni, hasil kelulusan atau jadwal fiktif.

## Pembaruan jadwal AK8 dan galeri

Jadwal dalam `src/content.js` kini mengikuti `assets/jadwal.jpeg`: Psiko Kamis 19.30 dan Sabtu 10.00; Matematika Senin/Rabu 19.30; Bahasa Inggris Minggu/Jumat 19.30; Samjas Senin/Rabu/Jumat 16.30. Deskripsi mata pelajaran adalah ringkasan editorial. Waktu ditampilkan dalam WITA untuk Nunukan. Poster asli dapat dibuka dari bagian jadwal.

Tambahkan foto kegiatan asli (JPG, JPEG, PNG, atau WEBP) ke `assets/galeri/`. Galeri otomatis membaca foto saat Vite berjalan atau saat build ulang. Logo dan poster jadwal dikecualikan. Gunakan nama file yang deskriptif, misalnya `latihan-bersama-nunukan.jpg`, karena digunakan sebagai teks alternatif. Dengan dua foto atau lebih, carousel berpindah setiap 4,5 detik. Tersedia tombol navigasi, indikator, dan jeda. Putar otomatis berhenti saat diarahkan mouse atau fokus keyboard dan mengikuti preferensi pengurangan gerak. Tanpa foto, bagian galeri menampilkan pemberitahuan singkat; satu foto ditampilkan tanpa kontrol putar.

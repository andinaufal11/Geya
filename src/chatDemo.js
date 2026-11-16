import {contact,programs,schedule} from './content.js';
export const suggestions=['Program apa saja?','Lihat jadwal kelas','Berapa biaya bimbel?','Bagaimana cara daftar?'];
export function getDemoReply(message){
 const text=message.toLowerCase();
 if(/biaya|harga|bayar|tarif|diskon/.test(text))return 'Informasi biaya dan metode pembayaran belum tersedia di website. Yuk, tanyakan langsung ke admin WhatsApp agar mendapatkan rincian terbaru.';
 if(/jamin|pasti.*(lolos|lulus)|garansi/.test(text))return 'Tidak ada jaminan kelulusan. Geya membantu persiapan belajar; hasil seleksi mengikuti kemampuan peserta dan ketentuan instansi penyelenggara.';
 if(/jadwal|jam|hari|kapan|matematika|inggris|psiko|samjas/.test(text)){
  const filtered=schedule.filter(subject=>text.includes(subject.name.toLowerCase()));
  return 'Berikut jadwal kelas AK8:\n'+(filtered.length?filtered:schedule).map(subject=>subject.name+': '+subject.sessions.map(session=>session.day+' '+session.time).join(', ')+' WITA.').join('\n')+'\nKonfirmasikan perubahan jadwal kepada admin, ya.';
 }
 if(/daftar|gabung|syarat/.test(text))return 'Untuk mulai mendaftar, tentukan tujuan seleksimu: Sekolah Kedinasan, TNI, atau Polri. Siapkan informasi pendidikan terakhir, lalu hubungi admin WhatsApp untuk konfirmasi syarat, biaya, dan ketersediaan kelas.';
 if(/alamat|lokasi|dimana|di mana|cabang/.test(text))return contact.address?'Geya Nunukan berlokasi di '+contact.address:'Website ini berfokus pada cabang Nunukan, Kalimantan Utara. Alamat lengkap dan titik lokasi belum tersedia. Hubungi admin WhatsApp untuk petunjuk lokasi.';
 const program=programs.find(program=>text.includes(program.id)||text.includes(program.name.toLowerCase()));
 if(program)return program.name+': '+program.description+'\nGambaran persiapan: '+program.subjects.join(', ')+'. Rincian materi dan ketersediaan kelas perlu dikonfirmasi kepada admin.';
 if(/program|kelas|bimbel|belajar/.test(text))return 'Geya Nawasena Nunukan memperkenalkan persiapan Sekolah Kedinasan, TNI, dan Polri. Kamu tertarik jalur yang mana? Ketik nama programnya untuk melihat gambaran persiapannya.';
 if(/^(halo|hai|hi|pagi|siang|sore|malam)\b/.test(text))return 'Halo! Mau tahu program persiapan, jadwal kelas AK8, atau cara daftar? Pilih pertanyaan di bawah atau ketik pertanyaanmu.';
 return 'Ini masih demo chat dengan jawaban contoh. Aku bisa membantu soal program, jadwal AK8, lokasi, biaya, dan cara daftar. Untuk pertanyaan lebih lanjut, silakan lanjut ke admin WhatsApp.';
}
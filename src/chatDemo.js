import {describeSubjects} from './learningInfo.js';
import {contact,programs,schedule,branches} from './content.js';
export const suggestions=['Program apa saja?','Lihat jadwal kelas','Berapa biaya bimbel?','Bagaimana cara daftar?'];
export function getDemoReply(message){
 const text=message.toLowerCase();
 const branch=branches.find(branch=>text.includes(branch.name.toLowerCase())||(branch.id==='tanjung-selor'&&text.includes('tanjungselor')));
 if(/biaya|harga|bayar|tarif|diskon/.test(text))return 'Informasi biaya dan metode pembayaran belum tersedia di website. Yuk, tanyakan langsung ke admin WhatsApp agar mendapatkan rincian terbaru.';
 if(/jamin|pasti.*(lolos|lulus)|garansi/.test(text))return 'Tidak ada jaminan kelulusan. Geya membantu persiapan belajar; hasil seleksi mengikuti kemampuan peserta dan ketentuan instansi penyelenggara.';
 if(/pelajaran|materi|mapel|mata\s*pelajaran|dipelajari|diajarkan/.test(text)&&!/jadwal|jam berapa|hari apa|kapan/.test(text)){
  const program=programs.find(p=>text.includes(p.id)||(p.id==='tni'&&/tentara/.test(text))||(p.id==='polri'&&/polisi/.test(text)));
  const subject=schedule.find(item=>text.includes(item.name.toLowerCase()));
  return describeSubjects({programId:program?.id,branchId:branch?.id,subject:subject?.name});
 }
 if(/jadwal|jam|hari|kapan|matematika|inggris|psiko|samjas/.test(text)){
  if(branch&&branch.id!=='nunukan')return 'Jadwal yang dipublikasikan di website ini adalah kelas AK8 cabang Nunukan. Jadwal cabang '+branch.name+' belum tersedia. Hubungi admin untuk konfirmasi kelas dan waktunya.';
  const filtered=schedule.filter(subject=>text.includes(subject.name.toLowerCase()));
  return 'Berikut jadwal kelas AK8 Nunukan:\n'+(filtered.length?filtered:schedule).map(subject=>subject.name+': '+subject.sessions.map(session=>session.day+' '+session.time).join(', ')+' WITA.').join('\n')+'\nKonfirmasikan perubahan jadwal kepada admin, ya.';
 }
 if(/daftar|gabung|syarat/.test(text))return 'Untuk mulai mendaftar, tentukan tujuan seleksimu: Sekolah Kedinasan, TNI, atau Polri. Siapkan informasi pendidikan terakhir, lalu hubungi admin WhatsApp untuk konfirmasi syarat, biaya, dan ketersediaan kelas.';
 if(/alamat|lokasi|dimana|di mana|cabang/.test(text)){
  if(!branch)return 'Geya hadir di Tarakan, Nunukan, dan Tanjung Selor. Lihat bagian Lokasi untuk akses Maps dan kontak admin. Informasi jadwal AK8 di website ini khusus cabang Nunukan.';
  const address=branch.address||(branch.id==='nunukan'?contact.address:'');
  return address?'Alamat cabang '+branch.name+': '+address:'Alamat lengkap dan pin cabang '+branch.name+' belum dikonfirmasi di website. Hubungi admin sebelum berkunjung; Maps di bagian Lokasi sementara membuka pencarian.';
 }
 const program=programs.find(program=>text.includes(program.id)||text.includes(program.name.toLowerCase()));
 if(program)return program.name+': '+program.description+'\nGambaran persiapan: '+program.subjects.join(', ')+'. Rincian materi dan ketersediaan kelas perlu dikonfirmasi kepada admin.';
 if(/program|kelas|bimbel|belajar/.test(text))return 'Geya Nawasena memperkenalkan persiapan Sekolah Kedinasan, TNI, dan Polri. Kamu tertarik jalur yang mana? Ketik nama programnya untuk melihat gambaran persiapannya.';
 if(/^(halo|hai|hi|pagi|siang|sore|malam)\b/.test(text))return 'Halo! Mau tahu program persiapan, jadwal kelas AK8, atau cara daftar? Pilih pertanyaan di bawah atau ketik pertanyaanmu.';
 return 'Aku khusus membantu informasi Geya: program, jadwal kelas, lokasi cabang, biaya, dan pendaftaran. Untuk rincian yang belum tersedia, silakan hubungi admin WhatsApp.';
}
import {branches,contact,faqs,programs,schedule} from '../src/content.js';
export const TOPICS=['programs','schedule','fees','registration','locations','contact','guarantee','greeting','faq','out_of_scope','unknown'];
export const knowledge={
 organization:'Geya Nawasena',websiteFocus:'Nunukan',programs,branches:branches.map(({id,name,address,mapUrl})=>({id,name,address:address||(id==='nunukan'?contact.address:''),mapUrl:mapUrl||(id==='nunukan'?contact.mapUrl:'')})),
 schedule:{branch:'nunukan',class:'AK8',timezone:'WITA',subjects:schedule},faqs:faqs.map(([question,answer],index)=>({id:'faq-'+index,question,answer})),
 fees:null,registration:['Tentukan tujuan seleksi.','Siapkan informasi pendidikan terakhir.','Konfirmasikan syarat, biaya, dan ketersediaan kelas kepada admin.'],
 contact:{whatsapp:contact.whatsapp,instagram:contact.instagram},guarantee:'Tidak ada jaminan kelulusan. Hasil seleksi mengikuti kemampuan peserta dan ketentuan instansi penyelenggara.'
};
export function renderReply(selection){
 const branch=branches.find(b=>b.id===selection.branchId);const program=programs.find(p=>p.id===selection.programId);
 switch(selection.topic){
  case 'fees':if(branch&&typeof knowledge.fees?.[branch.id]==='string')return 'Informasi biaya cabang '+branch.name+': '+knowledge.fees[branch.id];return 'Informasi biaya dan metode pembayaran'+(branch?' cabang '+branch.name:'')+' belum tersedia di website. Tanyakan kepada admin WhatsApp untuk rincian terbaru.';
  case 'schedule':{
   if(branch&&branch.id!=='nunukan')return 'Jadwal yang dipublikasikan di website ini adalah kelas AK8 cabang Nunukan. Jadwal cabang '+branch.name+' belum tersedia. Hubungi admin untuk konfirmasi kelas dan waktunya.';
   const subjects=schedule.filter(s=>!selection.subject||s.name===selection.subject);
   return 'Berikut jadwal kelas AK8 Nunukan:\n'+subjects.map(s=>s.name+': '+s.sessions.map(x=>x.day+' '+x.time).join(', ')+' WITA.').join('\n')+'\nKonfirmasikan perubahan jadwal kepada admin, ya.';
  }
  case 'programs':return program?program.name+': '+program.description+'\nGambaran persiapan: '+program.subjects.join(', ')+'. Rincian materi dan ketersediaan kelas'+(branch?' di '+branch.name:'')+' perlu dikonfirmasi kepada admin.':'Geya memperkenalkan persiapan Sekolah Kedinasan, TNI, dan Polri. Kamu tertarik jalur yang mana? Sebutkan juga cabangnya: Tarakan, Nunukan, atau Tanjung Selor.';
  case 'registration':return 'Langkah pendaftaran'+(branch?' cabang '+branch.name:'')+':\n'+knowledge.registration.join('\n');
  case 'locations':{
   if(!branch)return 'Geya hadir di Tarakan, Nunukan, dan Tanjung Selor. Informasi program dan jadwal di website ini berfokus pada Nunukan. Sebutkan cabang yang kamu cari, atau lihat bagian Lokasi untuk akses Maps dan kontak admin.';
   const address=branch.address||(branch.id==='nunukan'?contact.address:'');return address?'Alamat cabang '+branch.name+': '+address+'. Konfirmasikan petunjuk berkunjung kepada admin.':'Cabang '+branch.name+' berada di Kalimantan Utara. Alamat lengkap dan pin cabang belum dikonfirmasi di website. Tombol Maps di bagian Lokasi sementara membuka pencarian; hubungi admin sebelum berkunjung.';
  }
  case 'contact':return 'Hubungi admin Geya melalui WhatsApp +'+contact.whatsapp+'. Kamu juga bisa melihat Instagram @bimbel_geya_nawasena atau menggunakan tautan Admin di bagian atas chat.';
  case 'guarantee':return knowledge.guarantee+' Bimbingan membantu proses persiapan belajar.';
  case 'greeting':return 'Halo! Aku bisa membantu soal program persiapan, jadwal AK8 Nunukan, cabang, biaya, dan pendaftaran. Mau mulai dari mana?';
  case 'faq':return knowledge.faqs.find(f=>f.id===selection.faqId)?.answer||renderReply({topic:'unknown'});
  case 'out_of_scope':return 'Aku khusus membantu informasi bimbel Geya: program, jadwal, lokasi cabang, biaya, dan pendaftaran. Ada yang ingin kamu tanyakan tentang Geya?';
  default:return 'Informasi itu belum tersedia dalam pengetahuan resmi Geya. Aku bisa membantu soal program, jadwal, cabang, biaya, atau pendaftaran. Untuk rincian lainnya, silakan hubungi admin WhatsApp.';
 }
}
export function validSelection(value){
 return value&&TOPICS.includes(value.topic)&&(value.programId===null||programs.some(p=>p.id===value.programId))&&(value.branchId===null||branches.some(b=>b.id===value.branchId))&&(value.subject===null||schedule.some(s=>s.name===value.subject))&&(value.faqId===null||knowledge.faqs.some(f=>f.id===value.faqId));
}
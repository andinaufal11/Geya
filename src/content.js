export const contact = { whatsapp: '62811547999', instagram: 'https://www.instagram.com/bimbel_geya_nawasena/', address: '', mapUrl: '' };
export const programs = [
 {id:'kedinasan',name:'Sekolah Kedinasan',tag:'AKADEMIK & KESIAPAN DIRI',description:'Bangun dasar pengetahuan dan kebiasaan belajar untuk mempersiapkan seleksi sekolah kedinasan.',subjects:['Wawasan kebangsaan','Intelegensi umum','Karakteristik pribadi']},
 {id:'tni',name:'TNI',tag:'DISIPLIN & DAYA JUANG',description:'Persiapkan diri menuju pengabdian melalui belajar terarah dan pengembangan kemampuan diri.',subjects:['Persiapan akademik','Pengenalan psikotes','Persiapan kesamaptaan']},
 {id:'polri',name:'Polri',tag:'SIAP MELAYANI',description:'Mulai perjalanan menuju seleksi Polri dengan memperkuat pengetahuan dan kesiapan diri.',subjects:['Pengetahuan umum','Penalaran & numerasi','Persiapan kesamaptaan']}
];
export const faqs = [
 ['Geya Nawasena hadir di kota mana saja?','Geya Nawasena hadir di Tarakan, Nunukan, dan Tanjung Selor. Website ini menyediakan informasi seluruh cabang. Pilih cabang di bagian Lokasi, lalu konfirmasikan program, jadwal, dan alamat kepada admin cabang tujuanmu.'],
 ['Program persiapan apa saja yang tersedia?','Website ini memperkenalkan persiapan Sekolah Kedinasan, TNI, dan Polri. Ketersediaan kelas dan rincian materi perlu dikonfirmasi kepada pengelola cabang yang kamu pilih.'],
 ['Bagaimana cara mengetahui jadwal dan biaya?','Jadwal kelas AK8 cabang Nunukan tersedia pada bagian Jadwal di website ini. Untuk biaya, kuota, dan perubahan jadwal, silakan konfirmasi kepada pengelola cabang yang kamu pilih.'],
 ['Apakah ada jaminan lolos seleksi?','Tidak ada jaminan kelulusan. Hasil seleksi mengikuti kemampuan peserta dan ketentuan instansi penyelenggara. Bimbingan membantu proses persiapan belajar.'],
 ['Apa yang perlu disiapkan sebelum mendaftar?','Tentukan tujuan seleksi dan siapkan informasi pendidikan terakhir. Persyaratan pendaftaran bimbingan dapat dikonfirmasi kepada pengelola.']
];

export const schedule = [
 {name:'Psiko', description:'Latihan penalaran dan persiapan psikotes.', sessions:[{day:'Kamis',time:'19.30'},{day:'Sabtu',time:'10.00'}]},
 {name:'Matematika', description:'Perkuat kemampuan berhitung dan pemecahan masalah.', sessions:[{day:'Senin',time:'19.30'},{day:'Rabu',time:'19.30'}]},
 {name:'Bahasa Inggris', description:'Bangun pemahaman bahasa dan kemampuan membaca.', sessions:[{day:'Minggu',time:'19.30'},{day:'Jumat',time:'19.30'}]},
 {name:'Samjas', description:'Persiapan kesamaptaan jasmani.', sessions:[{day:'Senin',time:'16.30'},{day:'Rabu',time:'16.30'},{day:'Jumat',time:'16.30'}]},
];

export const branches = [
 {id:'tarakan',name:'Tarakan',region:'Kota Tarakan, Kalimantan Utara',description:'Kenali pilihan persiapan dan ketersediaan kelas Geya di Tarakan.',address:'',mapUrl:'',photo:{src:'/locations/tarakan.png',alt:'Pemandangan Kota Tarakan',caption:'Suasana Kota Tarakan',title:'Tarakan skyline',author:'Sekretariat Kabinet Indonesia',source:'https://commons.wikimedia.org/wiki/File:Tarakan_skyline.png',license:'Domain publik',licenseUrl:'https://commons.wikimedia.org/wiki/File:Tarakan_skyline.png#Licensing'}},
 {id:'nunukan',name:'Nunukan',region:'Kabupaten Nunukan, Kalimantan Utara',description:'Jelajahi program dan jadwal kelas AK8 yang tersedia di website ini.',address:'',mapUrl:'',photo:{src:'/locations/nunukan.jpg',alt:'Alun-alun Kota Nunukan di Kalimantan Utara',caption:'Alun-alun Kota Nunukan',title:'Alun-Alun Kota Nunukan',author:'Ezagren',source:'https://commons.wikimedia.org/wiki/File:Alun-Alun_Kota_Nunukan.JPG',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/'}},
 {id:'tanjung-selor',name:'Tanjung Selor',region:'Kabupaten Bulungan, Kalimantan Utara',description:'Tanyakan program dan informasi belajar Geya di Tanjung Selor.',address:'',mapUrl:'',photo:{src:'/locations/tanjung-selor.jpg',alt:'Taman tepian sungai di Tanjung Selor',caption:'Taman Tepian Tanjung Selor',title:'Taman Tepian Tanjung Selor',author:'Ezagren',source:'https://commons.wikimedia.org/wiki/File:Taman_Tepian_Tanjung_Selor.JPG',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/'}}
];
export function getBranchMapUrl(branch){return branch.mapUrl||'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Geya Nawasena '+branch.name+' Kalimantan Utara');}
import React from 'react';
import {ArrowUpRight,ArrowUp,MapPin,MessageCircle} from 'lucide-react';
import {contact} from './content';
export default function Footer(){
 const whatsapp=`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent('Halo Geya Nawasena Nunukan, saya ingin informasi program bimbingan.')}`;
 return <footer className="site-footer">
  <div className="wrap footer-main">
   <div className="footer-intro"><a className="brand" href="#beranda"><img src="/assets/logo.jpeg" alt="" width="48" height="48" loading="lazy"/><span>GEYA NAWASENA<small>BIMBINGAN BELAJAR NUNUKAN</small></span></a><p>Temani langkah kecilmu hari ini, untuk cita-cita pengabdian esok hari.</p></div>
   <div className="footer-column"><h2>Jelajahi Geya</h2><div className="footer-links" role="navigation" aria-label="Navigasi footer">{[['Tentang kami','tentang'],['Program persiapan','program'],['Jadwal kelas AK8','jadwal'],['Galeri','galeri'],['Pertanyaan umum','faq']].map(([name,id])=><a key={id} href={'#'+id}>{name}<ArrowUpRight size={14}/></a>)}</div></div>
   <div className="footer-column footer-contact"><h2>Mari terhubung</h2><p><MapPin size={17}/><span>{contact.address||'Nunukan, Kalimantan Utara'}</span></p><a className="footer-whatsapp" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={18}/><span>Chat admin WhatsApp<small>0811 547 999</small></span><ArrowUpRight size={17}/></a></div>
  </div>
  <div className="wrap footer-bottom"><p>© {new Date().getFullYear()} Geya Nawasena Nunukan.</p><span>Kedinasan · TNI · Polri</span><a href="#beranda">Kembali ke atas <ArrowUp size={16}/></a></div>
 </footer>;
}
import React from 'react';
import {MapPin,ArrowUpRight,MessageCircle,Navigation} from 'lucide-react';
import {branches,contact,getBranchMapUrl} from './content';
export default function Locations(){
 return <section className="locations-section section" id="lokasi" aria-labelledby="locations-title"><div className="wrap">
  <div className="section-heading"><div><div className="eyebrow">DEKAT DENGAN LANGKAHMU</div><h2 id="locations-title">Tiga kota.<br/><em>Satu semangat Geya.</em></h2></div><p>Temukan cabang yang dekat denganmu.<br/>Mulai persiapan dari kotamu sendiri.</p></div>
  <div className="locations-grid">{branches.map((branch,index)=>{
   const address=branch.address||(branch.id==='nunukan'?contact.address:'');
   const mapUrl=branch.mapUrl||(branch.id==='nunukan'?contact.mapUrl:'');
   const whatsapp=`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent('Halo Geya Nawasena, saya ingin informasi program, alamat, dan ketersediaan kelas cabang '+branch.name+'.')}`;
   return <article className="location-card" key={branch.id} aria-labelledby={'location-'+branch.id}>
    <figure className="location-photo"><img src={branch.photo.src} alt={branch.photo.alt} width="960" height="640" loading="lazy" decoding="async"/><figcaption><MapPin size={13}/>{branch.photo.caption}</figcaption></figure>
    <div className="location-content"><div className="location-card-heading"><span className="location-number">0{index+1}</span><h3 id={'location-'+branch.id}>{branch.name}</h3>{branch.id==='nunukan'&&<span className="location-focus">Jadwal AK8</span>}</div><p className="location-region">{branch.region}</p><p className="location-description">{branch.description}</p><div className="location-address"><MapPin size={16}/><p>{address||'Alamat lengkap dapat ditanyakan kepada admin.'}</p></div><div className="location-actions"><a className="button" href={mapUrl||getBranchMapUrl(branch)} target="_blank" rel="noopener noreferrer" aria-label={(mapUrl?'Buka lokasi':'Cari Geya Nawasena')+' '+branch.name+' di Google Maps'}><Navigation size={16}/>{mapUrl?'Buka Google Maps':'Cari di Google Maps'}<ArrowUpRight size={16}/></a><a className="text-link" href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label={'Tanya admin tentang cabang '+branch.name}><MessageCircle size={16}/>Tanya cabang ini<ArrowUpRight size={15}/></a></div></div>
   </article>;
  })}</div>
  <div className="locations-note"><MapPin size={17}/><p>Foto menampilkan suasana kota, bukan gedung cabang. Maps sementara membuka hasil pencarian; konfirmasikan alamat cabang kepada admin sebelum berkunjung.</p></div>
  <details className="location-credits"><summary>Kredit foto kota</summary><ul>{branches.map(branch=><li key={branch.id}><a href={branch.photo.source} target="_blank" rel="noreferrer">{branch.photo.title}</a> — {branch.photo.author}. <a href={branch.photo.licenseUrl} target="_blank" rel="noreferrer">{branch.photo.license}</a>.</li>)}</ul><p>Foto ditampilkan dengan pemotongan komposisi untuk menyesuaikan kartu.</p></details>
 </div></section>;
}
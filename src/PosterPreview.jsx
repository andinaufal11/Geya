import React, {useEffect, useRef, useState} from 'react';
import {X, ArrowUpRight} from 'lucide-react';
import schedulePoster from '../assets/jadwal.jpeg';

export default function PosterPreview(){
 const dialogRef=useRef(null);
 const [open,setOpen]=useState(false);
 useEffect(()=>{
  if(!open)return;
  const previousOverflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  dialogRef.current.showModal();
  return()=>{document.body.style.overflow=previousOverflow;};
 },[open]);
 function close(){dialogRef.current.close();}
 function closeBackdrop(event){
  if(event.target!==event.currentTarget)return;
  const bounds=event.currentTarget.getBoundingClientRect();
  if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)close();
 }
 return <>
  <button className="poster-trigger" aria-haspopup="dialog" aria-controls="schedule-poster" onClick={()=>setOpen(true)}>Lihat poster asli <ArrowUpRight size={16}/></button>
  <dialog className="poster-dialog" id="schedule-poster" ref={dialogRef} aria-labelledby="poster-title" onClose={()=>setOpen(false)} onClick={closeBackdrop}>
   <div className="poster-toolbar"><h2 id="poster-title">Poster jadwal kelas AK8</h2><button className="poster-close" aria-label="Tutup poster" onClick={close} autoFocus><X size={22}/></button></div>
   <div className="poster-image"><img src={schedulePoster} alt="Poster asli jadwal bimbingan kelas AK8 Geya Nawasena Nunukan"/></div>
  </dialog>
 </>;
}
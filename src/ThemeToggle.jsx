import React,{useEffect,useRef,useState} from 'react';
import {Sun,Moon} from 'lucide-react';
export default function ThemeToggle(){
 const [dark,setDark]=useState(false);const manual=useRef(false);
 function apply(value){document.documentElement.dataset.theme=value?'dark':'light';document.documentElement.style.colorScheme=value?'dark':'light';document.querySelector('meta[name="theme-color"]')?.setAttribute('content',value?'#191717':'#be1822');setDark(value);}
 useEffect(()=>{
  const media=window.matchMedia('(prefers-color-scheme: dark)');
  const read=()=>{let saved;try{saved=localStorage.getItem('geya-theme');}catch{}manual.current=saved==='dark'||saved==='light';apply(manual.current?saved==='dark':media.matches);};
  const change=event=>{if(!manual.current)apply(event.matches);};const sync=event=>{if(event.key==='geya-theme'||event.key===null)read();};
  read();media.addEventListener('change',change);window.addEventListener('storage',sync);
  return()=>{media.removeEventListener('change',change);window.removeEventListener('storage',sync);};
 },[]);
 function toggle(){const next=document.documentElement.dataset.theme!=='dark';manual.current=true;apply(next);try{localStorage.setItem('geya-theme',next?'dark':'light');}catch{}}
 return <button type="button" className="theme-toggle" role="switch" aria-label="Mode gelap" aria-checked={dark} onClick={toggle} title={dark?'Ganti ke mode terang':'Ganti ke mode gelap'}><Moon className="theme-moon" size={20}/><Sun className="theme-sun" size={20}/></button>;
}
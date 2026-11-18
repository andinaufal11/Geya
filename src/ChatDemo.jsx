import React,{useEffect,useRef,useState} from 'react';
import {MessageCircle,Send,X,ArrowUpRight} from 'lucide-react';
import {contact} from './content';
import {getDemoReply,suggestions} from './chatDemo.js';
const greeting={role:'assistant',source:'faq',text:'Halo! Aku asisten informasi Geya. Mau tahu program persiapan, jadwal kelas, lokasi cabang, atau cara daftar?'};
export default function ChatDemo(){
 const [open,setOpen]=useState(false),[input,setInput]=useState(''),[messages,setMessages]=useState([greeting]),[pending,setPending]=useState(false),[mode,setMode]=useState('faq'),[notice,setNotice]=useState('');
 const inputRef=useRef(null),logRef=useRef(null),triggerRef=useRef(null),pendingRef=useRef(false),requestRef=useRef(null);
 const whatsapp=`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent('Halo Geya Nawasena Nunukan, saya ingin konsultasi tentang program bimbel.')}`;
 function close(){setOpen(false);requestAnimationFrame(()=>triggerRef.current?.focus());}
 useEffect(()=>{
  if(!open)return;inputRef.current?.focus();const controller=new AbortController();
  fetch('/api/chat',{signal:controller.signal,cache:'no-store'}).then(response=>response.ok?response.json():null).then(data=>{if(!controller.signal.aborted)setMode(data?.mode==='ai'?'ai':'faq');}).catch(()=>{});
  return()=>controller.abort();
 },[open]);
 useEffect(()=>()=>requestRef.current?.abort(),[]);
 useEffect(()=>{if(open&&logRef.current)logRef.current.scrollTop=logRef.current.scrollHeight;},[messages,open,pending]);
 async function send(text){
  const question=text.trim().slice(0,300);if(!question||pendingRef.current)return;
  pendingRef.current=true;setPending(true);setNotice('');setInput('');
  const history=messages.filter(message=>message.role==='user').slice(-6).map(message=>message.text);
  setMessages(previous=>[...previous,{role:'user',text:question}].slice(-39));
  const controller=new AbortController();requestRef.current=controller;const timeout=setTimeout(()=>controller.abort(),16000);
  try{
   const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:question,history}),signal:controller.signal});
   const data=response.ok?await response.json():null;
   if(!data||typeof data.reply!=='string'||!data.reply.trim()||data.reply.length>2500||!['faq','ai'].includes(data.source))throw new Error('unavailable');
   setMessages(previous=>[...previous,{role:'assistant',text:data.reply,source:data.source}].slice(-40));setMode(data.source);
   if(data.reason==='limit')setNotice('Batas layanan AI sedang tercapai. Kamu tetap bisa memakai informasi dasar atau menghubungi admin.');
  }catch{
   setMessages(previous=>[...previous,{role:'assistant',text:getDemoReply(question),source:'faq'}].slice(-40));setMode('faq');setNotice('Layanan AI sedang tidak tersedia. Jawaban berikut memakai informasi dasar Geya.');
  }finally{clearTimeout(timeout);pendingRef.current=false;setPending(false);requestRef.current=null;}
 }
 return <div className="chat-widget">
  {open&&<section id="geya-chat" className="chat-panel" aria-label="Chat konsultasi Geya" onKeyDown={event=>{if(event.key==='Escape'){event.stopPropagation();close();}}}>
   <div className="chat-header"><div className="chat-avatar"><MessageCircle size={22}/></div><div><strong>Tanya Geya</strong><span>Asisten informasi bimbel <b>{mode==='ai'?'AI':'INFO'}</b></span></div><a className="chat-header-admin" href={whatsapp} target="_blank" rel="noreferrer" aria-label="Hubungi admin melalui WhatsApp">Admin <ArrowUpRight size={14}/></a><button className="chat-close" onClick={close} aria-label="Tutup chat"><X size={21}/></button></div>
   <p className="chat-demo-note">{mode==='ai'?'Dalam mode AI, pesan diproses Google Gemini. Jangan kirim data pribadi.':'Info Geya. Saat AI aktif, pesan diproses Gemini. Hindari data pribadi.'}</p>
   <div className="chat-log" ref={logRef} role="log" aria-label="Percakapan" aria-live="polite" aria-relevant="additions" aria-busy={pending}>{messages.map((message,index)=><div key={index} className={'chat-message '+message.role}><span>{message.role==='user'?'Kamu':message.source==='ai'?'Geya · AI':'Geya · Info'}</span><p>{message.text}</p></div>)}{pending&&<p className="chat-pending" role="status">Geya sedang memahami pertanyaan…</p>}{notice&&<p className="chat-notice" role="status">{notice}</p>}</div>
   <div className="chat-suggestions" role="group" aria-label="Contoh pertanyaan">{suggestions.map(question=><button key={question} disabled={pending} onClick={()=>send(question)}>{question}</button>)}</div>
   <form className="chat-form" onSubmit={event=>{event.preventDefault();send(input);}}><label className="visually-hidden" htmlFor="chat-question">Pertanyaan tentang bimbel</label><input ref={inputRef} id="chat-question" value={input} onChange={event=>setInput(event.target.value)} maxLength={300} placeholder="Tanya tentang bimbel…" autoComplete="off"/><button type="submit" disabled={pending||!input.trim()} aria-label="Kirim pertanyaan"><Send size={19}/></button></form>
  </section>}
  <button ref={triggerRef} hidden={open} className="chat-launcher" aria-controls="geya-chat" aria-expanded={open} onClick={()=>setOpen(true)}><MessageCircle size={22}/><span>Tanya Geya<small>Asisten bimbel</small></span></button>
 </div>;
}
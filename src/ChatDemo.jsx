import React,{useEffect,useRef,useState} from 'react';
import {MessageCircle,Send,X,ArrowUpRight} from 'lucide-react';
import {contact} from './content';
import {getDemoReply,suggestions} from './chatDemo.js';
const greeting={role:'assistant',text:'Halo, aku asisten Geya. Mau tahu program persiapan, jadwal kelas, atau cara daftar? Ini demo chat dengan jawaban contoh, ya.'};
export default function ChatDemo(){
 const [open,setOpen]=useState(false),[input,setInput]=useState(''),[messages,setMessages]=useState([greeting]);
 const inputRef=useRef(null),logRef=useRef(null),triggerRef=useRef(null);
 const whatsapp=`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent('Halo Geya Nawasena Nunukan, saya ingin konsultasi tentang program bimbel.')}`;
 function close(){setOpen(false);triggerRef.current?.focus();}
 useEffect(()=>{if(open)inputRef.current?.focus();},[open]);
 useEffect(()=>{if(open&&logRef.current)logRef.current.scrollTop=logRef.current.scrollHeight;},[messages,open]);
 function send(text){
  const question=text.trim().slice(0,300);if(!question)return;
  setMessages(previous=>[...previous,{role:'user',text:question},{role:'assistant',text:getDemoReply(question)}].slice(-40));setInput('');
 }
 return <div className="chat-widget">
  {open&&<section id="geya-chat" className="chat-panel" aria-label="Demo chat konsultasi Geya" onKeyDown={event=>{if(event.key==='Escape'){event.stopPropagation();close();}}}>
   <div className="chat-header"><div className="chat-avatar"><MessageCircle size={22}/></div><div><strong>Tanya Geya</strong><span>Asisten informasi bimbel <b>DEMO</b></span></div><button className="chat-close" onClick={close} aria-label="Tutup chat"><X size={21}/></button></div>
   <p className="chat-demo-note">Simulasi konsultasi dengan jawaban contoh.</p>
   <div className="chat-log" ref={logRef} role="log" aria-label="Percakapan" aria-live="polite" aria-relevant="additions">{messages.map((message,index)=><div key={index} className={'chat-message '+message.role}><span>{message.role==='user'?'Kamu':'Geya · Demo'}</span><p>{message.text}</p></div>)}</div>
   <div className="chat-suggestions" role="group" aria-label="Contoh pertanyaan">{suggestions.map(question=><button key={question} onClick={()=>send(question)}>{question}</button>)}</div>
   <form className="chat-form" onSubmit={event=>{event.preventDefault();send(input);}}><label className="visually-hidden" htmlFor="chat-question">Pertanyaan tentang bimbel</label><input ref={inputRef} id="chat-question" value={input} onChange={event=>setInput(event.target.value)} maxLength={300} placeholder="Tanya tentang bimbel…" autoComplete="off"/><button type="submit" disabled={!input.trim()} aria-label="Kirim pertanyaan"><Send size={19}/></button></form>
   <a className="chat-admin" href={whatsapp} target="_blank" rel="noreferrer">Lanjut ke admin WhatsApp <ArrowUpRight size={16}/></a>
  </section>}
  <button ref={triggerRef} className="chat-launcher" aria-controls="geya-chat" aria-expanded={open} onClick={()=>open?close():setOpen(true)}>{open?<X size={22}/>:<MessageCircle size={22}/>}<span>{open?'Tutup chat':'Tanya Geya'}<small>{open?'':'Demo AI'}</small></span></button>
 </div>;
}
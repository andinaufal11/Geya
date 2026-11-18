import {getDemoReply} from '../src/chatDemo.js';
import {renderReply} from './knowledge.js';
import {classifyWithGemini} from './gemini.js';
import {createLimiter,hasSharedLimiter} from './limits.js';
export function aiConfigured(env){return env.CHAT_AI_ENABLED==='true'&&!!env.GEMINI_API_KEY&&(!(env.VERCEL||env.NODE_ENV==='production')||hasSharedLimiter(env));}
async function readBody(req){
 const length=Number(req.headers['content-length']||0);if(length>10000)throw new Error('too_large');
 if(req.body!==undefined){const raw=typeof req.body==='string'?req.body:JSON.stringify(req.body);if(Buffer.byteLength(raw)>10000)throw new Error('too_large');return typeof req.body==='string'?JSON.parse(raw):req.body;}
 const chunks=[];let size=0;for await(const chunk of req){size+=Buffer.byteLength(chunk);if(size>10000)throw new Error('too_large');chunks.push(Buffer.from(chunk));}
 return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
export function createChatHandler({env=process.env,fetchImpl=fetch,limiter,now,logError=code=>console.warn('[geya-chat] '+code)}={}){
 const consume=limiter||createLimiter({env,fetchImpl,now});
 return async function handler(req,res){
  res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('X-Content-Type-Options','nosniff');
  const send=(status,body)=>{res.statusCode=status;res.end(JSON.stringify(body));};
  if(req.method==='GET')return send(200,{mode:aiConfigured(env)?'ai':'faq'});
  if(req.method!=='POST'){res.setHeader('Allow','GET, POST');return send(405,{error:'method_not_allowed'});}
  const allowed=new Set([env.SITE_URL||'https://geya.vercel.app',env.VERCEL_URL?'https://'+env.VERCEL_URL:null].filter(Boolean).map(value=>{try{return new URL(value).origin;}catch{return '';}}));
  if(!env.VERCEL&&env.NODE_ENV!=='production'){allowed.add('http://localhost:5173');allowed.add('http://127.0.0.1:5173');allowed.add('http://127.0.0.1:4173');}
  if(req.headers['sec-fetch-site']==='cross-site'||(req.headers.origin&&!allowed.has(req.headers.origin)))return send(403,{error:'origin_not_allowed'});
  if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']||''))return send(415,{error:'json_required'});
  let body;try{body=await readBody(req);}catch(error){return send(error.message==='too_large'?413:400,{error:'invalid_request'});}
  if(!body||typeof body.message!=='string'||!body.message.trim()||body.message.length>300||!Array.isArray(body.history||[])||(body.history||[]).length>6||(body.history||[]).some(x=>typeof x!=='string'||x.length>300))return send(400,{error:'invalid_request'});
  const message=body.message.trim(),history=(body.history||[]).map(x=>x.trim()).filter(Boolean);
  const fallback=reason=>send(200,{reply:getDemoReply(message),source:'faq',reason});
  if(!aiConfigured(env))return fallback('unavailable');
  try{
   const ip=env.VERCEL?(req.headers['x-vercel-forwarded-for']||req.headers['x-forwarded-for']||'unknown').split(',')[0].trim():(req.socket?.remoteAddress||'local');
   if(!await consume(ip)){res.setHeader('Retry-After','600');return fallback('limit');}
   const selection=await classifyWithGemini({message,history,env,fetchImpl});return send(200,{reply:renderReply(selection),source:'ai'});
  }catch(error){
   const known=['limiter_unavailable','limiter_response','limiter_permission','limiter_unsupported_command','invalid_limiter_url','invalid_selection','invalid_model','incomplete_provider_response'];
   const code=known.includes(error.message)||/^provider_\d{3}$/.test(error.message)?error.message:['AbortError','TimeoutError'].includes(error.name)?'timeout':'unexpected_error';
   try{logError(code);}catch{}return fallback('unavailable');
  }
 };
}
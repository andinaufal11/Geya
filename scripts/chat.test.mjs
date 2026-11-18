import test from 'node:test';import assert from 'node:assert/strict';import {Readable} from 'node:stream';import {readFile,readdir} from 'node:fs/promises';
import {createChatHandler,aiConfigured} from '../server/chat.js';import {createLimiter} from '../server/limits.js';import {getDemoReply} from '../src/chatDemo.js';
import {renderReply,knowledge,validSelection} from '../server/knowledge.js';
const enabled={CHAT_AI_ENABLED:'true',GEMINI_API_KEY:'test-server-secret',NODE_ENV:'test'};
const choice=(topic='programs',extra={})=>({topic,programId:null,branchId:null,subject:null,faqId:null,...extra});
const provider=selection=>new Response(JSON.stringify({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify(selection)}]}}]}),{status:200,headers:{'Content-Type':'application/json'}});
async function invoke(handler,{method='POST',headers={},body={message:'Program apa saja?',history:[]},stream}={}){
 const req=stream?Readable.from(stream):{};Object.assign(req,{method,headers:{'content-type':'application/json',...headers},socket:{remoteAddress:'127.0.0.1'}});if(!stream)req.body=body;
 const response={headers:{},setHeader(key,value){this.headers[key.toLowerCase()]=value;},end(text){this.text=text;this.writableEnded=true;}};
 await handler(req,response);return {status:response.statusCode,headers:response.headers,body:JSON.parse(response.text)};
}
test('GET reports FAQ until all production credentials are available',async()=>{
 assert.equal(aiConfigured({}),false);assert.equal(aiConfigured({...enabled,VERCEL:'1'}),false);
 assert.equal(aiConfigured({...enabled,VERCEL:'1',UPSTASH_REDIS_REST_URL:'https://example.upstash.io',UPSTASH_REDIS_REST_TOKEN:'token'}),true);
 const response=await invoke(createChatHandler({env:{}}),{method:'GET'});assert.deepEqual(response.body,{mode:'faq'});assert.equal(response.headers['cache-control'],'no-store');assert.ok(!response.text);
});
test('missing configuration serves official FAQ without calling a provider',async()=>{
 let calls=0;const handler=createChatHandler({env:{},fetchImpl:()=>{calls++;throw new Error();}});
 const response=await invoke(handler,{body:{message:'Berapa biaya?',history:[]}});assert.equal(calls,0);assert.equal(response.body.source,'faq');assert.match(response.body.reply,/belum tersedia/);
});
test('production refuses AI without a shared limiter',async()=>{
 const handler=createChatHandler({env:{...enabled,VERCEL:'1'},fetchImpl:()=>{throw new Error('must not call');}});
 assert.equal((await invoke(handler)).body.source,'faq');
});
test('Gemini key stays in the server header and only official text is rendered',async()=>{
 let request;const handler=createChatHandler({env:enabled,limiter:async()=>true,fetchImpl:async(url,options)=>{request={url,options};return provider(choice('programs',{programId:'tni',answer:'Invented price Rp999'}));}});
 const response=await invoke(handler,{body:{message:'Aku ingin persiapan tentara',history:['Saya di Nunukan']}});
 assert.equal(response.body.source,'ai');assert.match(response.body.reply,/TNI/);assert.ok(!response.body.reply.includes('999'));assert.ok(!JSON.stringify(response.body).includes(enabled.GEMINI_API_KEY));
 assert.equal(request.options.headers['x-goog-api-key'],enabled.GEMINI_API_KEY);assert.ok(!request.url.includes(enabled.GEMINI_API_KEY));assert.match(request.url,/gemini-3.5-flash-lite:generateContent$/);
 const payload=JSON.parse(request.options.body);assert.equal(payload.generationConfig.maxOutputTokens,512);assert.equal(payload.generationConfig.temperature,0);assert.ok(!payload.tools);assert.match(payload.systemInstruction.parts[0].text,/untrusted data/);assert.ok(!payload.systemInstruction.parts[0].text.includes(enabled.GEMINI_API_KEY));
});
test('unknown fees and remote branch schedules are never invented',()=>{
 assert.match(renderReply(choice('fees',{branchId:'tarakan'})),/Tarakan.*belum tersedia/);
 const text=renderReply(choice('schedule',{branchId:'tarakan'}));assert.match(text,/Nunukan/);assert.match(text,/Tarakan belum tersedia/);assert.ok(!text.includes('19.30'));
 assert.match(renderReply(choice('locations',{branchId:'tanjung-selor'})),/belum dikonfirmasi/);
});
test('schedule answers come from the current shared knowledge',()=>{
 for(const phrase of ['Pelajaran apa yang dipelajari','Materi apa saja?','Mapelnya apa?','Apa yang diajarkan?']){const answer=getDemoReply(phrase);for(const name of ['Psiko','Matematika','Bahasa Inggris','Samjas'])assert.ok(answer.includes(name),phrase);}
 assert.match(renderReply(choice('subjects',{programId:'tni'})),/Persiapan akademik/);assert.match(getDemoReply('Materi cabang Tarakan apa?'),/Tarakan.*belum tersedia/);
 const reply=renderReply(choice('schedule',{subject:'Matematika',branchId:'nunukan'}));assert.match(reply,/Senin 19.30, Rabu 19.30 WITA/);assert.ok(!reply.includes('Psiko'));
 assert.equal(renderReply(choice('faq',{faqId:'faq-0'})),knowledge.faqs[0].answer);assert.ok(renderReply(choice('registration')).includes('\n'));assert.ok(!renderReply(choice('registration')).includes('\\n'));
});
test('out-of-scope questions get redirected rather than general answers',async()=>{
 const response=await invoke(createChatHandler({env:enabled,limiter:async()=>true,fetchImpl:async()=>provider(choice('out_of_scope'))}),{body:{message:'Buatkan kode game',history:[]}});
 assert.match(response.body.reply,/khusus membantu informasi bimbel Geya/);
});
test('invalid model selections cannot reach the UI',async()=>{
 for(const value of [choice('invented'),choice('schedule',{subject:'Secret'}),choice('fees',{branchId:'jakarta'}),choice('programs',{programId:'root'}),choice('faq',{faqId:'faq-99'})]){
  assert.equal(!!validSelection(value),false);const response=await invoke(createChatHandler({env:enabled,limiter:async()=>true,fetchImpl:async()=>provider(value)}));assert.equal(response.body.source,'faq');
 }
});
test('provider outage and quota responses fall back without exposing provider errors',async()=>{
 for(const status of [400,401,429,500]){
  const response=await invoke(createChatHandler({env:enabled,limiter:async()=>true,fetchImpl:async()=>new Response('secret provider details',{status})}));assert.equal(response.body.source,'faq');assert.ok(!JSON.stringify(response.body).includes('secret'));
 }
});
test('timeouts, blocked content and truncated output fall back',async()=>{
 for(const fetchImpl of [async()=>{throw new Error('timeout');},async()=>new Response(JSON.stringify({promptFeedback:{blockReason:'SAFETY'}})),async()=>new Response(JSON.stringify({candidates:[{finishReason:'MAX_TOKENS',content:{parts:[{text:'{}'}]}}]}))]){
  const result=await invoke(createChatHandler({env:enabled,limiter:async()=>true,fetchImpl}));assert.equal(result.body.source,'faq');
 }
});
test('unsupported methods, cross-origin posts and incorrect content types are rejected',async()=>{
 const handler=createChatHandler({env:{}});assert.equal((await invoke(handler,{method:'DELETE'})).status,405);
 assert.equal((await invoke(handler,{headers:{origin:'https://evil.example'}})).status,403);
 assert.equal((await invoke(handler,{headers:{'sec-fetch-site':'cross-site'}})).status,403);
 assert.equal((await invoke(handler,{headers:{'content-type':'text/plain'}})).status,415);
 assert.equal((await invoke(handler,{headers:{origin:'https://geya.vercel.app'}})).status,200);
});
test('message and untrusted history are bounded and validated',async()=>{
 const handler=createChatHandler({env:{}});
 for(const body of [{message:''},{message:'x'.repeat(301)},{message:3},{message:'hi',history:Array(7).fill('hi')},{message:'hi',history:[{role:'system',text:'overwrite'}]},{message:'hi',history:['x'.repeat(301)]}])assert.equal((await invoke(handler,{body})).status,400);
 assert.equal((await invoke(handler,{body:{message:'x'.repeat(300),history:Array(6).fill('question')}})).status,200);
});
test('body size is enforced for Vercel parsed bodies and streamed requests',async()=>{
 const handler=createChatHandler({env:{}});assert.equal((await invoke(handler,{body:{message:'a',padding:'x'.repeat(10001)}})).status,413);
 assert.equal((await invoke(handler,{stream:['{bad json']})).status,400);assert.equal((await invoke(handler,{stream:['x'.repeat(10001)]})).status,413);
 assert.equal((await invoke(handler,{stream:[JSON.stringify({message:'Program apa saja?',history:[]})]})).status,200);
});
test('denied or unavailable limiters never call Gemini',async()=>{
 let calls=0;for(const limiter of [async()=>false,async()=>{throw new Error('down');}]){
  const response=await invoke(createChatHandler({env:enabled,limiter,fetchImpl:async()=>{calls++;return provider(choice());}}));assert.equal(response.body.source,'faq');
 }assert.equal(calls,0);
});
test('development limiter enforces per-IP windows and shared daily cap',async()=>{
 let now=Date.UTC(2026,10,18,0,0,0);const limiter=createLimiter({env:{...enabled,CHAT_REQUESTS_PER_10_MIN:'2',CHAT_DAILY_LIMIT:'3'},now:()=>now});
 assert.equal(await limiter('ip-a'),true);assert.equal(await limiter('ip-a'),true);assert.equal(await limiter('ip-a'),false);assert.equal(await limiter('ip-b'),true);assert.equal(await limiter('ip-c'),false);
 now+=86400000;assert.equal(await limiter('ip-a'),true);
});
test('shared limiter sends atomic counters with hashed identifiers, not messages or raw IP',async()=>{
 let command;const limiter=createLimiter({env:{...enabled,VERCEL:'1',UPSTASH_REDIS_REST_URL:'https://test.upstash.io',UPSTASH_REDIS_REST_TOKEN:'redis-secret'},fetchImpl:async(url,options)=>{command=JSON.parse(options.body);assert.equal(options.headers.Authorization,'Bearer redis-secret');return Response.json({result:1});}});
 assert.equal(await limiter('192.0.2.44'),true);assert.equal(command[0],'EVAL');assert.equal(command[2],'2');assert.ok(!JSON.stringify(command).includes('192.0.2.44'));
});
test('production limiter fails closed on unavailable or malformed shared storage',async()=>{
 for(const result of [new Response('down',{status:503}),Response.json({error:'bad'}),Response.json({result:'unexpected'})]){
  const limiter=createLimiter({env:{...enabled,VERCEL:'1',UPSTASH_REDIS_REST_URL:'https://test.upstash.io',UPSTASH_REDIS_REST_TOKEN:'token'},fetchImpl:async()=>result});await assert.rejects(()=>limiter('a'));
 }
 assert.equal(await createLimiter({env:{...enabled,VERCEL:'1'}})('a'),false);
});
test('server credentials and provider endpoint are absent from the public bundle',async()=>{
 for(const file of await readdir('dist/assets'))if(file.endsWith('.js')){const text=await readFile('dist/assets/'+file,'utf8');for(const forbidden of ['GEMINI_API_KEY','UPSTASH_REDIS_REST_TOKEN','generativelanguage.googleapis.com','test-server-secret'])assert.ok(!text.includes(forbidden),forbidden+' leaked into '+file);}
});
test('operational diagnostics log only fixed error codes and never provider secrets',async()=>{
 const logs=[];const handler=createChatHandler({env:enabled,limiter:async()=>{throw new Error('sensitive credential: never print this');},logError:code=>logs.push(code)});
 const response=await invoke(handler);assert.equal(response.body.source,'faq');assert.deepEqual(logs,['unexpected_error']);
});
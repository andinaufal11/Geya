import {createHmac} from 'node:crypto';
const script=`
local ip=tonumber(redis.call('GET',KEYS[1]) or '0')
local day=tonumber(redis.call('GET',KEYS[2]) or '0')
if ip>=tonumber(ARGV[1]) or day>=tonumber(ARGV[2]) then return 0 end
redis.call('INCR',KEYS[1]);redis.call('EXPIRE',KEYS[1],ARGV[3])
redis.call('INCR',KEYS[2]);redis.call('EXPIRE',KEYS[2],ARGV[4])
return 1`;
const bounded=(value,fallback,max)=>Math.max(1,Math.min(Number.parseInt(value,10)||fallback,max));
export function hasSharedLimiter(env){return !!(env.UPSTASH_REDIS_REST_URL&&env.UPSTASH_REDIS_REST_TOKEN);}
export function createLimiter({env,fetchImpl=fetch,now=Date.now}){
 const memory=new Map();let dayKey='',dayCount=0;
 return async function consume(ip){
  const time=now();const window=Math.floor(time/600000);const date=new Date(time).toISOString().slice(0,10);
  const maxIp=bounded(env.CHAT_REQUESTS_PER_10_MIN,10,30),maxDay=bounded(env.CHAT_DAILY_LIMIT,100,1000);
  const identity=createHmac('sha256',env.CHAT_RATE_LIMIT_SALT||env.GEMINI_API_KEY||'local-development').update(ip||'unknown').digest('hex');
  if(hasSharedLimiter(env)){
   const url=new URL(env.UPSTASH_REDIS_REST_URL);if(url.protocol!=='https:'||url.username||url.password)throw new Error('invalid_limiter_url');
   const ttlDay=Math.ceil((Date.parse(date+'T00:00:00Z')+86400000-time)/1000)+60;
   const response=await fetchImpl(url.href,{method:'POST',headers:{Authorization:'Bearer '+env.UPSTASH_REDIS_REST_TOKEN,'content-type':'application/json'},signal:AbortSignal.timeout(4000),body:JSON.stringify(['EVAL',script,'2',`geya:{chat}:ip:${window}:${identity}`,`geya:{chat}:day:${date}`,String(maxIp),String(maxDay),'660',String(ttlDay)])});
   if(!response.ok)throw new Error('limiter_unavailable');const body=await response.json();if(body.error||![0,1].includes(body.result))throw new Error('limiter_response');return body.result===1;
  }
  // Production never falls back to per-instance counters: that would not enforce a shared budget.
  if(env.VERCEL||env.NODE_ENV==='production')return false;
  if(date!==dayKey){dayKey=date;dayCount=0;}
  for(const [key,item] of memory)if(item.window!==window)memory.delete(key);
  const item=memory.get(identity)||{window,count:0};if(item.count>=maxIp||dayCount>=maxDay||memory.size>=10000)return false;
  item.count++;dayCount++;memory.set(identity,item);return true;
 };
}
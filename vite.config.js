import {defineConfig,loadEnv} from 'vite';
import {createChatHandler} from './server/chat.js';
export default defineConfig(({mode})=>{
 const env={...process.env,...loadEnv(mode,process.cwd(),'')};
 // Middleware runs only in Node, never in the browser bundle. Vercel uses api/chat.js.
 const handler=createChatHandler({env});
 const middleware=(req,res,next)=>req.url?.split('?')[0]==='/api/chat'?handler(req,res).catch(()=>{if(!res.writableEnded){res.statusCode=500;res.end('{"error":"unavailable"}');}}):next();
 return {plugins:[{name:'geya-chat-api',configureServer(server){server.middlewares.use(middleware);},configurePreviewServer(server){server.middlewares.use(middleware);}}]};
});
import {build,loadEnv} from 'vite';
import {readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {contact} from '../src/content.js';
import {seo,resolveSiteUrl,structuredData} from './seo-config.mjs';
const env=loadEnv('production',process.cwd(),'');
const siteUrl=resolveSiteUrl(process.env.SITE_URL||env.SITE_URL||seo.defaultUrl);
const escape=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
await build();
await build({publicDir:false,build:{ssr:'src/entry-server.jsx',outDir:'.seo-build',rollupOptions:{output:{entryFileNames:'entry-server.mjs'}}}});
const {render}=await import(pathToFileURL(resolve('.seo-build/entry-server.mjs')).href);
const markup=render();
let html=await readFile('dist/index.html','utf8');
if(!html.includes('<div id="root"></div>'))throw new Error('Missing prerender target');
html=html.replace('<div id="root"></div>',()=>'<div id="root">'+markup+'</div>');
html=html.replace(/<title>.*?<\/title>/s,()=>'<title>'+escape(seo.title)+'</title>');
html=html.replace(/<meta name="description" content="[^"]*"\s*\/>/,()=>'<meta name="description" content="'+escape(seo.description)+'"/>');
const image=siteUrl+'assets/logo.jpeg';
const head=`
<link rel="canonical" href="${escape(siteUrl)}"/>
<meta property="og:type" content="website"/>
<meta property="og:locale" content="id_ID"/>
<meta property="og:site_name" content="${escape(seo.name)}"/>
<meta property="og:title" content="${escape(seo.title)}"/>
<meta property="og:description" content="${escape(seo.description)}"/>
<meta property="og:url" content="${escape(siteUrl)}"/>
<meta property="og:image" content="${escape(image)}"/>
<meta property="og:image:alt" content="Logo Geya Nawasena"/>
<meta name="twitter:card" content="summary"/>
<meta name="twitter:title" content="${escape(seo.title)}"/>
<meta name="twitter:description" content="${escape(seo.description)}"/>
<meta name="twitter:image" content="${escape(image)}"/>
<script type="application/ld+json">${JSON.stringify(structuredData(siteUrl,contact)).replaceAll('<','\\u003c')}</script>
`;
html=html.replace('</head>',()=>head+'</head>');
await writeFile('dist/index.html',html);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`);
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(siteUrl)}</loc></url></urlset>\n`);
console.log('SEO HTML, canonical, structured data, robots.txt and sitemap built for '+siteUrl);
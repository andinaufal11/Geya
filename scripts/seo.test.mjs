import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {resolve} from 'node:path';
import {seo,resolveSiteUrl,structuredData} from './seo-config.mjs';
import {contact,programs,schedule,faqs} from '../src/content.js';
const html=await readFile('dist/index.html','utf8');
const origin=html.match(/rel="canonical" href="([^"]+)"/)[1];
test('production HTML includes content before JavaScript runs',()=>{
 assert.match(html,/<html lang="id">/);assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
 for(const program of programs)assert.ok(html.includes(program.description));
 for(const subject of schedule)assert.ok(html.includes(subject.description));
 for(const [question] of faqs)assert.ok(html.includes(question));
 for(const id of ['main-content','beranda','tentang','program','jadwal','galeri','faq','lokasi','kontak'])assert.ok(html.includes(`id="${id}"`));
 assert.match(html,/https:\/\/wa.me\/62811547999/);
 assert.doesNotMatch(html,/<div id="root"><\/div>|undefined|NaN/);
});
test('canonical, social metadata, sitemap and robots agree',async()=>{
 assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
 assert.ok(html.includes(`property="og:url" content="${origin}"`));
 assert.match(html,/name="robots" content="index,follow,max-image-preview:large"/);
 assert.ok((await readFile('dist/sitemap.xml','utf8')).includes(`<loc>${origin}</loc>`));
 assert.ok((await readFile('dist/robots.txt','utf8')).includes(`Sitemap: ${origin}sitemap.xml`));
 assert.ok(html.includes('Geya Nawasena Nunukan | Bimbel Kedinasan, TNI &amp; Polri'));
});
test('structured data uses real business information',()=>{
 const json=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 const organization=json['@graph'].find(item=>item['@type']==='EducationalOrganization');
 assert.equal(organization.telephone,'+'+contact.whatsapp);assert.equal(organization.url,origin);
 assert.equal(organization.name,seo.name);assert.deepEqual(organization.sameAs,[contact.instagram]);assert.equal(organization.aggregateRating,undefined);
 if(!contact.address)assert.equal(organization.address,undefined);
 assert.equal(json['@graph'].length,3);
});
test('all local assets referenced by prerender exist in output',async()=>{
 for(const match of html.matchAll(/(?:src|href)="(\/[^"#]*)"/g)){
  const path=resolve('dist','.'+decodeURIComponent(match[1].split('?')[0]));
  assert.ok(path.startsWith(resolve('dist')));await access(path);
 }
 assert.match(html,/type="module"/);
 assert.doesNotMatch(html,/\/src\/(main|App)/);
});
test('site configuration supports future domain and rejects invalid origins',()=>{
 assert.equal(resolveSiteUrl('https://www.geya.id'),'https://www.geya.id/');
 for(const value of ['http://example.com','https://example.com/path','https://example.com/?q=a','https://user:pass@example.com'])assert.throws(()=>resolveSiteUrl(value));
 assert.equal(structuredData('https://www.geya.id/',contact)['@graph'][0].url,'https://www.geya.id/');
});
test('initial HTML uses lazy gallery and reserves logo size',()=>{
 assert.match(html,/<img[^>]+width="267"[^>]+height="267"/);
 for(const match of html.matchAll(/<img[^>]+src="https:\/\/images.pexels.com[^>]+>/g))assert.match(match[0],/loading="lazy"/);
 assert.ok(html.includes('DEMO')||html.includes('Demo AI'));
});
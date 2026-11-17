import {test as base,expect} from '@playwright/test';
const test=base.extend({page:async({page},use)=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error'&&/hydration|Minified React error/i.test(message.text()))errors.push(message.text());});
 // External photos are replaced in behavioral tests so network outages cannot mask UI regressions.
 await page.route('https://images.pexels.com/**',route=>route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="#a48c6d"/></svg>'}));
 await page.route('https://fonts.googleapis.com/**',route=>route.fulfill({contentType:'text/css',body:''}));
 await use(page);expect(errors,'No JavaScript or hydration errors').toEqual([]);
}});
const goto=async page=>{await page.goto('/',{waitUntil:'domcontentloaded'});await expect(page.getByRole('switch',{name:'Mode gelap'})).toHaveAttribute('aria-checked','false');};

test('navigation and menu reach the correct section',async({page})=>{
 await goto(page);const menu=page.getByRole('button',{name:/^(Buka|Tutup) menu$/});
 if(await menu.isVisible()){await menu.click();await expect(menu).toHaveAttribute('aria-expanded','true');}
 await page.getByRole('navigation',{name:'Navigasi utama'}).getByRole('link',{name:'Jadwal',exact:true}).click();
 await expect(page).toHaveURL(/#jadwal$/);await expect(page.locator('#jadwal')).toBeInViewport();
 if(await menu.isVisible())await expect(menu).toHaveAttribute('aria-expanded','false');
});
test('program details open, switch and close',async({page})=>{
 await goto(page);const cards=page.locator('.program-card');await cards.nth(0).getByRole('button').click();
 await expect(page.locator('.program-detail-slot:not([hidden])')).toContainText('Persiapan Sekolah Kedinasan');
 await cards.nth(1).getByRole('button').click();await expect(page.locator('.program-detail-slot:not([hidden])')).toContainText('Persiapan TNI');
 await cards.nth(1).getByRole('button').click();await expect(page.locator('.program-detail-slot:not([hidden])')).toHaveCount(0);
});
test('schedule filters show correct sessions and empty day',async({page})=>{
 await goto(page);await expect(page.locator('.subject-card')).toHaveCount(4);
 await page.getByRole('button',{name:'Senin',exact:true}).click();await expect(page.locator('.subject-card')).toHaveCount(2);
 await expect(page.locator('.schedule-result')).toContainText('2 sesi');
 await expect(page.locator('.subject-card li')).toHaveCount(2);
 await page.getByRole('button',{name:'Selasa',exact:true}).click();await expect(page.locator('.subject-card')).toHaveCount(0);await expect(page.locator('.schedule-empty')).toBeVisible();
 await page.getByRole('button',{name:'Tampilkan semua jadwal'}).click();await expect(page.locator('.subject-card li')).toHaveCount(9);
});
test('FAQ answers toggle with correct accessible state',async({page})=>{
 await goto(page);const questions=page.locator('.question');await questions.nth(1).getByRole('button').click();
 await expect(questions.nth(1).getByRole('button')).toHaveAttribute('aria-expanded','true');await expect(questions.nth(0).getByRole('button')).toHaveAttribute('aria-expanded','false');
 await expect(page.locator('#answer-1')).toBeVisible();await questions.nth(1).getByRole('button').click();await expect(page.locator('#answer-1')).toBeHidden();
});
test('poster modal supports close, Escape, backdrop and restores focus',async({page})=>{
 await goto(page);const trigger=page.getByRole('button',{name:'Lihat poster asli'});const modal=page.getByRole('dialog');
 await trigger.click();await expect(modal).toBeVisible();await expect(page.getByRole('button',{name:'Tutup poster'})).toBeFocused();
 await expect(page.locator('body')).toHaveCSS('overflow','hidden');await page.keyboard.press('Escape');await expect(modal).toBeHidden();await expect(trigger).toBeFocused();
 await trigger.click();await page.getByRole('button',{name:'Tutup poster'}).click();await expect(modal).toBeHidden();await expect(page.locator('body')).not.toHaveCSS('overflow','hidden');
 await trigger.click();await page.mouse.click(2,2);await expect(modal).toBeHidden();
});
test('chat supports typing, suggestions, single close and restored focus',async({page})=>{
 await goto(page);const launcher=page.getByRole('button',{name:'Tanya Geya'});await launcher.click();await expect(launcher).toBeHidden();
 const input=page.getByRole('textbox',{name:'Pertanyaan tentang bimbel'});await expect(input).toBeFocused();const send=page.getByRole('button',{name:'Kirim pertanyaan'});await expect(send).toBeDisabled();
 await input.fill('Jadwal matematika');await input.press('Enter');await expect(page.locator('.chat-message').last()).toContainText('Senin 19.30, Rabu 19.30 WITA');await expect(input).toHaveValue('');
 await page.getByRole('button',{name:'Berapa biaya bimbel?'}).click();await expect(page.locator('.chat-message').last()).toContainText('belum tersedia');
 await expect(page.getByRole('button',{name:'Tutup chat',exact:true})).toHaveCount(1);await expect(page.getByRole('link',{name:'Hubungi admin melalui WhatsApp'})).toHaveAttribute('href',/^https:\/\/wa.me\/62811547999\?/);
 await input.focus();await page.keyboard.press('Escape');await expect(page.locator('#geya-chat')).toHaveCount(0);await expect(launcher).toBeFocused();
});
test('chat treats markup as text and limits input length',async({page})=>{
 await goto(page);await page.getByRole('button',{name:'Tanya Geya'}).click();const input=page.locator('#chat-question');
 const markup='<img src=x onerror=alert(1)>';await input.fill(markup);await input.press('Enter');await expect(page.locator('.chat-message.user').last()).toHaveText('Kamu'+markup);await expect(page.locator('.chat-log img')).toHaveCount(0);
 await input.fill('a'.repeat(350));await expect(input).toHaveValue('a'.repeat(300));
});
test('carousel manual controls, thumbnails and reduced motion',async({page})=>{
 await goto(page);await page.locator('#galeri').scrollIntoViewIfNeeded();await expect(page.getByRole('button',{name:'Putar otomatis',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Foto selanjutnya'}).click();await expect(page.locator('.photo-counter')).toContainText('02');
 await page.getByRole('button',{name:'Tampilkan foto 4',exact:true}).click();await expect(page.locator('.photo-counter')).toContainText('04');await expect(page.locator('.pitch-slide').nth(3)).toHaveAttribute('aria-hidden','false');
 await page.getByRole('button',{name:'Foto selanjutnya'}).click();await expect(page.locator('.photo-counter')).toContainText('01');await page.getByRole('button',{name:'Foto sebelumnya'}).click();await expect(page.locator('.photo-counter')).toContainText('04');
});
test('carousel auto advances and pauses when requested',async({page})=>{
 await page.clock.install();await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/',{waitUntil:'domcontentloaded'});
 const pause=page.getByRole('button',{name:'Jeda putar otomatis'});await expect(pause).toBeVisible();await page.clock.fastForward(4600);await expect(page.locator('.photo-counter')).toContainText('02');
 await pause.click();await page.clock.fastForward(9000);await expect(page.locator('.photo-counter')).toContainText('02');
});
test('theme persists across reload and synchronizes tabs',async({page,context})=>{
 await goto(page);const toggle=page.getByRole('switch',{name:'Mode gelap'});await toggle.click();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await page.reload();await expect(toggle).toHaveAttribute('aria-checked','true');
 const tab=await context.newPage();await tab.goto('/');await expect(tab.getByRole('switch',{name:'Mode gelap'})).toHaveAttribute('aria-checked','true');await tab.getByRole('switch',{name:'Mode gelap'}).click();await expect(toggle).toHaveAttribute('aria-checked','false');await tab.close();
});
test('theme follows system until a manual choice',async({page})=>{
 await page.emulateMedia({colorScheme:'dark'});await page.goto('/');await expect(page.getByRole('switch',{name:'Mode gelap'})).toHaveAttribute('aria-checked','true');
 await page.emulateMedia({colorScheme:'light'});await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.getByRole('switch',{name:'Mode gelap'}).click();await page.emulateMedia({colorScheme:'dark'});await page.emulateMedia({colorScheme:'light'});await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
});
test('theme works when browser storage is blocked',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('Blocked');}}));await goto(page);await page.getByRole('switch',{name:'Mode gelap'}).click();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
});
test('footer, gallery and open chat fit viewport in both themes',async({page})=>{
 await goto(page);
 for(const theme of ['light','dark']){
  if(theme==='dark')await page.getByRole('switch',{name:'Mode gelap'}).click();
  for(const selector of ['.site-footer','.photo-carousel']){
   await page.locator(selector).scrollIntoViewIfNeeded();
   const overflow=await page.locator(selector).evaluate(root=>{const r=root.getBoundingClientRect();return [...root.querySelectorAll('*')].filter(e=>getComputedStyle(e).display!=='none'&&!e.closest('[aria-hidden="true"]')).some(e=>{const b=e.getBoundingClientRect();return b.width>0&&(b.left<r.left-1||b.right>r.right+1);});});
   expect(overflow,selector+' has no horizontal overflow').toBe(false);
  }
  await page.getByRole('button',{name:'Tanya Geya'}).click();const box=await page.locator('#geya-chat').boundingBox();const viewport=page.viewportSize();expect(box.x).toBeGreaterThanOrEqual(0);expect(box.y).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(viewport.width+1);expect(box.y+box.height).toBeLessThanOrEqual(viewport.height+1);await page.getByRole('button',{name:'Tutup chat',exact:true}).click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});
test('footer and main contact point to the configured WhatsApp',async({page})=>{
 await goto(page);const links=page.locator('a[href^="https://wa.me/"]');expect(await links.count()).toBeGreaterThanOrEqual(2);for(const link of await links.all())await expect(link).toHaveAttribute('href',/^https:\/\/wa.me\/62811547999\?/);
});
test('program details appear directly below chosen card on phones and below the row on desktop',async({page})=>{
 await goto(page);
 for(const theme of ['light','dark']){
  if(theme==='dark')await page.getByRole('switch',{name:'Mode gelap'}).click();
  for(let index=0;index<3;index++){
   const card=page.locator('.program-card').nth(index);const trigger=card.getByRole('button');
   await trigger.click();const panel=page.locator('#'+await trigger.getAttribute('aria-controls'));
   await expect(panel).toBeVisible();await expect(page.locator('.program-detail-slot:not([hidden])')).toHaveCount(1);
   const placement=await page.evaluate(index=>{
    const cards=[...document.querySelectorAll('.program-card')],card=cards[index],r=card.getBoundingClientRect(),panel=card.nextElementSibling,p=panel.getBoundingClientRect();
    return {viewport:innerWidth,gap:p.top-r.bottom,rowBottom:Math.max(...cards.map(c=>c.getBoundingClientRect().bottom)),panelTop:p.top,nextTop:cards[index+1]?.getBoundingClientRect().top,panelBottom:p.bottom};
   },index);
   if(placement.viewport<=900){expect(placement.gap).toBeGreaterThanOrEqual(0);expect(placement.gap).toBeLessThanOrEqual(24);if(placement.nextTop!==undefined)expect(placement.nextTop).toBeGreaterThanOrEqual(placement.panelBottom);}
   else expect(placement.panelTop).toBeGreaterThanOrEqual(placement.rowBottom);
   await trigger.focus();await page.keyboard.press('Tab');await expect(panel.getByRole('button',{name:'Lihat jadwal kelas'})).toBeFocused();
   await trigger.click();await expect(panel).toBeHidden();
  }
 }
 await page.locator('.program-card').first().getByRole('button').click();
 await page.setViewportSize({width:768,height:900});
 await expect(page.locator('.program-detail-slot:not([hidden])')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('desktop gutters are balanced without excess laptop whitespace',async({page})=>{
 await goto(page);
 const widths=page.viewportSize().width>900?[1024,1280,1366,1440,1920]:[page.viewportSize().width];
 for(const width of widths){
  await page.setViewportSize({width,height:900});
  const spacing=await page.locator('.hero.wrap').evaluate(element=>{const r=element.getBoundingClientRect();return {left:r.left,right:innerWidth-r.right,width:r.width,page:document.documentElement.scrollWidth,viewport:innerWidth};});
  expect(Math.abs(spacing.left-spacing.right)).toBeLessThanOrEqual(1);
  expect(spacing.page).toBeLessThanOrEqual(width);
  if(width>900&&width<=1440){expect(spacing.left).toBeGreaterThanOrEqual(31);expect(spacing.right).toBeLessThanOrEqual(40);}
  if(width<=900)expect(spacing.left).toBe(width<=380?16:20);
 }
});
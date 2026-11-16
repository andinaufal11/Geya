export const seo = {
 name:'Geya Nawasena Nunukan',
 title:'Geya Nawasena Nunukan | Bimbel Kedinasan, TNI & Polri',
 description:'Bimbel persiapan Sekolah Kedinasan, TNI, dan Polri di Nunukan, Kalimantan Utara. Kenali program, jadwal kelas AK8, dan konsultasi melalui WhatsApp.',
 defaultUrl:'https://geya.vercel.app/'
};
export function resolveSiteUrl(value=seo.defaultUrl){
 const url=new URL(value);
 if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||url.pathname!=='/')throw new Error('SITE_URL harus berupa origin HTTPS, misalnya https://geya.vercel.app');
 return url.href;
}
export function structuredData(siteUrl,contact){
 return {'@context':'https://schema.org','@graph':[
  {'@type':'EducationalOrganization','@id':siteUrl+'#organization',name:seo.name,description:seo.description,url:siteUrl,logo:siteUrl+'assets/logo.jpeg',telephone:'+'+contact.whatsapp,areaServed:{'@type':'AdministrativeArea',name:'Nunukan, Kalimantan Utara, Indonesia'},contactPoint:{'@type':'ContactPoint',telephone:'+'+contact.whatsapp,contactType:'Informasi program dan pendaftaran',availableLanguage:'Indonesian',url:'https://wa.me/'+contact.whatsapp},...(contact.address?{address:{'@type':'PostalAddress',streetAddress:contact.address,addressLocality:'Nunukan',addressRegion:'Kalimantan Utara',addressCountry:'ID'}}:{})},
  {'@type':'WebSite','@id':siteUrl+'#website',url:siteUrl,name:seo.name,inLanguage:'id-ID',publisher:{'@id':siteUrl+'#organization'}},
  {'@type':'WebPage','@id':siteUrl+'#webpage',url:siteUrl,name:seo.title,description:seo.description,inLanguage:'id-ID',isPartOf:{'@id':siteUrl+'#website'},about:{'@id':siteUrl+'#organization'}}
 ]};
}
'use strict';
const header=document.querySelector('.site-header');
const menu=document.querySelector('#mobile-menu');
const toggle=document.querySelector('.menu-toggle');
const main=document.querySelector('main');
const footer=document.querySelector('.site-footer');
const instagram=document.querySelector('.instagram-float');
const serviceMenu=document.querySelector('.nav-services');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');

let menuOpen=false;
function setMenu(open){
 menuOpen=open;menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Stäng meny':'Öppna meny');
 document.body.classList.toggle('menu-open',open);document.body.classList.toggle('locked',open);
 main.inert=open;footer.inert=open;instagram.inert=open;
 if(open){serviceMenu.open=false;menu.querySelector('a').focus();}else{toggle.focus();}
}
toggle.addEventListener('click',()=>setMenu(!menuOpen));
menu.addEventListener('click',event=>{if(event.target.closest('a'))setMenu(false)});
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'){if(menuOpen)setMenu(false);serviceMenu.open=false;}
 if(menuOpen&&event.key==='Tab'){
  const items=[toggle,...menu.querySelectorAll('a')];const first=items[0],last=items.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 }
});
document.addEventListener('click',event=>{if(!serviceMenu.contains(event.target))serviceMenu.open=false});
addEventListener('resize',()=>{if(innerWidth>767&&menuOpen)setMenu(false)},{passive:true});
let scrollTick=false;
addEventListener('scroll',()=>{if(!scrollTick){requestAnimationFrame(()=>{header.classList.toggle('scrolled',scrollY>100);scrollTick=false;});scrollTick=true;}},{passive:true});
header.classList.toggle('scrolled',scrollY>100);

let instagramDismissed=false;
try{instagramDismissed=sessionStorage.getItem('livingin-instagram-dismissed')==='1'}catch{}
instagram.hidden=instagramDismissed;
instagram.querySelector('button').addEventListener('click',()=>{
 instagramDismissed=true;instagram.hidden=true;
 try{sessionStorage.setItem('livingin-instagram-dismissed','1')}catch{}
});
new IntersectionObserver(entries=>{instagram.hidden=instagramDismissed||entries[0].isIntersecting},{threshold:0.08}).observe(footer);

const servicePreview=document.querySelector('.service-preview');
if(servicePreview){
 document.querySelectorAll('[data-service-photo]').forEach(link=>{
  const show=()=>{if(matchMedia('(min-width:768px)').matches){servicePreview.removeAttribute('srcset');servicePreview.src=link.dataset.servicePhoto;servicePreview.alt=link.dataset.serviceAlt;}};
  link.addEventListener('pointerenter',show);link.addEventListener('focus',show);
 });
}

document.querySelectorAll('.comparison input').forEach(input=>{
 input.addEventListener('input',()=>{input.closest('.comparison').style.setProperty('--split',input.value+'%');input.setAttribute('aria-valuetext',(100-Number(input.value))+' procent efterbild')});
});

const filterButtons=[...document.querySelectorAll('[data-filter]')];
filterButtons.forEach(button=>button.addEventListener('click',()=>{
 let visible=0;
 document.querySelectorAll('.gallery-item').forEach(item=>{item.hidden=button.dataset.filter!=='alla'&&item.dataset.category!==button.dataset.filter;if(!item.hidden)visible++});
 filterButtons.forEach(other=>{const active=other===button;other.classList.toggle('active',active);other.setAttribute('aria-pressed',String(active))});
 document.querySelector('.gallery-status').textContent=visible+' bilder visas.';
}));

const dialog=document.querySelector('#photo-dialog');
const dialogImage=document.querySelector('#photo-image');
const dialogCaption=document.querySelector('#photo-caption');
const dialogCount=document.querySelector('#photo-count');
let gallery=[],current=0,opener=null;
function renderPhoto(){const item=gallery[current];dialogImage.src=item.dataset.full;dialogImage.alt=item.dataset.caption;dialogCaption.textContent=item.dataset.caption;dialogCount.textContent=(current+1)+' / '+gallery.length;}
function stepPhoto(step){current=(current+step+gallery.length)%gallery.length;renderPhoto()}
document.querySelectorAll('.photo-open').forEach(button=>button.addEventListener('click',()=>{
 gallery=[...document.querySelectorAll('.photo-open')].filter(item=>!item.closest('[hidden]'));
 current=gallery.indexOf(button);opener=button;renderPhoto();dialog.showModal();document.body.classList.add('locked');instagram.inert=true;
}));
document.querySelector('#photo-close').addEventListener('click',()=>dialog.close());
document.querySelector('#photo-next').addEventListener('click',()=>stepPhoto(1));
document.querySelector('#photo-prev').addEventListener('click',()=>stepPhoto(-1));
dialog.addEventListener('close',()=>{document.body.classList.remove('locked');instagram.inert=false;opener?.focus({preventScroll:true})});
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close()}});
dialog.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();stepPhoto(1)}if(event.key==='ArrowLeft'){event.preventDefault();stepPhoto(-1)}});
let swipe=null;
dialogImage.addEventListener('touchstart',event=>{swipe=event.touches.length===1?{x:event.touches[0].clientX,y:event.touches[0].clientY}:null},{passive:true});
dialogImage.addEventListener('touchmove',event=>{if(event.touches.length!==1)swipe=null},{passive:true});
dialogImage.addEventListener('touchcancel',()=>{swipe=null},{passive:true});
dialogImage.addEventListener('touchend',event=>{if(swipe&&event.changedTouches.length===1&&event.touches.length===0&&(window.visualViewport?.scale??1)<=1){const dx=event.changedTouches[0].clientX-swipe.x,dy=event.changedTouches[0].clientY-swipe.y;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)stepPhoto(dx<0?1:-1)}swipe=null},{passive:true});

const form=document.querySelector('#contact-form');
form?.addEventListener('submit',event=>{
 event.preventDefault();if(!form.reportValidity())return;
 const values=new FormData(form);
 const body='Hej LivingIn!\n\n'+values.get('message')+'\n\nJag vill ha hjälp med: '+values.get('service')+'\nNamn: '+values.get('name')+'\nE-post: '+values.get('email')+'\nTelefon: '+(values.get('phone')||'Ej angivet');
 const url='mailto:info@livingin.se?subject='+encodeURIComponent('Förfrågan: '+values.get('service'))+'&body='+encodeURIComponent(body);
 location.href=url;
 form.querySelector('.form-status').textContent='Skicka mejlet från ditt e-postprogram. Om det inte öppnades kan du mejla direkt till info@livingin.se.';
});

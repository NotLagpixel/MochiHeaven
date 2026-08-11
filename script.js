document.querySelectorAll('[data-order]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();alert("Replace this with Mochi Heaven's real online ordering link.");}));
const t=document.querySelector('.mobile-toggle'),n=document.querySelector('.page-nav');if(t&&n)t.addEventListener('click',()=>n.classList.toggle('open'));
if(location.hash){requestAnimationFrame(()=>{const x=document.querySelector(location.hash);if(x)setTimeout(()=>x.scrollIntoView({behavior:'smooth',block:'start'}),120);});}

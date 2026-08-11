const filters=document.querySelectorAll(".filter");
const cards=document.querySelectorAll(".menu-card");

filters.forEach(btn=>{
  btn.addEventListener("click",()=>{
    filters.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const f=btn.dataset.filter;
    cards.forEach(card=>{
      card.style.display=(f==="all"||card.dataset.category===f)?"block":"none";
    });
  });
});

const toggle=document.querySelector(".menu-toggle");
const nav=document.querySelector(".nav-links");
toggle.addEventListener("click",()=>{
  const open=nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded",String(open));
});

document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

const menuData={
  donuts:{title:"Mochi Donuts",items:[["Single Mochi Donut","$0.00"],["Half Dozen","$0.00"],["Dozen","$0.00"]]},
  boba:{title:"Boba Drinks",items:[["Milk Tea","$0.00"],["Fruit Tea","$0.00"],["Mango Slushy","$0.00"],["Passionfruit Pineapple","$0.00"]]},
  icecream:{title:"Ice Cream",items:[["1 Scoop","$0.00"],["2 Scoops","$0.00"],["3 Scoops","$0.00"],["Sundaes & Shakes","$0.00"]]},
  ricedogs:{title:"Korean Rice Dogs",items:[["Classic Rice Dog","$0.00"],["Potato Rice Dog","$0.00"],["Cheetos Rice Dog","$0.00"]]}
};

const modal=document.getElementById("menuModal");
const title=document.getElementById("modalTitle");
const items=document.getElementById("modalItems");

document.querySelectorAll(".view-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const data=menuData[btn.dataset.menu];
    title.textContent=data.title;
    items.innerHTML=data.items.map(x=>`<div class="modal-row"><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join("");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    document.body.style.overflow="hidden";
  });
});

function closeModal(){
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
  document.body.style.overflow="";
}
document.querySelectorAll("[data-close]").forEach(x=>x.addEventListener("click",closeModal));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});

document.getElementById("startOrder").addEventListener("click",()=>{
  alert("Replace this with your real Mochi Heaven ordering link.");
});

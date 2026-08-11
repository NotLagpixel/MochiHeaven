const menuData = {
  donuts: {
    title: "Mochi Donuts",
    items: [["Single Mochi Donut","$0.00"],["Half Dozen","$0.00"],["Dozen","$0.00"]]
  },
  boba: {
    title: "Boba Drinks",
    items: [["Milk Tea","$0.00"],["Fruit Tea","$0.00"],["Mango Slushy","$0.00"],["Passionfruit Pineapple","$0.00"]]
  },
  icecream: {
    title: "Ice Cream",
    items: [["1 Scoop","$0.00"],["2 Scoops","$0.00"],["3 Scoops","$0.00"],["Sundaes & Shakes","$0.00"]]
  },
  ricedogs: {
    title: "Korean Rice Dogs",
    items: [["Classic Rice Dog","$0.00"],["Potato Rice Dog","$0.00"],["Cheetos Rice Dog","$0.00"]]
  }
};

const modal = document.getElementById("menuModal");
const title = document.getElementById("modalTitle");
const items = document.getElementById("modalItems");

function openMenu(type) {
  const data = menuData[type];
  title.textContent = data.title;
  items.innerHTML = data.items.map(item =>
    `<div class="modal-row"><strong>${item[0]}</strong><span>${item[1]}</span></div>`
  ).join("");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
}

document.querySelectorAll("[data-menu]").forEach(btn => {
  btn.addEventListener("click", () => openMenu(btn.dataset.menu));
});

document.querySelectorAll("[data-category]").forEach(btn => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.category;
    if (category === "all") {
      document.getElementById("menu-info").scrollIntoView({behavior:"smooth"});
    } else {
      openMenu(category);
    }
  });
});

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closeModal));
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

document.getElementById("startOrder").addEventListener("click", () => {
  alert("Replace this with Mochi Heaven's real online ordering link.");
});

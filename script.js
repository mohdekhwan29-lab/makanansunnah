// ====== Tetapan kedai ======
// Tukar nombor ini kepada nombor WhatsApp kedai anda (format antarabangsa, tanpa + atau sengkang)
const WHATSAPP_NUMBER = "60123456789";
const FREE_SHIPPING = 150;

// ====== Senarai produk ======
const PRODUCTS = [
  { id: "ajwa", name: "Kurma Ajwa Madinah", cat: "kurma", catLabel: "Kurma", price: 65, unit: "500g", img: "images/kurma.svg", tag: "Terlaris",
    desc: "Kurma Ajwa asli dari Madinah. Lembut, kurang manis dan kaya dengan khasiat.", ref: "Kurma kegemaran Rasulullah ﷺ" },
  { id: "medjool", name: "Kurma Medjool Premium", cat: "kurma", catLabel: "Kurma", price: 55, unit: "1kg", img: "images/kurma.svg",
    desc: "Saiz besar, isi tebal dan manis seperti karamel. Sesuai untuk berbuka puasa.", ref: "Sunnah berbuka dengan kurma" },
  { id: "sidr", name: "Madu Sidr Yaman", cat: "madu", catLabel: "Madu", price: 120, unit: "250g", img: "images/madu.jpg", tag: "Premium",
    desc: "Madu Sidr tulen dari Hadhramaut, Yaman. Pekat, wangi dan berkualiti tinggi.", ref: "Surah An-Nahl: 69" },
  { id: "kelulut", name: "Madu Asli Hutan", cat: "madu", catLabel: "Madu", price: 45, unit: "500g", img: "images/madu2.jpg",
    desc: "Madu hutan tempatan yang mentah dan tidak dipanaskan. Manis semula jadi.", ref: "Minuman kegemaran Nabi ﷺ" },
  { id: "habbatus", name: "Habbatussauda", cat: "herba", catLabel: "Herba", price: 18, unit: "250g", img: "images/habbatus.svg", tag: "Pilihan",
    desc: "Biji jintan hitam (Nigella sativa) yang bersih. Boleh dimakan terus atau dicampur dalam masakan.", ref: "Penawar segala penyakit kecuali mati" },
  { id: "talbinah", name: "Talbinah Barli", cat: "herba", catLabel: "Bijirin", price: 25, unit: "500g", img: "images/talbinah.jpg",
    desc: "Tepung barli halus untuk dibuat bubur talbinah bersama susu dan madu.", ref: "Melegakan hati yang sedih" },
  { id: "tin", name: "Buah Tin Kering", cat: "buah", catLabel: "Buah", price: 28, unit: "250g", img: "images/tin.svg",
    desc: "Buah tin kering dari Turki. Lembut, manis dan tinggi serat.", ref: "Surah At-Tin: 1" },
  { id: "delima", name: "Jus Delima Asli", cat: "buah", catLabel: "Buah", price: 32, unit: "1L", img: "images/delima.jpg", tag: "Baru",
    desc: "Jus delima 100% asli tanpa gula tambahan. Segar dan kaya antioksidan.", ref: "Surah Ar-Rahman: 68" },
  { id: "labu", name: "Labu Manis Organik", cat: "buah", catLabel: "Sayur", price: 12, unit: "1kg", img: "images/labu.jpg",
    desc: "Labu manis organik dari ladang tempatan. Sedap untuk bubur dan masak lemak.", ref: "Rasulullah ﷺ gemar labu (HR Bukhari)" },
  { id: "zaitun", name: "Minyak Zaitun Extra Virgin", cat: "minuman", catLabel: "Minyak", price: 38, unit: "500ml", img: "images/zaitun.jpg",
    desc: "Minyak zaitun perahan sejuk pertama. Untuk dimakan, dimasak dan disapu.", ref: "Daripada pokok yang diberkati" },
  { id: "susu", name: "Susu Kambing Segar", cat: "minuman", catLabel: "Minuman", price: 22, unit: "1L", img: "images/susu.jpg",
    desc: "Susu kambing segar dari ladang tempatan. Dipasteur, berkrim dan berkhasiat.", ref: "Surah An-Nahl: 66" },
];
const EXTRA = {
  hamper: { id: "hamper", name: "Hamper Sunnah Keluarga", price: 239, unit: "1 set", img: "images/delima.jpg" },
};
const findProduct = (id) => PRODUCTS.find((p) => p.id === id) || EXTRA[id];

const $ = (s) => document.querySelector(s);
const rm = (n) => "RM " + n.toFixed(2);

// ====== Paparan produk ======
const grid = $("#productGrid");
function renderProducts(cat = "semua") {
  const list = cat === "semua" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === cat);
  grid.innerHTML = list.map((p, i) => `
    <article class="card" style="animation-delay:${i * 60}ms">
      <div class="card-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        ${p.tag ? `<span class="tag">${p.tag}</span>` : ""}
      </div>
      <div class="card-body">
        <span class="card-cat">${p.catLabel}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <span class="card-ref">❝ ${p.ref}</span>
        <div class="card-foot">
          <span class="price">${rm(p.price)} <small>/ ${p.unit}</small></span>
          <button class="add" data-add="${p.id}" aria-label="Tambah ${p.name}">+</button>
        </div>
      </div>
    </article>`).join("");
}
renderProducts();

$("#filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
  btn.classList.add("active");
  renderProducts(btn.dataset.cat);
});

// ====== Troli ======
let cart = {};
try { cart = JSON.parse(localStorage.getItem("ws-cart")) || {}; } catch (_) { cart = {}; }
const save = () => { try { localStorage.setItem("ws-cart", JSON.stringify(cart)); } catch (_) {} };

function addToCart(id) {
  if (!findProduct(id)) return;
  cart[id] = (cart[id] || 0) + 1;
  save(); renderCart();
  const c = $("#cartCount");
  c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
  toast(`✓ ${findProduct(id).name} ditambah ke troli`);
}

function changeQty(id, d) {
  cart[id] = (cart[id] || 0) + d;
  if (cart[id] <= 0) delete cart[id];
  save(); renderCart();
}

function cartTotal() {
  return Object.entries(cart).reduce((s, [id, q]) => s + findProduct(id).price * q, 0);
}

function renderCart() {
  const entries = Object.entries(cart).filter(([id]) => findProduct(id));
  $("#cartCount").textContent = entries.reduce((s, [, q]) => s + q, 0);
  const body = $("#cartItems");
  if (!entries.length) {
    body.innerHTML = `<div class="empty"><span>🧺</span>Troli anda masih kosong.<br>Jom pilih makanan sunnah!</div>`;
  } else {
    body.innerHTML = entries.map(([id, q]) => {
      const p = findProduct(id);
      return `<div class="ci">
        <img src="${p.img}" alt="${p.name}" />
        <div><h4>${p.name}</h4><span class="ci-price">${rm(p.price)} · ${p.unit}</span></div>
        <div class="qty"><button data-q="${id}" data-d="-1">−</button><span>${q}</span><button data-q="${id}" data-d="1">+</button></div>
      </div>`;
    }).join("");
  }
  const total = cartTotal();
  $("#cartTotal").textContent = rm(total);
  $("#shipNote").textContent = !entries.length ? "" : total >= FREE_SHIPPING
    ? "🎉 Tahniah! Anda layak penghantaran percuma."
    : `Tambah ${rm(FREE_SHIPPING - total)} lagi untuk penghantaran percuma.`;
}
renderCart();

document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) addToCart(add.dataset.add);
  const q = e.target.closest("[data-q]");
  if (q) changeQty(q.dataset.q, Number(q.dataset.d));
});

const drawer = $("#drawer"), overlay = $("#overlay");
const openCart = () => { drawer.classList.add("open"); overlay.classList.add("show"); };
const closeCart = () => { drawer.classList.remove("open"); overlay.classList.remove("show"); };
$("#cartBtn").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", () => { closeCart(); closeMenu(); });

const waLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
$("#waFloat").href = waLink("Assalamualaikum, saya berminat dengan produk makanan sunnah.");

$("#checkout").addEventListener("click", () => {
  const entries = Object.entries(cart);
  if (!entries.length) return toast("Troli anda masih kosong");
  const lines = entries.map(([id, q], i) => {
    const p = findProduct(id);
    return `${i + 1}. ${p.name} (${p.unit}) x${q} = ${rm(p.price * q)}`;
  });
  const total = cartTotal();
  const msg = `Assalamualaikum, saya ingin membuat tempahan:\n\n${lines.join("\n")}\n\nJumlah: ${rm(total)}${total >= FREE_SHIPPING ? " (Penghantaran percuma)" : ""}\n\nNama:\nAlamat:\nNo. Telefon:`;
  window.open(waLink(msg), "_blank");
});

$("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const msg = `Assalamualaikum, saya ${f.get("nama")} (${f.get("telefon")}).\n\n${f.get("mesej")}`;
  window.open(waLink(msg), "_blank");
  e.target.reset();
});

// ====== Toast ======
let tt;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2200);
}

// ====== Nav ======
const nav = $("#nav"), links = $("#navLinks"), burger = $("#burger");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll); onScroll();
function closeMenu() { links.classList.remove("open"); burger.classList.remove("x"); }
burger.addEventListener("click", () => { links.classList.toggle("open"); burger.classList.toggle("x"); });
links.addEventListener("click", (e) => { if (e.target.tagName === "A") closeMenu(); });

// ====== Animasi muncul ======
const io = new IntersectionObserver((ents) => ents.forEach((en) => {
  if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
}), { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

$("#year").textContent = new Date().getFullYear();

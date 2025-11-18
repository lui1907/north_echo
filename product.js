<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Product — North Echo</title>

<link rel="stylesheet" href="style.css" />

<!-- JS -->
<script src="menu.js" defer></script>
<script src="theme.js" defer></script>
<script src="cart.js" defer></script>

<style>
body {
  background:#000;
  color:white;
  font-family:'Poppins',sans-serif;
}

/* ÜRÜN SAYFA DÜZENİ */
.product-page {
  max-width:1150px;
  margin:120px auto 80px;
  display:flex;
  gap:60px;
  justify-content:center;
  align-items:flex-start;
}

.product-left {
  width:480px;
}

.product-main-img {
  width:100%;
  border-radius:12px;
  object-fit:cover;
}

.thumb-row {
  display:flex;
  gap:12px;
  margin-top:12px;
}

.thumb-row img {
  width:95px;
  height:95px;
  border-radius:8px;
  cursor:pointer;
  border:2px solid transparent;
  object-fit:cover;
}
.thumb-row img.active {
  border-color:#00ff99;
}

.product-right {
  width:400px;
}

.product-right h1 {
  font-size:1.6rem;
  margin-bottom:8px;
}

.product-price {
  color:#00ff99;
  font-weight:bold;
  margin-bottom:10px;
}

/* Açıklama */
.product-desc {
  color:#ccc;
  font-size:.9rem;
  margin-bottom:20px;
}

/* Size Buttons */
.size-buttons {
  display:flex;
  gap:10px;
  margin:10px 0 25px;
}

.size-btn {
  border:1px solid #444;
  padding:7px 15px;
  border-radius:6px;
  cursor:pointer;
}
.size-btn.active {
  background:#00aa66;
  border-color:#00ff99;
  color:white;
}

/* Add to Cart */
.add-btn {
  width:100%;
  padding:12px;
  border-radius:6px;
  cursor:pointer;
  background:white;
  color:black;
  font-weight:bold;
  border:none;
  transition:.2s;
}
.add-btn:hover {
  background:#ddd;
}

/* Add to cart popup */
.cart-popup {
  position:fixed;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%) scale(.8);
  background:#111;
  border:1px solid #00aa66;
  padding:18px 28px;
  color:#00ff99;
  border-radius:10px;
  opacity:0;
  transition:.25s;
  z-index:99999;
}
.cart-popup.show {
  opacity:1;
  transform:translate(-50%,-50%) scale(1);
}
</style>
</head>

<body>

<!-- HEADER -->
<header class="header">
  <div class="hamburger" id="menuBtn">☰</div>
  <a href="index.html" class="logo">NORTH ECHO</a>

  <div class="right-buttons">
    <a href="cart.html" class="cart-icon">🛒 <span id="cartCount">0</span></a>

    <img src="assets/default-avatar.png" class="avatar" id="userAvatar">

    <div class="avatar-menu" id="avatarMenu">
      <a href="profile.html">Profile</a>
      <a href="settings.html">Settings</a>
      <a class="logout" style="color:#ff4444;">Logout</a>
    </div>
  </div>
</header>

<!-- SIDE MENU -->
<div class="side-menu" id="sideMenu">
  <button id="closeMenu" class="close-menu">×</button>
  <a href="index.html">Home</a>
  <a href="tshirts.html">T-Shirts</a>
  <a href="sweatshirts.html">Sweatshirts</a>
  <a href="cart.html">Cart</a>
</div>

<!-- PRODUCT SECTION -->
<div class="product-page">

  <!-- LEFT -->
  <div class="product-left">
    <img id="mainImg" class="product-main-img" src="">

    <div class="thumb-row" id="thumbRow"></div>
  </div>

  <!-- RIGHT -->
  <div class="product-right">
    <h1 id="pName">Loading...</h1>
    <div class="product-price" id="pPrice"></div>

    <div class="product-desc" id="pDesc"></div>

    <label>Size</label>
    <div class="size-buttons">
      <div class="size-btn" data-size="S">S</div>
      <div class="size-btn" data-size="M">M</div>
      <div class="size-btn" data-size="L">L</div>
      <div class="size-btn" data-size="XL">XL</div>
    </div>

    <button class="add-btn" id="addCartBtn">Add to Cart</button>
  </div>

</div>

<!-- ADD TO CART POPUP -->
<div id="cartPopup" class="cart-popup">Added to cart ✓</div>

<!-- SUPPORT BUTTON -->
<div id="supportBtn">
  <img src="assets/support.svg" style="width:26px;height:26px;">
</div>

<!-- SUPPORT PANEL -->
<div id="supportPanel">
  <div class="sup-header">
    <span>Support</span>
    <button id="closeSupport">✕</button>
  </div>

  <div class="sup-body">
    <label>Your Name *</label>
    <input type="text" id="supName">

    <label>Email *</label>
    <input type="email" id="supEmail">

    <label>Category *</label>
    <select id="supCategory">
      <option value="Website">Website Issue</option>
      <option value="Product">Product Info</option>
      <option value="Design">Design Request</option>
      <option value="Other">Other</option>
    </select>

    <label>Your Message *</label>
    <textarea id="supMsg"></textarea>

    <label>Attach File</label>
    <input type="file" id="supFile">

    <button class="sup-send" id="sendSupportBtn">Send Message →</button>
  </div>
</div>

<!-- SUPABASE PRODUCT LOGIC -->
<script type="module">
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://xedfviwffpsvbmyqzoof.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM"
);

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

async function loadProduct(){
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (!data) return;

  document.getElementById("pName").textContent = data.name;
  document.getElementById("pPrice").textContent = data.price + "€";
  document.getElementById("pDesc").textContent = data.description || "";

  let imgs = data.images ? data.images.split(",") : [];
  document.getElementById("mainImg").src = imgs[0];

  const thumbRow = document.getElementById("thumbRow");
  thumbRow.innerHTML = "";

  imgs.forEach((src,i)=>{
    const t = document.createElement("img");
    t.src = src;
    if(i===0) t.classList.add("active");
    t.onclick = ()=>{
      document.getElementById("mainImg").src = src;
      document.querySelectorAll(".thumb-row img").forEach(a=>a.classList.remove("active"));
      t.classList.add("active");
    };
    thumbRow.appendChild(t);
  });
}

loadProduct();

/* ====== ADD TO CART POPUP ====== */
document.getElementById("addCartBtn").onclick = ()=>{
  const pop = document.getElementById("cartPopup");
  pop.classList.add("show");
  setTimeout(()=>pop.classList.remove("show"),1500);
};
</script>

<!-- SUPPORT OPEN/CLOSE -->
<script>
let supportBtn=document.getElementById("supportBtn");
let supportPanel=document.getElementById("supportPanel");
let closeSupport=document.getElementById("closeSupport");

supportBtn.onclick=()=>supportPanel.style.display=
  supportPanel.style.display==="block"?"none":"block";

closeSupport.onclick=()=>supportPanel.style.display="none";
</script>

<!-- PROFILE MENU -->
<script>
const avatar=document.getElementById("userAvatar");
const menu=document.getElementById("avatarMenu");

if(avatar){
  avatar.addEventListener("click",(e)=>{
    e.stopPropagation();
    menu.style.display = (menu.style.display==="flex") ? "none" : "flex";
  });
}

document.addEventListener("click",(e)=>{
  if(menu && !menu.contains(e.target)){
    menu.style.display="none";
  }
});
</script>

</body>
</html>

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ADMINS = ["luivoss", "fisami"];
const loggedUser = localStorage.getItem("loggedInUser");
if (!loggedUser || !ADMINS.includes(loggedUser.toLowerCase())) window.location.href = "index.html";

const msgContainer = document.getElementById("adminMessages");
const filterSelect = document.getElementById("filterCategory");
const confirmPopup = document.getElementById("confirmPopup");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
const confirmText = document.getElementById("confirmText");

let allMessages = [];
let deleteTarget = null;

// 🚀 İlk açılış
loadMessages();

filterSelect.onchange = renderMessages;

// 💬 MESAJLARI YÜKLE
async function loadMessages() {
  msgContainer.innerHTML = "<p>Loading...</p>";
  const { data, error } = await supabase.from("messages").select("*");
  if (error) {
    msgContainer.innerHTML = "<p>Error loading messages ❌</p>";
    console.error(error);
    return;
  }
  allMessages = data;
  renderMessages();
}

// 🔄 MESAJLARI GÖRÜNTÜLE
function renderMessages() {
  msgContainer.innerHTML = "";
  const cat = filterSelect.value;
  let list = cat === "All" ? allMessages : allMessages.filter(m => m.category === cat);

  if (!list.length) {
    msgContainer.innerHTML = "<p>No messages found.</p>";
    return;
  }

  list.forEach(msg => {
    msgContainer.insertAdjacentHTML("beforeend", `
      <div class="msg-box" id="msg-${msg.id}">
        <div class="msg-top">
          <div>
            <div class="msg-sender">${msg.name}</div>
            <div class="msg-email">${msg.email}</div>
            <div class="msg-category">${msg.category}</div>
            <div class="msg-date">${msg.date || ""}</div>
          </div>
          <button class="msg-delete" data-id="${msg.id}" style="background:#400;border:1px solid #600;color:#ff6666;border-radius:8px;padding:6px 12px;cursor:pointer;">Delete</button>
        </div>
        <div class="msg-text">${msg.message}</div>
        ${msg.file ? `<img src="${msg.file}" class="msg-img" data-url="${msg.file}" />` : ""}
      </div>
    `);
  });

  bindEvents();
}

// 🖱️ EVENTLER
function bindEvents() {
  document.querySelectorAll(".msg-delete").forEach(btn => {
    btn.onclick = () => openConfirmPopup(btn.dataset.id);
  });
  document.querySelectorAll(".msg-img").forEach(img => {
    img.onclick = () => openImage(img.dataset.url);
  });
}

// ⚡ SİLME ONAY POPUP
function openConfirmPopup(id) {
  deleteTarget = id;
  confirmText.textContent = "Delete this message?";
  confirmPopup.classList.add("show");
}

confirmYes.onclick = async () => {
  if (!deleteTarget) return;
  confirmPopup.classList.remove("show");
  const { error } = await supabase.from("messages").delete().eq("id", deleteTarget);
  if (error) {
    showToast("Delete failed ❌", "error");
  } else {
    allMessages = allMessages.filter(m => String(m.id) !== String(deleteTarget));
    renderMessages();
    showToast("Deleted permanently ✅", "success");
  }
};
confirmNo.onclick = () => confirmPopup.classList.remove("show");

// 🖼️ FOTO BÜYÜTME
window.openImage = (url) => {
  document.getElementById("imgModalContent").src = url;
  document.getElementById("imgModal").style.display = "flex";
};
document.getElementById("imgModalClose").onclick = () => {
  document.getElementById("imgModal").style.display = "none";
};

// 🧭 SEKME GEÇİŞLERİ
window.showTab = function(tab) {
  document.querySelectorAll(".admin-item").forEach(x => x.classList.remove("active"));
  event.target.classList.add("active");
  const content = document.getElementById("adminContent");
  if (tab === "messages") {
    content.innerHTML = `<h2>Messages</h2><div class="admin-toolbar">
      <select id="filterCategory">
        <option>All</option><option>Product</option><option>Order</option>
        <option>Design</option><option>Other</option>
      </select></div><div id="adminMessages"></div>`;
    loadMessages();
  }
  if (tab === "addProduct") loadAddProduct(content);
};

// 🛍️ ÜRÜN EKLEME
function loadAddProduct(content) {
  content.innerHTML = `
    <h2>Add Product</h2>
    <input id="prodName" class="input-box" placeholder="Product Name">
    <input id="prodPrice" class="input-box" type="number" placeholder="Price (€)">
    <input id="prodCategory" class="input-box" placeholder="Category">
    <textarea id="prodDesc" class="input-box" placeholder="Description"></textarea>
    <input id="prodImages" class="input-box" placeholder="Image URLs (comma separated)">
    <input id="prodSizes" class="input-box" placeholder="Sizes (S,M,L,XL)">
    <button id="saveProductBtn" style="background:#00aa66;padding:10px;border:none;color:#fff;border-radius:8px;">Save Product</button>
  `;
  document.getElementById("saveProductBtn").onclick = saveProduct;
}

// 💾 ÜRÜN KAYDET
async function saveProduct() {
  const name = document.getElementById("prodName").value.trim();
  const price = parseFloat(document.getElementById("prodPrice").value);
  const category = document.getElementById("prodCategory").value.trim();
  const description = document.getElementById("prodDesc").value.trim();
  const images = document.getElementById("prodImages").value.trim();
  const sizes = document.getElementById("prodSizes").value.trim();
  if (!name || !price || !category || !images) return showToast("Fill required fields ❌", "error");

  const { error } = await supabase.from("products").insert([{ name, price, category, description, images, sizes }]);
  if (error) {
    showToast("Error saving product ❌", "error");
  } else {
    showToast("Product added ✅", "success");
    document.querySelectorAll(".input-box").forEach(i => i.value = "");
  }
}

// 🔔 TOAST
function showToast(msg, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 2000);
}

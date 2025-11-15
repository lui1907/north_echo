// admin.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🔐 Admin kontrol
const ADMINS = ["luivoss", "fisami"];
const loggedUser = localStorage.getItem("loggedInUser");

if (!loggedUser || !ADMINS.includes(loggedUser.toLowerCase())) {
  window.location.href = "index.html";
}

// ---- Menü elemanları ----
const menuProducts = document.getElementById("menuProducts");
const menuMessages = document.getElementById("menuMessages");
const sectionProducts = document.getElementById("sectionProducts");
const sectionMessages = document.getElementById("sectionMessages");

// Menü geçişleri
menuProducts.onclick = () => {
  sectionProducts.style.display = "block";
  sectionMessages.style.display = "none";
  menuProducts.classList.add("active");
  menuMessages.classList.remove("active");
  loadProducts();
};

menuMessages.onclick = () => {
  sectionProducts.style.display = "none";
  sectionMessages.style.display = "block";
  menuMessages.classList.add("active");
  menuProducts.classList.remove("active");
  loadMessages();
};

// ---- PRODUCT EKLEME ----
document.getElementById("btnAddProduct").onclick = async () => {
  const name = document.getElementById("pName").value.trim();
  const price = parseFloat(document.getElementById("pPrice").value);
  const category = document.getElementById("pCategory").value.trim();
  const description = document.getElementById("pDescription").value.trim();
  const images = document.getElementById("pImages").value.trim();
  const sizes = document.getElementById("pSizes").value.trim();

  if (!name || !price || !category || !description || !images) {
    showToast("Please fill all fields ❌", "error");
    return;
  }

  const { error } = await supabase.from("products").insert([
    { name, price, category, description, images, sizes }
  ]);

  if (error) {
    console.error(error);
    showToast("Error adding product ❌", "error");
  } else {
    showToast("Product added ✅", "success");
    loadProducts();
  }
};

// ---- REFRESH butonlarını global yap ----
window.refreshProducts = () => loadProducts();
window.refreshMessages = () => loadMessages();

// ---- PRODUCTS LİSTE ----
async function loadProducts() {
  const container = document.getElementById("productsList");
  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <h2 style="margin:0;">Product List</h2>
      <button onclick="refreshProducts()" style="background:#00aa66;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;">
        🔄 Refresh
      </button>
    </div>
    <p>Loading...</p>
  `;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    container.innerHTML = "<p>Error loading products ❌</p>";
    return;
  }

  if (!data.length) {
    container.innerHTML += "<p>No products yet.</p>";
    return;
  }

  const listHtml = data
    .map(
      (p) => `
    <div class="card">
      <img src="${(p.images || "").split(",")[0]}" alt="${p.name}">
      <div class="card-content">
        <h3>${p.name}</h3>
        <p>${p.category} — ₺${p.price}</p>
      </div>
      <button class="delete-btn product-delete" data-id="${p.id}">Delete</button>
    </div>`
    )
    .join("");

  container.innerHTML = container.innerHTML.replace("<p>Loading...</p>", "") + listHtml;

  // product delete click
  container.querySelectorAll(".product-delete").forEach((btn) => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      confirmDelete("product", id);
    };
  });
}

// ---- MESSAGES LİSTE ----
async function loadMessages() {
  const container = document.getElementById("messagesList");
  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <h2 style="margin:0;">Messages</h2>
      <button onclick="refreshMessages()" style="background:#00aa66;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;">
        🔄 Refresh
      </button>
    </div>
    <p>Loading...</p>
  `;

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    container.innerHTML = "<p>Error loading messages ❌</p>";
    return;
  }

  if (!data.length) {
    container.innerHTML += "<p>No messages yet.</p>";
    return;
  }

  const listHtml = data
    .map(
      (m) => `
    <div class="card">
      ${m.file ? `<img src="${m.file}" alt="attachment">` : ""}
      <div class="card-content">
        <h3>${m.name || "Unknown"} (${m.email || ""})</h3>
        <p><b>Category:</b> ${m.category || "None"}</p>
        <p>${m.message || ""}</p>
      </div>
      <button class="delete-btn message-delete" data-id="${m.id}">Delete</button>
    </div>`
    )
    .join("");

  container.innerHTML = container.innerHTML.replace("<p>Loading...</p>", "") + listHtml;

  // ❗ BURASI ÖNEMLİ: mesaj delete click’leri burada bağlanıyor
  container.querySelectorAll(".message-delete").forEach((btn) => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      confirmDelete("message", id);
    };
  });
}

// ---- SİLME ONAY POPUP ----
window.confirmDelete = (type, id) => {
  const popup = document.createElement("div");
  popup.className = "confirm-popup";
  popup.innerHTML = `
    <div class="confirm-box">
      <p>Are you sure you want to delete this ${type}?</p>
      <div class="confirm-buttons">
        <button id="confirmYes">Yes</button>
        <button id="confirmNo">No</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById("confirmYes").onclick = async () => {
    popup.remove();
    if (type === "product") {
      await deleteProduct(id);
    } else {
      await deleteMessage(id);
    }
  };
  document.getElementById("confirmNo").onclick = () => popup.remove();
};

// ---- VERİTABANI SİLME FONKSİYONLARI ----
async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error(error);
    showToast("Delete failed ❌", "error");
  } else {
    showToast("Product deleted ✅", "success");
    loadProducts();
  }
}

async function deleteMessage(id) {
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) {
    console.error(error);
    showToast("Delete failed ❌", "error");
  } else {
    showToast("Message deleted ✅", "success");
    loadMessages();
  }
}

// ---- TOAST ----
function showToast(msg, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 50);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ---- STİLLER ----
const style = document.createElement("style");
style.innerHTML = `
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  background: rgba(20,20,20,0.95);
  border: 1px solid #333;
  padding: 16px 22px;
  color: white;
  border-radius: 10px;
  opacity: 0;
  transition: all .3s;
  z-index: 999999;
  font-size: 15px;
}
.toast.show {
  opacity: 1;
  transform: translate(-50%,-50%) scale(1);
}
.toast.success { border-color:#00aa66; color:#00ff99; }
.toast.error { border-color:#aa0000; color:#ff5555; }

.confirm-popup {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.7);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:999998;
}
.confirm-box {
  background:#111;
  padding:25px 35px;
  border-radius:12px;
  border:1px solid #333;
  text-align:center;
  color:#fff;
}
.confirm-buttons {
  margin-top:15px;
  display:flex;
  justify-content:center;
  gap:10px;
}
.confirm-buttons button {
  background:#222;
  border:1px solid #444;
  color:#fff;
  padding:8px 16px;
  border-radius:6px;
  cursor:pointer;
  transition:.2s;
}
.confirm-buttons button:hover {
  background:#00aa66;
  border-color:#00ff99;
}
`;
document.head.appendChild(style);

// 🔄 ilk açılışta Products sekmesi
loadProducts();
sectionProducts.style.display = "block";
sectionMessages.style.display = "none";
menuProducts.classList.add("active");
menuMessages.classList.remove("active");

// ---------------------------------------------
// 🔥 Supabase Connection
// ---------------------------------------------
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---------------------------------------------
// 🔐 Admin Giriş Kontrolü
// ---------------------------------------------
const ADMINS = ["luivoss", "fstekin"];
const loggedUser = localStorage.getItem("loggedInUser");
if (!loggedUser || !ADMINS.includes(loggedUser.toLowerCase())) {
  window.location.href = "index.html";
}

// ---------------------------------------------
// 📂 Tab Geçişi
// ---------------------------------------------
window.showTab = function (tab) {
  document.querySelectorAll(".admin-item").forEach((x) => x.classList.remove("active"));
  event.target.classList.add("active");

  const content = document.getElementById("adminContent");
  if (tab === "messages") loadMessagesTab(content);
  if (tab === "addProduct") loadAddProductTab(content);
};

// ---------------------------------------------
// 💬 Mesajlar Sekmesi
// ---------------------------------------------
async function loadMessagesTab(content) {
  content.innerHTML = `
    <h2>Messages</h2>
    <div id="loadingSpinner" style="text-align:center;padding:20px;">Loading...</div>
  `;

  const { data, error } = await supabase.from("messages").select("*");

  if (error) {
    console.error(error);
    content.innerHTML = "<p style='color:#f55;'>Error loading messages ❌</p>";
    return;
  }

  if (!data.length) {
    content.innerHTML = "<h2>Messages</h2><p>No messages yet.</p>";
    return;
  }

  let html = "<h2>Messages</h2>";
  data.forEach((msg) => {
    const readClass = msg.read ? "border:1px solid #333;" : "border:1px solid #00aa66;";
    html += `
      <div class="msg-box" style="${readClass}">
        <strong>${msg.name}</strong> <small>(${msg.email})</small><br>
        <em>${msg.category}</em><br>
        <p>${msg.message}</p>
        <div style="display:flex;gap:10px;margin-top:8px;">
          <button class="mark-read-btn" onclick="markAsRead('${msg.id}')">Mark Read</button>
          <button class="delete-btn" onclick="deleteMessage('${msg.id}')">Delete</button>
        </div>
      </div>`;
  });
  content.innerHTML = html;
}

// ---------------------------------------------
// 📨 Okundu İşareti
// ---------------------------------------------
window.markAsRead = async function (id) {
  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("id", id);

  if (error) {
    console.error(error);
    showToast("Error marking as read ❌", "error");
  } else {
    showToast("Message marked as read ✅", "success");
    loadMessagesTab(document.getElementById("adminContent"));
  }
};

// ---------------------------------------------
// 🗑️ Mesaj Silme
// ---------------------------------------------
window.deleteMessage = async function (id) {
  if (!confirm("Are you sure you want to delete this message?")) return;

  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) {
    console.error(error);
    showToast("Error deleting message ❌", "error");
  } else {
    showToast("Message deleted 🗑️", "success");
    loadMessagesTab(document.getElementById("adminContent"));
  }
};

// ---------------------------------------------
// 🛍️ Ürün Ekleme Sekmesi
// ---------------------------------------------
function loadAddProductTab(content) {
  content.innerHTML = `
    <h2>Add Product</h2>
    <input id="prodName" class="input-box" placeholder="Product Name">
    <input id="prodPrice" class="input-box" type="number" placeholder="Price (€)">
    <input id="prodCategory" class="input-box" placeholder="Category (e.g. T-Shirts)">
    <textarea id="prodDesc" class="input-box" placeholder="Description"></textarea>
    <input id="prodImages" class="input-box" placeholder="Image URLs (comma separated)">
    <input id="prodSizes" class="input-box" placeholder="Sizes (e.g. S,M,L,XL)">
    <button class="save-btn" id="saveProductBtn">Save Product</button>
    <div id="productList"></div>
  `;
  document.getElementById("saveProductBtn").onclick = saveProduct;
  loadProductsList();
}

// ---------------------------------------------
// 💾 Ürün Kaydetme
// ---------------------------------------------
async function saveProduct() {
  const name = document.getElementById("prodName").value.trim();
  const price = parseFloat(document.getElementById("prodPrice").value);
  const category = document.getElementById("prodCategory").value.trim();
  const description = document.getElementById("prodDesc").value.trim();
  const images = document.getElementById("prodImages").value.trim();
  const sizes = document.getElementById("prodSizes").value.trim();

  if (!name || !price || !category || !images) {
    showToast("Please fill all required fields ❌", "error");
    return;
  }

  const { error } = await supabase.from("products").insert([
    { name, price, category, description, images, sizes },
  ]);

  if (error) {
    console.error(error);
    showToast("Error saving product ❌", "error");
  } else {
    showToast("✅ Product added successfully!", "success");
    document.querySelectorAll(".input-box").forEach((i) => (i.value = ""));
    loadProductsList();
  }
}

// ---------------------------------------------
// 📋 Ürün Listesi
// ---------------------------------------------
async function loadProductsList() {
  const { data, error } = await supabase.from("products").select("*").order("id", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const container = document.getElementById("productList");
  if (!data.length) {
    container.innerHTML = "<p>No products yet.</p>";
    return;
  }

  let html = "<h3>Existing Products</h3>";
  data.forEach((p) => {
    const imgs = p.images ? p.images.split(",")[0].trim() : "";
    html += `
      <div class="msg-box">
        <img src="${imgs}" style="width:70px;height:70px;object-fit:cover;border-radius:6px;margin-right:10px;">
        <strong>${p.name}</strong> — ${p.price}€
        <br><small>${p.category}</small>
        <div style="display:flex;gap:8px;margin-top:6px;">
          <button onclick="deleteProduct('${p.id}')">Delete</button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

// ---------------------------------------------
// ❌ Ürün Silme
// ---------------------------------------------
window.deleteProduct = async function (id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error(error);
    showToast("Error deleting product ❌", "error");
  } else {
    showToast("Product deleted 🗑️", "success");
    loadProductsList();
  }
};

// ---------------------------------------------
// 🔔 Toast Mesajları
// ---------------------------------------------
function showToast(msg, type = "info") {
  let toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 2000);
}

// ---------------------------------------------
// 🚀 İlk Açılışta Mesaj Sekmesi
// ---------------------------------------------
loadMessagesTab(document.getElementById("adminContent"));

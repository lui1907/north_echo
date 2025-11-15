import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ADMINS = ["luivoss", "fisami"];
const user = localStorage.getItem("loggedInUser");
if (!user || !ADMINS.includes(user.toLowerCase())) window.location.href = "index.html";

// Menü geçişleri
const sections = {
  dashboard: document.getElementById("sectionDashboard"),
  products: document.getElementById("sectionProducts"),
  messages: document.getElementById("sectionMessages"),
};

const menuDashboard = document.getElementById("menuDashboard");
const menuProducts = document.getElementById("menuProducts");
const menuMessages = document.getElementById("menuMessages");

function showSection(name) {
  Object.values(sections).forEach((s) => (s.style.display = "none"));
  document.querySelectorAll(".sidebar li").forEach((li) => li.classList.remove("active"));
  sections[name].style.display = "block";
  document.getElementById(`menu${name.charAt(0).toUpperCase() + name.slice(1)}`).classList.add("active");

  if (name === "products") loadProducts();
  if (name === "messages") loadMessages();
}

menuDashboard.onclick = () => showSection("dashboard");
menuProducts.onclick = () => showSection("products");
menuMessages.onclick = () => showSection("messages");

// Ürün ekleme
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

  const { error } = await supabase.from("products").insert([{ name, price, category, description, images, sizes }]);
  if (error) showToast("Error adding product ❌", "error");
  else {
    showToast("✅ Product added!");
    loadProducts();
  }
};

// Ürünleri listele
async function loadProducts() {
  const container = document.getElementById("productsList");
  container.innerHTML = `<p>Loading...</p>`;

  const { data, error } = await supabase.from("products").select("*").order("id", { ascending: false });
  if (error) return (container.innerHTML = "<p>Error loading products ❌</p>");
  if (!data.length) return (container.innerHTML = "<p>No products yet.</p>");

  container.innerHTML = data
    .map(
      (p) => `
    <div class="card">
      <img src="${(p.images || "").split(",")[0]}" alt="${p.name}">
      <div class="card-content">
        <h3>${p.name}</h3>
        <p>${p.category} — ₺${p.price}</p>
      </div>
      <button class="delete-btn" data-id="${p.id}" data-type="product">Delete</button>
    </div>`
    )
    .join("");

  container.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.onclick = () => confirmDelete("product", btn.dataset.id);
  });
}

// Mesajları listele
async function loadMessages() {
  const container = document.getElementById("messagesList");
  container.innerHTML = `<p>Loading...</p>`;

  const { data, error } = await supabase.from("messages").select("*").order("id", { ascending: false });
  if (error) return (container.innerHTML = "<p>Error loading messages ❌</p>");
  if (!data.length) return (container.innerHTML = "<p>No messages yet.</p>");

  container.innerHTML = data
    .map(
      (m) => `
    <div class="card">
      ${m.file ? `<img src="${m.file}" alt="attachment">` : ""}
      <div class="card-content">
        <h3>${m.name || "Unknown"} (${m.email || ""})</h3>
        <p><b>Category:</b> ${m.category || "None"}</p>
        <p>${m.message || ""}</p>
      </div>
      <button class="delete-btn" data-id="${m.id}" data-type="message">Delete</button>
    </div>`
    )
    .join("");

  container.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.onclick = () => confirmDelete("message", btn.dataset.id);
  });
}

// Onay popup
function confirmDelete(type, id) {
  const popup = document.createElement("div");
  popup.className = "confirm-popup";
  popup.innerHTML = `
    <div class="confirm-box">
      <p>Are you sure you want to delete this ${type}?</p>
      <div class="confirm-buttons">
        <button id="confirmYes">Yes</button>
        <button id="confirmNo">No</button>
      </div>
    </div>`;
  document.body.appendChild(popup);

  document.getElementById("confirmYes").onclick = async () => {
    popup.remove();
    if (type === "product") await supabase.from("products").delete().eq("id", id);
    else await supabase.from("messages").delete().eq("id", id);
    showToast("✅ Deleted successfully");
    if (type === "product") loadProducts();
    else loadMessages();
  };

  document.getElementById("confirmNo").onclick = () => popup.remove();
}

// Toast
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

// Toast stilleri
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
.confirm-popup {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.7);
  display:flex;align-items:center;justify-content:center;
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
}
.confirm-buttons button:hover {
  background:#00aa66;
  border-color:#00ff99;
}
`;
document.head.appendChild(style);

// Varsayılan görünüm
showSection("dashboard");

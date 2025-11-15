import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 👑 Admin kontrolü
const ADMINS = ["luivoss", "fisami"];
const user = localStorage.getItem("loggedInUser");
if (!user || !ADMINS.includes(user.toLowerCase())) window.location.href = "index.html";

// 🔁 Menü kontrolü
const sectionProducts = document.getElementById("sectionProducts");
const sectionMessages = document.getElementById("sectionMessages");
document.getElementById("menuProducts").onclick = () => showSection("products");
document.getElementById("menuMessages").onclick = () => showSection("messages");

function showSection(section) {
  sectionProducts.style.display = section === "products" ? "block" : "none";
  sectionMessages.style.display = section === "messages" ? "block" : "none";
  document.getElementById("menuProducts").classList.toggle("active", section === "products");
  document.getElementById("menuMessages").classList.toggle("active", section === "messages");
  if (section === "products") loadProducts();
  if (section === "messages") loadMessages();
}

// 🟩 Ürün ekleme
document.getElementById("btnAddProduct").onclick = async () => {
  const name = pName.value.trim();
  const price = parseFloat(pPrice.value);
  const category = pCategory.value.trim();
  const description = pDescription.value.trim();
  const images = pImages.value.trim();
  const sizes = pSizes.value.trim();

  if (!name || !price || !category || !description || !images) return alert("Fill all fields ❌");

  const { error } = await supabase.from("products").insert([{ name, price, category, description, images, sizes }]);
  if (error) alert("Error adding product ❌");
  else {
    alert("✅ Product added!");
    refreshProducts();
  }
};

// 🧾 Ürünleri yükle
async function loadProducts() {
  const c = document.getElementById("productsList");
  c.innerHTML = "<p>Loading...</p>";

  const { data } = await supabase.from("products").select("*").order("id", { ascending: false });
  if (!data.length) return (c.innerHTML = "<p>No products yet.</p>");

  c.innerHTML = data
    .map(
      (p) => `
      <div class="card">
        <img src="${(p.images || '').split(',')[0]}" onclick="openModal('${(p.images || '').split(',')[0]}')">
        <div class="card-content">
          <h3>${p.name}</h3>
          <p>${p.category} — ₺${p.price}</p>
        </div>
        <button class="delete-btn" onclick="deleteItem('products', ${p.id})">Delete</button>
      </div>`
    )
    .join("");
}
window.refreshProducts = loadProducts;

// 💬 Mesajları yükle
async function loadMessages() {
  const c = document.getElementById("messagesList");
  c.innerHTML = "<p>Loading...</p>";

  const { data } = await supabase.from("messages").select("*").order("id", { ascending: false });
  if (!data.length) return (c.innerHTML = "<p>No messages yet.</p>");

  c.innerHTML = data
    .map(
      (m) => `
      <div class="card">
        ${m.file ? `<img src="${m.file}" onclick="openModal('${m.file}')">` : ""}
        <div class="card-content">
          <h3>${m.name || "Unknown"} (${m.email || ""})</h3>
          <p><b>${m.category || "General"}</b></p>
          <p>${m.message || ""}</p>
        </div>
        <button class="delete-btn" onclick="deleteItem('messages', ${m.id})">Delete</button>
      </div>`
    )
    .join("");
}
window.refreshMessages = loadMessages;

// ❌ Silme fonksiyonu
window.deleteItem = async (table, id) => {
  if (!confirm("Are you sure?")) return;
  await supabase.from(table).delete().eq("id", id);
  if (table === "products") loadProducts();
  else loadMessages();
};

// 🖼️ Görsel modal
window.openModal = (src) => {
  const modal = document.getElementById("imgModal");
  const img = document.getElementById("modalImage");
  img.src = src;
  modal.classList.add("active");
};
window.closeModal = () => document.getElementById("imgModal").classList.remove("active");

// 🚪 Logout
window.logout = () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
};

// Varsayılan olarak ürün sekmesi
showSection("products");

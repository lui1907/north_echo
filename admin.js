import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 👑 Admin kontrolü (büyük-küçük harf fark etmez)
const ADMINS = ["luivoss", "fisami", "ahmetavci"];
const loggedUser = localStorage.getItem("loggedInUser");

if (!loggedUser) {
  window.location.href = "login.html";
} else {
  const username = loggedUser.toLowerCase();
  const isAdmin = ADMINS.some(a => a.toLowerCase() === username);
  if (!isAdmin) {
    window.location.href = "index.html";
  }
}

// Menü ve bölümler
const btnProducts = document.getElementById("btnProducts");
const btnMessages = document.getElementById("btnMessages");
const sectionProducts = document.getElementById("sectionProducts");
const sectionMessages = document.getElementById("sectionMessages");

btnProducts.onclick = () => {
  sectionProducts.style.display = "block";
  sectionMessages.style.display = "none";
  btnProducts.classList.add("active");
  btnMessages.classList.remove("active");
  loadProducts();
};
btnMessages.onclick = () => {
  sectionProducts.style.display = "none";
  sectionMessages.style.display = "block";
  btnProducts.classList.remove("active");
  btnMessages.classList.add("active");
  loadMessages();
};

// 📦 Ürünleri yükle
async function loadProducts() {
  const container = document.getElementById("productsList");
  container.innerHTML = "<p>Loading...</p>";
  const { data, error } = await supabase.from("products").select("*").order("id", { ascending: false });
  if (error) return (container.innerHTML = "<p>Error loading products ❌</p>");
  if (!data.length) return (container.innerHTML = "<p>No products yet.</p>");
  container.innerHTML = data
    .map(
      (p) => `
      <div class="card">
        <img src="${p.images?.split(",")[0] || ""}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.category} — €${p.price}</p>
        <button class="delete-btn" onclick="deleteProduct(${p.id})">Delete</button>
      </div>`
    )
    .join("");
}

// 🗑 Ürün sil
window.deleteProduct = async (id) => {
  if (!confirm("Delete this product?")) return;
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) alert("Delete failed ❌");
  else loadProducts();
};

// ➕ Ürün ekle
document.getElementById("btnAddProduct").onclick = async () => {
  const name = document.getElementById("pName").value.trim();
  const price = parseFloat(document.getElementById("pPrice").value);
  const category = document.getElementById("pCategory").value.trim();
  const description = document.getElementById("pDescription").value.trim();
  const images = document.getElementById("pImages").value.trim();
  const sizes = document.getElementById("pSizes").value.trim();

  if (!name || !price || !category || !description || !images) {
    alert("Please fill all fields ❌");
    return;
  }

  const { error } = await supabase.from("products").insert([{ name, price, category, description, images, sizes }]);
  if (error) alert("Insert failed ❌");
  else {
    alert("✅ Product added!");
    loadProducts();
  }
};

// 💬 Mesajları yükle
async function loadMessages() {
  const container = document.getElementById("messagesList");
  container.innerHTML = "<p>Loading...</p>";
  const { data, error } = await supabase.from("messages").select("*").order("id", { ascending: false });
  if (error) return (container.innerHTML = "<p>Error loading messages ❌</p>");
  if (!data.length) return (container.innerHTML = "<p>No messages yet.</p>");
  container.innerHTML = data
    .map(
      (m) => `
      <div class="card">
        <h3>${m.name} (${m.email})</h3>
        <p><b>${m.category}</b></p>
        <p>${m.message}</p>
        ${m.file ? `<a href="${m.file}" target="_blank">📎 File</a>` : ""}
        <button class="delete-btn" onclick="deleteMessage(${m.id})">Delete</button>
      </div>`
    )
    .join("");
}

// 🗑 Mesaj sil
window.deleteMessage = async (id) => {
  if (!confirm("Delete this message?")) return;
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) alert("Delete failed ❌");
  else loadMessages();
};

// İlk yükleme
loadProducts();

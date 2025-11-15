import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 🔗 SUPABASE BAĞLANTISI
const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🔒 ADMİN KONTROLÜ
const allowedUsers = ["luivoss", "fstekin"]; // buraya kendi kullanıcı adını da ekleyebilirsin

const currentUser = localStorage.getItem("loggedInUser");

if (!currentUser) {
  // giriş yapılmamışsa
  alert("Please log in first.");
  window.location.href = "login.html";
} else if (!allowedUsers.includes(currentUser)) {
  // admin değilse
  alert("Access denied. Only admins can enter this page.");
  window.location.href = "index.html";
}

// 🧠 DOM ELEMENTLERİ
const btnProducts = document.getElementById("btnProducts");
const btnMessages = document.getElementById("btnMessages");
const sectionProducts = document.getElementById("sectionProducts");
const sectionMessages = document.getElementById("sectionMessages");
const addButton = document.getElementById("btnAddProduct");

// 🧾 ÜRÜN EKLEME
addButton.onclick = async () => {
  const name = document.getElementById("pName").value.trim();
  const price = parseFloat(document.getElementById("pPrice").value);
  const category = document.getElementById("pCategory").value;
  const description = document.getElementById("pDescription").value.trim();
  const images = document.getElementById("pImages").value.trim();
  const sizes = document.getElementById("pSizes").value.trim();

  if (!name || !price || !category || !description || !images) {
    alert("⚠️ Please fill all fields.");
    return;
  }

  const { error } = await supabase.from("products").insert([
    { name, price, category, description, images, sizes },
  ]);

  if (error) {
    console.error(error);
    alert("❌ Failed to add product.");
  } else {
    alert("✅ Product added successfully!");
    loadProducts();
    clearForm();
  }
};

// 🧹 FORM TEMİZLEME
function clearForm() {
  document.getElementById("pName").value = "";
  document.getElementById("pPrice").value = "";
  document.getElementById("pDescription").value = "";
  document.getElementById("pImages").value = "";
  document.getElementById("pSizes").value = "";
}

// 📦 ÜRÜNLERİ YÜKLE
async function loadProducts() {
  const list = document.getElementById("productsList");
  list.innerHTML = "<p>Loading...</p>";

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    list.innerHTML = "<p>Error loading products ❌</p>";
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = "<p>No products yet.</p>";
    return;
  }

  list.innerHTML = data
    .map(
      (p) => `
      <div class="product-card">
        <img src="${p.images.split(",")[0]}" alt="${p.name}">
        <div class="info">
          <h4>${p.name}</h4>
          <p>${p.category} — €${p.price}</p>
          <button class="delete-btn" onclick="deleteProduct(${p.id})">Delete</button>
        </div>
      </div>
    `
    )
    .join("");
}

// 🗑️ ÜRÜN SİLME
window.deleteProduct = async (id) => {
  if (!confirm("Are you sure you want to delete this product?")) return;
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) alert("❌ Error deleting product");
  else loadProducts();
};

// 💬 MESAJLARI YÜKLE
async function loadMessages() {
  const list = document.getElementById("messagesList");
  list.innerHTML = "<p>Loading...</p>";

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    list.innerHTML = "<p>Error loading messages ❌</p>";
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = "<p>No messages yet.</p>";
    return;
  }

  list.innerHTML = data
    .map(
      (m) => `
    <div class="message-item">
      <h4>${m.name} (${m.email})</h4>
      <p><b>Category:</b> ${m.category}</p>
      <p>${m.message}</p>
      ${m.file ? `<a href="${m.file}" target="_blank">📎 View File</a>` : ""}
    </div>
  `
    )
    .join("");
}

// 🧭 SEKME GEÇİŞLERİ
btnProducts.onclick = () => {
  btnProducts.classList.add("active");
  btnMessages.classList.remove("active");
  sectionProducts.style.display = "block";
  sectionMessages.style.display = "none";
};

btnMessages.onclick = () => {
  btnMessages.classList.add("active");
  btnProducts.classList.remove("active");
  sectionProducts.style.display = "none";
  sectionMessages.style.display = "block";
  loadMessages();
};

// 🚀 SAYFA YÜKLENİNCE ÜRÜNLERİ ÇEK
loadProducts();

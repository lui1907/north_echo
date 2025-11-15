import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🔒 Admin kontrolü
const allowedUsers = ["luivoss", "fstekin"];
const user = localStorage.getItem("loggedInUser");
if (!allowedUsers.includes(user)) {
  window.location.href = "index.html";
}

// 📂 Sekme geçişleri
const btnProducts = document.getElementById("btnProducts");
const btnMessages = document.getElementById("btnMessages");
const sectionProducts = document.getElementById("sectionProducts");
const sectionMessages = document.getElementById("sectionMessages");

btnProducts.onclick = () => {
  btnProducts.classList.add("active");
  btnMessages.classList.remove("active");
  sectionProducts.style.display = "block";
  sectionMessages.style.display = "none";
};

btnMessages.onclick = async () => {
  btnMessages.classList.add("active");
  btnProducts.classList.remove("active");
  sectionMessages.style.display = "block";
  sectionProducts.style.display = "none";
  loadMessages();
};

// ✅ Ürün ekleme
document.getElementById("btnAddProduct").onclick = async () => {
  const name = pName.value.trim();
  const price = parseFloat(pPrice.value);
  const category = pCategory.value;
  const description = pDescription.value.trim();
  const images = pImages.value.trim();
  const sizes = pSizes.value.trim();

  if (!name || !price || !category || !description || !images) {
    alert("Please fill all fields!");
    return;
  }

  const { error } = await supabase.from("products").insert([
    { name, price, category, description, images, sizes },
  ]);

  if (error) alert("❌ Error adding product");
  else {
    alert("✅ Product added!");
    loadProducts();
  }
};

// 🔄 Ürünleri yükle
async function loadProducts() {
  const list = document.getElementById("productsList");
  list.innerHTML = "<p>Loading...</p>";

  const { data, error } = await supabase.from("products").select("*").order("id", { ascending: false });
  if (error) {
    list.innerHTML = "<p>Error loading products</p>";
    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = "<p>No products yet.</p>";
    return;
  }

  list.innerHTML = data.map(p => `
    <div class="product-card">
      <img src="${p.images.split(',')[0]}" alt="${p.name}">
      <div class="info">
        <h4>${p.name}</h4>
        <p>€${p.price} — ${p.category}</p>
        <button class="delete-btn" onclick="deleteProduct(${p.id})">Delete</button>
      </div>
    </div>
  `).join("");
}

// 🗑️ Ürün sil
window.deleteProduct = async (id) => {
  if (!confirm("Delete this product?")) return;
  await supabase.from("products").delete().eq("id", id);
  loadProducts();
};

// 💬 Mesajları yükle
async function loadMessages() {
  const list = document.getElementById("messagesList");
  list.innerHTML = "<p>Loading...</p>";

  const { data, error } = await supabase.from("messages").select("*").order("id", { ascending: false });
  if (error) {
    list.innerHTML = "<p>Error loading messages</p>";
    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = "<p>No messages found.</p>";
    return;
  }

  list.innerHTML = data.map(m => `
    <div class="message-item">
      <h4>${m.name} (${m.email})</h4>
      <p><b>Category:</b> ${m.category}</p>
      <p>${m.message}</p>
      ${m.file ? `<a href="${m.file}" target="_blank">Attached File</a>` : ""}
    </div>
  `).join("");
}

loadProducts();

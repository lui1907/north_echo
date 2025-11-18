import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 👑 Admin kontrolü
const ADMINS = ["luivoss", "fstekin"];
const user = localStorage.getItem("loggedInUser");
if (!user || !ADMINS.includes(user.toLowerCase())) {
  window.location.href = "index.html";
}

// DOM elemanları
const sectionProducts = document.getElementById("sectionProducts");
const sectionMessages = document.getElementById("sectionMessages");
const menuProducts = document.getElementById("menuProducts");
const menuMessages = document.getElementById("menuMessages");
const productsList = document.getElementById("productsList");
const messagesList = document.getElementById("messagesList");

// Sidebar menü geçişleri
function showSection(section) {
  if (section === "products") {
    sectionProducts.style.display = "block";
    sectionMessages.style.display = "none";
    menuProducts.classList.add("active");
    menuMessages.classList.remove("active");
    loadProducts();
  } else {
    sectionProducts.style.display = "none";
    sectionMessages.style.display = "block";
    menuProducts.classList.remove("active");
    menuMessages.classList.add("active");
    loadMessages();
  }
}

menuProducts.addEventListener("click", () => showSection("products"));
menuMessages.addEventListener("click", () => showSection("messages"));

// 🟩 Ürün ekleme
document.getElementById("btnAddProduct").addEventListener("click", async () => {
  const nameEl = document.getElementById("pName");
  const priceEl = document.getElementById("pPrice");
  const catEl = document.getElementById("pCategory");
  const descEl = document.getElementById("pDescription");
  const imgsEl = document.getElementById("pImages");
  const sizesEl = document.getElementById("pSizes");

  const name = nameEl.value.trim();
  const price = parseFloat(priceEl.value);
  const category = catEl.value.trim();
  const description = descEl.value.trim();
  const images = imgsEl.value.trim();
  const sizes = sizesEl.value.trim();

  if (!name || !price || !category || !description || !images) {
    alert("Lütfen tüm alanları doldurun ❌");
    return;
  }

  const { error } = await supabase.from("products").insert([
    { name, price, category, description, images, sizes }
  ]);

  if (error) {
    console.error(error);
    alert("Ürün eklenirken hata oluştu ❌");
  } else {
    alert("✅ Ürün eklendi!");
    // inputları temizle
    nameEl.value = "";
    priceEl.value = "";
    catEl.value = "";
    descEl.value = "";
    imgsEl.value = "";
    sizesEl.value = "";
    loadProducts();
  }
});

// 🧾 Ürünleri yükle
async function loadProducts() {
  productsList.innerHTML = "<p>Loading...</p>";

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    productsList.innerHTML = "<p>Ürünler alınırken hata oluştu.</p>";
    return;
  }

  if (!data || !data.length) {
    productsList.innerHTML = "<p>Henüz ürün yok.</p>";
    return;
  }

  productsList.innerHTML = data
    .map((p) => {
      const firstImg = (p.images || "").split(",")[0] || "";
      return `
        <div class="card">
          ${firstImg
            ? `<img src="${firstImg}" class="admin-img" data-src="${firstImg}">`
            : ""
          }
          <div class="card-content">
            <h3>${p.name}</h3>
            <p>${p.category} — ₺${p.price}</p>
          </div>
          <button 
            class="delete-btn" 
            data-table="products" 
            data-id="${p.id}">
            Delete
          </button>
        </div>
      `;
    })
    .join("");
}
window.refreshProducts = loadProducts;

// 💬 Mesajları yükle
async function loadMessages() {
  messagesList.innerHTML = "<p>Loading...</p>";

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    messagesList.innerHTML = "<p>Mesajlar alınırken hata oluştu.</p>";
    return;
  }

  if (!data || !data.length) {
    messagesList.innerHTML = "<p>Henüz mesaj yok.</p>";
    return;
  }

  messagesList.innerHTML = data
    .map((m) => {
      return `
        <div class="card">
          ${m.file
            ? `<img src="${m.file}" class="admin-img" data-src="${m.file}">`
            : ""
          }
          <div class="card-content">
            <h3>${m.name || "Unknown"} (${m.email || ""})</h3>
            <p><b>${m.category || "General"}</b></p>
            <p>${m.message || ""}</p>
            <small style="opacity:.6">${m.date || ""}</small>
          </div>
          <button 
            class="delete-btn" 
            data-table="messages" 
            data-id="${m.id}">
            Delete
          </button>
        </div>
      `;
    })
    .join("");
}
window.refreshMessages = loadMessages;

// ❌ Silme fonksiyonu
async function deleteItem(table, id) {
  const ok = confirm("Bu kaydı silmek istediğinize emin misiniz?");
  if (!ok) return;

  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) {
    console.error(error);
    alert("Silme işlemi sırasında hata oluştu ❌");
    return;
  }

  if (table === "products") {
    loadProducts();
  } else {
    loadMessages();
  }
}

// 🔁 Delete & resim için event delegation
document.addEventListener("click", (e) => {
  const target = e.target;

  // Delete butonları
  if (target.classList.contains("delete-btn")) {
    const table = target.dataset.table;
    const id = parseInt(target.dataset.id, 10);
    if (table && id) {
      deleteItem(table, id);
    }
  }

  // Resim büyütme
  if (target.classList.contains("admin-img")) {
    const src = target.dataset.src;
    if (src) openModal(src);
  }
});

// 🖼️ Görsel modal
function openModal(src) {
  const modal = document.getElementById("imgModal");
  const img = document.getElementById("modalImage");
  img.src = src;
  modal.classList.add("active");
}

function closeModal() {
  document.getElementById("imgModal").classList.remove("active");
}

window.openModal = openModal;
window.closeModal = closeModal;

// 🚪 Logout
window.logout = () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
};

// Varsayılan olarak ürün sekmesi
showSection("products");

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ADMIN CHECK
const ADMINS = ["luivoss", "fstekin"];
const user = localStorage.getItem("loggedInUser");
if (!user || !ADMINS.includes(user.toLowerCase())) {
  window.location.href = "index.html";
}

// DOM
const sectionProducts = document.getElementById("sectionProducts");
const sectionMessages = document.getElementById("sectionMessages");

// SECTION SWITCH
function showSection(section) {
  if (section === "products") {
    sectionProducts.style.display = "block";
    sectionMessages.style.display = "none";
    loadProducts();
  } else {
    sectionProducts.style.display = "none";
    sectionMessages.style.display = "block";
    loadMessages();
  }
}

document.getElementById("menuProducts").onclick = () => showSection("products");
document.getElementById("menuMessages").onclick = () => showSection("messages");

// -------------------------
// TOAST SYSTEM
// -------------------------
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  Object.assign(toast.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) scale(0.9)",
    background: "rgba(20,20,20,0.95)",
    padding: "14px 20px",
    borderRadius: "10px",
    border: "1px solid #333",
    zIndex: "99999",
    opacity: "0",
    transition: "0.25s",
    color: "white",
    fontSize: "15px",
  });

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translate(-50%, -50%) scale(1)";
  }, 50);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translate(-50%, -50%) scale(0.9)";
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// -------------------------
// ADD PRODUCT
// -------------------------
document.getElementById("btnAddProduct").onclick = async () => {
  const name = pName.value.trim();
  const price = parseFloat(pPrice.value);
  const category = pCategory.value.trim();
  const description = pDescription.value.trim();
  const images = pImages.value.trim();
  const sizes = pSizes.value.trim();

  if (!name || !price || !category || !description || !images) {
    showToast("Fill all fields ❌", "error");
    return;
  }

  const { error } = await supabase.from("products").insert([
    { name, price, category, description, images, sizes }
  ]);

  if (error) showToast("Error adding product ❌", "error");
  else showToast("Product added successfully ✅", "success");

  loadProducts();
};

// -------------------------
// LOAD PRODUCTS
// -------------------------
async function loadProducts() {
  const container = document.getElementById("productsList");
  container.innerHTML = "<p>Loading...</p>";

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    container.innerHTML = "Error loading products.";
    return;
  }

  container.innerHTML = data
    .map(
      (p) => `
      <div class="card">
        <img src="${p.images.split(',')[0]}" class="admin-img" data-src="${p.images.split(',')[0]}">
        <div class="card-content">
          <h3>${p.name}</h3>
          <p>${p.category} — ₺${p.price}</p>
        </div>
        <button class="delete-btn" data-id="${p.id}" data-table="products">Delete</button>
      </div>`
    )
    .join("");
}

// -------------------------
// LOAD MESSAGES
// -------------------------
async function loadMessages() {
  const container = document.getElementById("messagesList");
  container.innerHTML = "<p>Loading...</p>";

  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("id", { ascending: false });

  if (!data.length) {
    container.innerHTML = "No messages yet.";
    return;
  }

  container.innerHTML = data
    .map(
      (m) => `
      <div class="card">
        ${m.file ? `<img src="${m.file}" class="admin-img" data-src="${m.file}">` : ""}
        <div class="card-content">
          <h3>${m.name} (${m.email})</h3>
          <p><b>${m.category}</b></p>
          <p>${m.message}</p>
        </div>
        <button class="delete-btn" data-id="${m.id}" data-table="messages">Delete</button>
      </div>`
    )
    .join("");
}

// -------------------------
// DELETE (UUID SUPPORT!)
// -------------------------
document.addEventListener("click", async (e) => {
  const btn = e.target;

  if (btn.classList.contains("delete-btn")) {
    const id = btn.dataset.id;         // UUID, parseInt YOK
    const table = btn.dataset.table;

    if (!id || !table) return;

    const ok = confirm("Are you sure you want to delete this?");
    if (!ok) return;

    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) showToast("Delete error ❌", "error");
    else showToast("Deleted successfully ✅", "success");

    table === "products" ? loadProducts() : loadMessages();
  }

  // IMAGE MODAL
  if (btn.classList.contains("admin-img")) {
    openModal(btn.dataset.src);
  }
});

// -------------------------
// MODAL
// -------------------------
window.openModal = (src) => {
  modalImage.src = src;
  imgModal.classList.add("active");
};

window.closeModal = () => imgModal.classList.remove("active");

// LOGOUT
window.logout = () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
};

showSection("products");

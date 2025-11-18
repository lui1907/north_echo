import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ================== ADMIN CHECK ==================
const ADMINS = ["luivoss", "fstekin"];
const user = localStorage.getItem("loggedInUser");

if (!user || !ADMINS.includes(user.toLowerCase())) {
  window.location.href = "index.html";
}

// ================== DOM ELEMENTS ==================
const sectionProducts = document.getElementById("sectionProducts");
const sectionMessages = document.getElementById("sectionMessages");

document.getElementById("menuProducts").onclick = () => showSection("products");
document.getElementById("menuMessages").onclick = () => showSection("messages");

// ================== STYLE (POPUP + TOAST) ==================
const style = document.createElement("style");
style.textContent = `
  .admin-confirm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    z-index: 99998;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .admin-confirm-box {
    background: #111;
    border-radius: 12px;
    border: 1px solid #333;
    padding: 24px 28px;
    max-width: 320px;
    text-align: center;
    color: #fff;
    box-shadow: 0 0 25px rgba(0,0,0,0.6);
  }
  .admin-confirm-box p {
    margin: 0 0 18px;
    font-size: 15px;
  }
  .admin-confirm-buttons {
    display: flex;
    justify-content: center;
    gap: 12px;
  }
  .admin-confirm-buttons button {
    padding: 8px 18px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
  }
  .admin-confirm-yes {
    background: #00aa66;
    color: #fff;
  }
  .admin-confirm-no {
    background: #444;
    color: #fff;
  }
  .admin-confirm-yes:hover {
    background: #00cc77;
  }
  .admin-confirm-no:hover {
    background: #666;
  }

  .admin-toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.85);
    background: rgba(15,15,15,0.96);
    border-radius: 12px;
    border: 1px solid #444;
    padding: 14px 22px;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    z-index: 99999;
    opacity: 0;
    transition: all .25s ease;
    box-shadow: 0 0 25px rgba(0,0,0,0.6);
    min-width: 220px;
    pointer-events: none;
  }
  .admin-toast.show {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  .admin-toast.success {
    border-color: #00cc77;
    color: #00ff99;
  }
  .admin-toast.error {
    border-color: #cc0000;
    color: #ff6666;
  }
`;
document.head.appendChild(style);

// ================== HELPER: TOAST ==================
function showToast(message, type = "info") {
  const t = document.createElement("div");
  t.className = "admin-toast " + (type === "success" ? "success" : type === "error" ? "error" : "");
  t.textContent = message;
  document.body.appendChild(t);

  setTimeout(() => t.classList.add("show"), 20);
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 250);
  }, 2200);
}

// ================== HELPER: CONFIRM POPUP ==================
function openConfirm(message, onYes) {
  const old = document.getElementById("adminConfirmOverlay");
  if (old) old.remove();

  const overlay = document.createElement("div");
  overlay.id = "adminConfirmOverlay";
  overlay.className = "admin-confirm-overlay";

  overlay.innerHTML = `
    <div class="admin-confirm-box">
      <p>${message}</p>
      <div class="admin-confirm-buttons">
        <button class="admin-confirm-yes">Yes</button>
        <button class="admin-confirm-no">No</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector(".admin-confirm-no").onclick = () => overlay.remove();
  overlay.querySelector(".admin-confirm-yes").onclick = async () => {
    overlay.remove();
    await onYes();
  };
}

// ================== SECTION SWITCH ==================
function showSection(section) {
  sectionProducts.style.display = section === "products" ? "block" : "none";
  sectionMessages.style.display = section === "messages" ? "block" : "none";

  document.getElementById("menuProducts").classList.toggle("active", section === "products");
  document.getElementById("menuMessages").classList.toggle("active", section === "messages");

  if (section === "products") loadProducts();
  if (section === "messages") loadMessages();
}

// ================== ADD PRODUCT ==================
document.getElementById("btnAddProduct").onclick = async () => {
  const name = pName.value.trim();
  const price = parseFloat(pPrice.value);
  const category = pCategory.value.trim();
  const description = pDescription.value.trim();
  const images = pImages.value.trim();
  const sizes = pSizes.value.trim();

  if (!name || !price || !category || !description || !images) {
    showToast("Please fill all fields ❌", "error");
    return;
  }

  const { error } = await supabase
    .from("products")
    .insert([{ name, price, category, description, images, sizes }]);

  if (error) {
    console.error(error);
    showToast("Error adding product ❌", "error");
  } else {
    showToast("Product added ✅", "success");
    refreshProducts();
  }
};

// ================== LOAD PRODUCTS ==================
async function loadProducts() {
  const c = document.getElementById("productsList");
  c.innerHTML = "<p>Loading...</p>";

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    c.innerHTML = "<p>Error while loading products.</p>";
    return;
  }

  if (!data || data.length === 0) {
    c.innerHTML = "<p>No products yet.</p>";
    return;
  }

  c.innerHTML = data
    .map(
      (p) => `
      <div class="card">
        <img src="${(p.images || "").split(",")[0] || ""}" onclick="openModal('${(p.images || "").split(",")[0] || ""}')">
        <div class="card-content">
          <h3>${p.name}</h3>
          <p>${p.category} — €${p.price}</p>
        </div>
        <button class="delete-btn" onclick="deleteItem('products', '${p.id}')">Delete</button>
      </div>`
    )
    .join("");
}
window.refreshProducts = loadProducts;

// ================== LOAD MESSAGES ==================
async function loadMessages() {
  const c = document.getElementById("messagesList");
  c.innerHTML = "<p>Loading...</p>";

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    c.innerHTML = "<p>Error while loading messages.</p>";
    return;
  }

  if (!data || data.length === 0) {
    c.innerHTML = "<p>No messages yet.</p>";
    return;
  }

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
        <button class="delete-btn" onclick="deleteItem('messages', '${m.id}')">Delete</button>
      </div>`
    )
    .join("");
}
window.refreshMessages = loadMessages;

// ================== DELETE ITEM (WITH POPUP) ==================
window.deleteItem = (table, id) => {
  openConfirm("Are you sure you want to delete this item?", async () => {
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      console.error(error);
      showToast("Delete failed ❌", "error");
      return;
    }

    showToast("Item deleted ✅", "success");

    if (table === "products") {
      loadProducts();
    } else {
      loadMessages();
    }
  });
};

// ================== IMAGE MODAL ==================
window.openModal = (src) => {
  const modal = document.getElementById("imgModal");
  const img = document.getElementById("modalImage");
  img.src = src;
  modal.classList.add("active");
};

window.closeModal = () =>
  document.getElementById("imgModal").classList.remove("active");

// ================== LOGOUT ==================
window.logout = () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
};

// Varsayılan sekme
showSection("products");

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://xedfviwffpsvbmyqzoof.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM"
);

const ADMINS = ["luivoss", "fisami"];
const logged = localStorage.getItem("loggedInUser");
if (!logged || !ADMINS.includes(logged.toLowerCase())) window.location.href = "index.html";

let messages = [];

async function loadMessages() {
  const cont = document.getElementById("adminMessages");
  cont.innerHTML = "<p>Loading...</p>";
  const { data, error } = await supabase.from("messages").select("*").order("id", { ascending: false });
  if (error) return (cont.innerHTML = "Error loading ❌");

  messages = data;
  renderMessages();
}

function renderMessages() {
  const cont = document.getElementById("adminMessages");
  const cat = document.getElementById("filterCategory").value;
  cont.innerHTML = "";
  const list = cat === "All" ? messages : messages.filter(m => m.category === cat);
  if (!list.length) return (cont.innerHTML = "<p>No messages found.</p>");

  list.forEach(m => {
    const file = m.file ? `<img src="${m.file}" class="msg-img" />` : "";
    cont.innerHTML += `
      <div class="msg-box">
        <div class="msg-top">
          <div><b>${m.name}</b><br><small>${m.email}</small></div>
          <button style="background:#400;border:none;padding:6px 12px;border-radius:8px;color:#fff;cursor:pointer;" onclick="deleteMsg(${m.id})">Delete</button>
        </div>
        <div><small>${m.category || "Other"}</small></div>
        <p>${m.message}</p>
        ${file}
      </div>`;
  });
}

window.deleteMsg = async function(id) {
  if (!confirm("Delete this message?")) return;
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) showToast("Delete failed ❌", "error");
  else {
    messages = messages.filter(x => x.id !== id);
    renderMessages();
    showToast("Deleted ✅", "success");
  }
};

document.getElementById("filterCategory").addEventListener("change", renderMessages);

// 🛍️ Product Section
window.showTab = function(tab) {
  document.querySelectorAll(".admin-item").forEach(x => x.classList.remove("active"));
  event.target.classList.add("active");

  const c = document.getElementById("adminContent");
  if (tab === "messages") {
    c.innerHTML = `
      <h2>Messages</h2>
      <select id="filterCategory">
        <option>All</option><option>Product</option><option>Order</option>
        <option>Design</option><option>Other</option>
      </select>
      <div id="adminMessages"></div>`;
    setTimeout(() => { loadMessages(); document.getElementById("filterCategory").onchange = renderMessages; }, 50);
  }

  if (tab === "products") {
    c.innerHTML = `
      <h2>Add Product</h2>
      <input id="prodName" class="input-box" placeholder="Product Name">
      <input id="prodPrice" class="input-box" type="number" placeholder="Price (€)">
      <input id="prodCategory" class="input-box" placeholder="Category">
      <textarea id="prodDesc" class="input-box" placeholder="Description"></textarea>
      <input id="prodImages" class="input-box" placeholder="Image URLs (comma separated)">
      <input id="prodSizes" class="input-box" placeholder="Sizes (S,M,L,XL)">
      <button class="save-btn" id="saveProductBtn">Save Product</button>
      <h3 style="margin-top:25px;">Existing Products</h3>
      <div id="productList"></div>`;
    setTimeout(() => {
      document.getElementById("saveProductBtn").onclick = saveProduct;
      loadProducts();
    }, 50);
  }
};

// 💾 Save product
async function saveProduct() {
  const name = val("prodName");
  const price = parseFloat(val("prodPrice"));
  const category = val("prodCategory");
  const description = val("prodDesc");
  const images = val("prodImages");
  const sizes = val("prodSizes");
  if (!name || !price || !category || !images) return showToast("Fill required fields ❌", "error");

  const { error } = await supabase.from("products").insert([{ name, price, category, description, images, sizes }]);
  if (error) return showToast("Error ❌", "error");
  showToast("Product added ✅", "success");
  document.querySelectorAll(".input-box").forEach(i => (i.value = ""));
  loadProducts();
}

async function loadProducts() {
  const c = document.getElementById("productList");
  const { data, error } = await supabase.from("products").select("*").order("id", { ascending: false });
  if (error) return (c.innerHTML = "Error loading products ❌");
  if (!data.length) return (c.innerHTML = "<p>No products yet.</p>");
  c.innerHTML = "";
  data.forEach(p => {
    const img = p.images?.split(",")[0]?.trim() || "";
    c.innerHTML += `
      <div class="product-box">
        <img src="${img}">
        <div>
          <b>${p.name}</b><br><small>${p.category}</small><br>${p.price}€
        </div>
        <button onclick="deleteProduct(${p.id})">Delete</button>
      </div>`;
  });
}

window.deleteProduct = async function(id) {
  if (!confirm("Delete this product?")) return;
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) showToast("Delete failed ❌", "error");
  else {
    loadProducts();
    showToast("Deleted ✅", "success");
  }
};

function val(id) {
  return document.getElementById(id).value.trim();
}

// 🧃 Toast
function showToast(msg, type = "info") {
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add("show"), 50);
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 400);
  }, 1800);
}

// Initial load
loadMessages();

// -----------------------------------------
// 🔥 Supabase Connection
// -----------------------------------------
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// -----------------------------------------
// 🔐 Admin Access Check
// -----------------------------------------
// İstersen burayı kendi kullanıcı adlarına göre düzenleyebilirsin
const ADMINS = ["luivoss", "fisami"]; 
const loggedUser = localStorage.getItem("loggedInUser");

if (!loggedUser || !ADMINS.includes(loggedUser.toLowerCase())) {
  window.location.href = "index.html";
}

// -----------------------------------------
// TAB & VIEW ELEMENTLERİ
// -----------------------------------------
const tabMessages = document.getElementById("tabMessages");
const tabProducts = document.getElementById("tabProducts");
const messagesView = document.getElementById("messagesView");
const productsView = document.getElementById("productsView");

function setActiveTab(tab) {
  document
    .querySelectorAll(".admin-menu button")
    .forEach((b) => b.classList.remove("active"));
  tab.classList.add("active");
}

tabMessages.onclick = () => {
  setActiveTab(tabMessages);
  messagesView.style.display = "block";
  productsView.style.display = "none";
  loadMessages();
};

tabProducts.onclick = () => {
  setActiveTab(tabProducts);
  messagesView.style.display = "none";
  productsView.style.display = "block";
};

// -----------------------------------------
// 📥 Messages: Load & Render
// -----------------------------------------
const msgContainer = document.getElementById("adminMessages");
const filterSelect = document.getElementById("filterCategory");
const confirmPopup = document.getElementById("confirmPopup");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
const confirmText = document.getElementById("confirmText");

let allMessages = [];
let deleteTarget = null;

// 🔄 Fetch messages
async function loadMessages() {
  msgContainer.innerHTML = "<p style='opacity:.6;'>Loading...</p>";
  const { data, error } = await supabase.from("messages").select("*");

  if (error) {
    console.error("Load error:", error);
    msgContainer.innerHTML = "<p>Error loading messages.</p>";
    return;
  }

  // En yeni id en üstte olacak şekilde sırala
  data.sort((a, b) => Number(b.id) - Number(a.id));

  allMessages = data;
  renderMessages();
}

// 🧾 Render messages
function renderMessages() {
  msgContainer.innerHTML = "";
  let list = [...allMessages];

  const cat = filterSelect.value;
  if (cat !== "All") list = list.filter((m) => m.category === cat);

  if (!list.length) {
    msgContainer.innerHTML = "<p style='opacity:.6;'>No messages found.</p>";
    return;
  }

  list.forEach((msg) => {
    const html = `
      <div class="msg-box" id="msg-${msg.id}">
        <div class="msg-top">
          <div>
            <div class="msg-sender">${msg.name || "Unknown"}</div>
            <div class="msg-email">${msg.email || ""}</div>
            <div class="msg-category">${msg.category || "No Category"}</div>
            <div class="msg-date">${msg.date || ""}</div>
          </div>
          <button class="msg-delete" data-id="${msg.id}">Delete</button>
        </div>
        <div class="msg-text">${msg.message || ""}</div>
        ${
          msg.file
            ? `<img src="${msg.file}" class="msg-img" data-url="${msg.file}" />`
            : ""
        }
      </div>
    `;
    msgContainer.insertAdjacentHTML("beforeend", html);
  });

  bindMessageEvents();
}

// 🖱️ Events
function bindMessageEvents() {
  // delete buttons
  document.querySelectorAll(".msg-delete").forEach((btn) => {
    btn.onclick = () => openConfirmPopup(btn.dataset.id);
  });

  // image click
  document.querySelectorAll(".msg-img").forEach((img) => {
    img.onclick = () => openImage(img.dataset.url);
  });
}

// -----------------------------------------
// 🧨 Delete Confirmation
// -----------------------------------------
function openConfirmPopup(id) {
  deleteTarget = id;
  confirmText.textContent = "Delete this message?";
  confirmPopup.classList.add("show");
}

confirmYes.onclick = async () => {
  if (!deleteTarget) return;
  confirmPopup.classList.remove("show");

  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", deleteTarget);

  if (error) {
    console.error("Delete failed:", error);
    showToast("Delete failed ❌", "error");
    return;
  }

  allMessages = allMessages.filter(
    (m) => String(m.id) !== String(deleteTarget)
  );
  renderMessages();
  showToast("Deleted permanently ✅", "success");
};

confirmNo.onclick = () => confirmPopup.classList.remove("show");

// -----------------------------------------
// 🖼️ Image Modal
// -----------------------------------------
window.openImage = (url) => {
  document.getElementById("imgModalContent").src = url;
  document.getElementById("imgModal").style.display = "flex";
};
window.closeImgModal = () => {
  document.getElementById("imgModal").style.display = "none";
};

// -----------------------------------------
// 🔔 Toast Notification
// -----------------------------------------
function showToast(msg, type = "info") {
  let toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 50);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 1800);
}

// Kategori değişince yeniden filtrele
filterSelect.onchange = renderMessages;

// -----------------------------------------
// 🧢 PRODUCTS: Insert
// -----------------------------------------
const prodName = document.getElementById("prodName");
const prodCategory = document.getElementById("prodCategory");
const prodPrice = document.getElementById("prodPrice");
const prodDesc = document.getElementById("prodDesc");
const prodImages = document.getElementById("prodImages");
const saveProductBtn = document.getElementById("saveProduct");

if (saveProductBtn) {
  saveProductBtn.onclick = saveProduct;
}

async function saveProduct() {
  const name = (prodName.value || "").trim();
  const category = (prodCategory.value || "").trim();
  const price = parseFloat(prodPrice.value);
  const description = (prodDesc.value || "").trim();
  const images = (prodImages.value || "").trim(); // text kolonuna JSON veya virgüllü string yazacağız

  if (!name || !category || !price || !description || !images) {
    showToast("Please fill all fields.", "error");
    return;
  }

  const { error } = await supabase.from("products").insert([
    {
      name,
      category,
      price,
      description,
      images,
    },
  ]);

  if (error) {
    console.error(error);
    showToast("Error saving product.", "error");
  } else {
    showToast("Product added successfully ✅", "success");
    prodName.value = "";
    prodPrice.value = "";
    prodDesc.value = "";
    prodImages.value = "";
    prodCategory.value = "T-Shirts";
  }
}

// -----------------------------------------
// 🚀 Start with Messages tab
// -----------------------------------------
messagesView.style.display = "block";
productsView.style.display = "none";
setActiveTab(tabMessages);
loadMessages();

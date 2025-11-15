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
const ADMINS = ["luivoss", "fisami"]; // 👈 Supabase'deki username'lerle birebir aynı olmalı!
const loggedUser = localStorage.getItem("loggedInUser");

if (!loggedUser || !ADMINS.includes(loggedUser.toLowerCase())) {
  // 👇 Uyarı göstermeden direkt ana sayfaya yönlendir
  window.location.href = "index.html";
}

// -----------------------------------------
// 📥 Load Messages
// -----------------------------------------
const msgContainer = document.getElementById("adminMessages");
const filterSelect = document.getElementById("filterCategory");
const sortButton = document.getElementById("sortButton");
const confirmPopup = document.getElementById("confirmPopup");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
const confirmText = document.getElementById("confirmText");

let allMessages = [];
let sortOrder = "desc";
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

  allMessages = data;
  renderMessages();
}

// -----------------------------------------
// 🧾 Render messages
// -----------------------------------------
function renderMessages() {
  msgContainer.innerHTML = "";
  let list = [...allMessages];

  const cat = filterSelect.value;
  if (cat !== "All") list = list.filter((m) => m.category === cat);

  list.sort((a, b) => {
    const dA = new Date(a.date);
    const dB = new Date(b.date);
    return sortOrder === "desc" ? dB - dA : dA - dB;
  });

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

  bindEvents();
}

// -----------------------------------------
// 🖱️ Events
// -----------------------------------------
function bindEvents() {
  document.querySelectorAll(".msg-delete").forEach((btn) => {
    btn.onclick = () => openConfirmPopup(btn.dataset.id);
  });

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

  const { error } = await supabase.from("messages").delete().eq("id", deleteTarget);
  if (error) {
    console.error("Delete failed:", error);
    showToast("Delete failed ❌", "error");
    return;
  }

  allMessages = allMessages.filter((m) => String(m.id) !== String(deleteTarget));
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
// 🔁 Sorting & Filtering
// -----------------------------------------
sortButton.onclick = () => {
  sortOrder = sortOrder === "desc" ? "asc" : "desc";
  sortButton.textContent =
    sortOrder === "desc" ? "Sort: Newest First" : "Sort: Oldest First";
  renderMessages();
};
filterSelect.onchange = renderMessages;

// -----------------------------------------
// 🔔 Toast Notification
// -----------------------------------------
function showToast(msg, type = "info") {
  let toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 2000);
}

const style = document.createElement("style");
style.innerHTML = `
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%) scale(0.9);
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
.toast.success { border-color:#00aa66; color:#00ff99; }
.toast.error { border-color:#aa0000; color:#ff6666; }
`;
document.head.appendChild(style);

// -----------------------------------------
// 🚀 Start
// -----------------------------------------
loadMessages();

// -----------------------------------------
// 🔥 Supabase Connection
// -----------------------------------------
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// -----------------------------------------
// 🔐 Admin Access
// -----------------------------------------
const ADMINS = ["luivoss", "fisami"];
const loggedUser = localStorage.getItem("loggedInUser");

if (!loggedUser || !ADMINS.includes(loggedUser.toLowerCase())) {
  window.location.href = "index.html";
}

// -----------------------------------------
// 📥 DOM Elements
// -----------------------------------------
const msgContainer = document.getElementById("adminMessages");
const filterSelect = document.getElementById("filterCategory");
const confirmPopup = document.getElementById("confirmPopup");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
const confirmText = document.getElementById("confirmText");

let allMessages = [];
let deleteTarget = null;

// -----------------------------------------
// 🔄 Load Messages
// -----------------------------------------
async function loadMessages() {
  msgContainer.innerHTML = "<p style='opacity:.6;'>Loading...</p>";

  const { data, error } = await supabase.from("messages").select("*");
  if (error) {
    console.error("Load error:", error);
    msgContainer.innerHTML = "<p>Error loading messages.</p>";
    return;
  }

  allMessages = data || [];
  renderMessages();
}

// -----------------------------------------
// 🧾 Render Messages
// -----------------------------------------
function renderMessages() {
  msgContainer.innerHTML = "";

  let list = [...allMessages];
  const cat = filterSelect.value;
  if (cat && cat !== "All") list = list.filter((m) => m.category === cat);

  if (!list.length) {
    msgContainer.innerHTML = "<p style='opacity:.6;'>No messages found.</p>";
    return;
  }

  list.forEach((msg) => {
    const html = `
      <div class="msg-box ${msg.read ? "read" : "unread"}" id="msg-${msg.id}">
        <div class="msg-top">
          <div>
            <div class="msg-sender">${msg.name || "Unknown"}</div>
            <div class="msg-email">${msg.email || ""}</div>
            <div class="msg-category">${msg.category || "No Category"}</div>
            <div class="msg-date">${
              msg.date ? new Date(msg.date).toLocaleString("tr-TR") : "—"
            }</div>
          </div>

          <div class="msg-actions">
            ${
              !msg.read
                ? `<span class="unread-dot" title="Unread"></span>`
                : ""
            }
            <button class="msg-delete" data-id="${msg.id}">🗑️</button>
          </div>
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
  document.querySelectorAll(".msg-box").forEach((box) => {
    box.onclick = () => markAsRead(box.id.replace("msg-", ""));
  });

  document.querySelectorAll(".msg-delete").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      openConfirmPopup(btn.dataset.id);
    };
  });

  document.querySelectorAll(".msg-img").forEach((img) => {
    img.onclick = (e) => {
      e.stopPropagation();
      openImage(img.dataset.url);
    };
  });
}

// -----------------------------------------
// ✅ Mark as Read
// -----------------------------------------
async function markAsRead(id) {
  const msg = allMessages.find((m) => m.id === id);
  if (!msg || msg.read) return;

  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("id", id);

  if (error) {
    console.error("Read update failed:", error);
    showToast("Failed to mark as read ❌", "error");
    return;
  }

  msg.read = true;
  renderMessages();
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
// 🔔 Toast
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

// -----------------------------------------
// 💅 Extra Styles
// -----------------------------------------
const style = document.createElement("style");
style.innerHTML = `
.unread-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  margin-right: 8px;
  vertical-align: middle;
}
.msg-box.unread {
  border-left: 4px solid #00aa66;
  background: #111;
}
.msg-box.read {
  opacity: 0.8;
}
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

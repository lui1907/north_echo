import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const msgContainer = document.getElementById("adminMessages");
const filterSelect = document.getElementById("filterCategory");
const sortButton = document.getElementById("sortButton");
const imgModal = document.getElementById("imgModal");
const imgContent = document.getElementById("imgModalContent");

let allMessages = [];
let sortOrder = "desc"; // newest first

// ----------------------
// 🔔 Toast Bildirim
// ----------------------
function showToast(text, type = "info") {
  const oldToast = document.querySelector(".toast");
  if (oldToast) oldToast.remove();

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = text;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 2300);
}

// Toast CSS'i otomatik ekle
const style = document.createElement("style");
style.innerHTML = `
.toast {
  position: fixed;
  bottom: 25px;
  right: 25px;
  background: #111;
  border: 1px solid #333;
  color: white;
  padding: 14px 20px;
  border-radius: 10px;
  z-index: 999999;
  opacity: 0.95;
  box-shadow: 0 0 15px rgba(0,0,0,0.5);
  font-size: 15px;
  transition: opacity .3s;
}
.toast.success { border-color: #00aa66; color: #00dd88; }
.toast.error { border-color: #660000; color: #ff6666; }
`;
document.head.appendChild(style);

// ----------------------
// 📩 MESAJLARI YÜKLE
// ----------------------
async function loadMessages() {
  msgContainer.innerHTML = "<p style='opacity:.6;'>Loading...</p>";

  const { data, error } = await supabase.from("messages").select("*");
  if (error) {
    console.error(error);
    showToast("Error loading messages", "error");
    msgContainer.innerHTML = "<p>Error loading messages.</p>";
    return;
  }

  allMessages = data || [];
  renderMessages();
}

// ----------------------
// 🖼️ MESAJLARI LİSTELE
// ----------------------
function renderMessages() {
  msgContainer.innerHTML = "";

  let list = [...allMessages];

  const category = filterSelect.value;
  if (category !== "All") list = list.filter((m) => m.category === category);

  list.sort((a, b) => {
    const dA = new Date(a.date);
    const dB = new Date(b.date);
    return sortOrder === "desc" ? dB - dA : dA - dB;
  });

  if (list.length === 0) {
    msgContainer.innerHTML = "<p style='opacity:.6;'>No messages found.</p>";
    return;
  }

  for (const msg of list) {
    const safeMsg = msg.message?.replace(/\n/g, "<br>") || "";

    const card = document.createElement("div");
    card.className = "msg-box";
    card.innerHTML = `
      <div class="msg-top">
        <div>
          <div class="msg-sender">${msg.name || "Unknown"}</div>
          <div class="msg-email" style="opacity:.7;">${msg.email || ""}</div>
          <div class="msg-category">${msg.category || "No Category"}</div>
          <div class="msg-date">${msg.date || ""}</div>
        </div>
        <button class="msg-delete" data-id="${msg.id}">Delete</button>
      </div>
      <div class="msg-text">${safeMsg}</div>
      ${
        msg.file
          ? `<img src="${msg.file}" class="msg-img" data-url="${msg.file}" alt="attachment">`
          : ""
      }
    `;
    msgContainer.appendChild(card);
  }

  bindEvents();
}

// ----------------------
// ⚡ BUTONLARI BAĞLA
// ----------------------
function bindEvents() {
  // DELETE
  document.querySelectorAll(".msg-delete").forEach((btn) => {
    btn.onclick = async () => {
      const id = btn.getAttribute("data-id");
      if (!confirm("Are you sure you want to delete this message?")) return;

      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) {
        console.error(error);
        showToast("Failed to delete message", "error");
      } else {
        showToast("Message deleted", "success");
        allMessages = allMessages.filter((m) => m.id !== id);
        renderMessages();
      }
    };
  });

  // IMAGE MODAL
  document.querySelectorAll(".msg-img").forEach((img) => {
    img.onclick = () => {
      imgContent.src = img.getAttribute("data-url");
      imgModal.style.display = "flex";
    };
  });
}

// ----------------------
// ✕ MODAL KAPAT
// ----------------------
window.closeImgModal = function () {
  imgModal.style.display = "none";
};

// ----------------------
// 🔁 SIRALAMA BUTONU
// ----------------------
sortButton.addEventListener("click", () => {
  sortOrder = sortOrder === "desc" ? "asc" : "desc";
  sortButton.textContent =
    sortOrder === "desc" ? "Sort: Newest First" : "Sort: Oldest First";
  renderMessages();
});

// ----------------------
// 🧩 FİLTRE
// ----------------------
filterSelect.addEventListener("change", renderMessages);

// ----------------------
// 🚀 BAŞLAT
// ----------------------
loadMessages();

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
let sortOrder = "desc";

// ----------------------------------------
// 🔔 Modern Toast Bildirim
// ----------------------------------------
function showToast(msg, type = "info") {
  let toast = document.createElement("div");
  toast.className = `custom-toast ${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 2400);
}

// CSS ekle
const style = document.createElement("style");
style.innerHTML = `
.custom-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  background: rgba(20,20,20,0.95);
  border: 1px solid #333;
  color: white;
  padding: 14px 22px;
  border-radius: 12px;
  z-index: 999999;
  opacity: 0;
  transition: all 0.3s ease;
  font-size: 16px;
  box-shadow: 0 0 25px rgba(0,0,0,0.5);
}
.custom-toast.show {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
.custom-toast.success { border-color: #00aa66; color: #00ff99; }
.custom-toast.error { border-color: #880000; color: #ff6666; }
`;
document.head.appendChild(style);

// ----------------------------------------
// 📩 MESAJLARI YÜKLE
// ----------------------------------------
async function loadMessages() {
  msgContainer.innerHTML = "<p style='opacity:.6;'>Loading...</p>";

  const { data, error } = await supabase.from("messages").select("*");
  if (error) {
    console.error(error);
    showToast("Failed to load messages", "error");
    msgContainer.innerHTML = "<p>Error loading messages.</p>";
    return;
  }

  allMessages = Array.isArray(data) ? data : [];
  renderMessages();
}

// ----------------------------------------
// 🖼️ MESAJLARI GÖSTER
// ----------------------------------------
function renderMessages() {
  msgContainer.innerHTML = "";

  let list = [...allMessages];

  // kategori filtresi
  const cat = filterSelect.value;
  if (cat !== "All") list = list.filter((m) => m.category === cat);

  // sıralama
  list.sort((a, b) => {
    const dA = new Date(a.date);
    const dB = new Date(b.date);
    return sortOrder === "desc" ? dB - dA : dA - dB;
  });

  if (!list.length) {
    msgContainer.innerHTML = "<p style='opacity:.6;'>No messages found.</p>";
    return;
  }

  for (const msg of list) {
    const safeText = msg.message?.replace(/\n/g, "<br>") || "";
    const html = `
      <div class="msg-box" id="msg-${msg.id}">
        <div class="msg-top">
          <div>
            <div class="msg-sender">${msg.name || "Unknown"}</div>
            <div class="msg-email" style="opacity:.7;">${msg.email || ""}</div>
            <div class="msg-category">${msg.category || "No Category"}</div>
            <div class="msg-date">${msg.date || ""}</div>
          </div>
          <button class="msg-delete" data-id="${msg.id}">Delete</button>
        </div>
        <div class="msg-text">${safeText}</div>
        ${
          msg.file
            ? `<img src="${msg.file}" class="msg-img" data-url="${msg.file}" alt="attachment">`
            : ""
        }
      </div>
    `;
    msgContainer.insertAdjacentHTML("beforeend", html);
  }

  attachEvents();
}

// ----------------------------------------
// 🎛️ EVENTLER
// ----------------------------------------
function attachEvents() {
  // delete
  document.querySelectorAll(".msg-delete").forEach((btn) => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      const ok = confirm("Are you sure you want to delete this message?");
      if (!ok) return;

      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) {
        console.error(error);
        showToast("Delete failed!", "error");
      } else {
        showToast("Message deleted ✅", "success");
        allMessages = allMessages.filter((m) => m.id !== id);
        renderMessages();
      }
    };
  });

  // image modal
  document.querySelectorAll(".msg-img").forEach((img) => {
    img.onclick = () => {
      imgContent.src = img.dataset.url;
      imgModal.style.display = "flex";
    };
  });
}

// ----------------------------------------
// ✖ MODAL KAPAT
// ----------------------------------------
window.closeImgModal = function () {
  imgModal.style.display = "none";
};

// ----------------------------------------
// 🔁 SIRALAMA
// ----------------------------------------
sortButton.onclick = async () => {
  sortOrder = sortOrder === "desc" ? "asc" : "desc";
  sortButton.textContent =
    sortOrder === "desc" ? "Sort: Newest First" : "Sort: Oldest First";
  renderMessages();
};

// ----------------------------------------
// 🧩 FİLTRE
// ----------------------------------------
filterSelect.onchange = renderMessages;

// ----------------------------------------
// 🚀 BAŞLAT
// ----------------------------------------
loadMessages();

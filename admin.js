import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🔒 Admin listesi
const ADMINS = ["luivoss", "ahmet", "owner", "admin"];
const user = localStorage.getItem("loggedInUser");

if (!user || !ADMINS.includes(user.toLowerCase())) {
  alert("Access denied.");
  window.location.href = "index.html";
}

const msgBox = document.getElementById("adminMessages");
let allMessages = [];

// 🔄 MESAJLARI YÜKLE
async function loadMessages() {
  msgBox.innerHTML = "<p style='opacity:.6;'>Loading...</p>";

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    msgBox.innerHTML = "<p style='color:red;'>Failed to load messages.</p>";
    return;
  }

  if (!data || data.length === 0) {
    msgBox.innerHTML = "<p style='opacity:.6;'>No support messages yet.</p>";
    return;
  }

  allMessages = data;
  renderMessages("all");
}

// 🎛 FİLTRE BUTONLARI
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderMessages(btn.dataset.filter);
  });
});

// 🖼 MESAJLARI GÖRÜNTÜLE
function renderMessages(filter) {
  let list = allMessages;

  if (filter === "unread") list = list.filter((m) => !m.read);
  if (filter === "withfile") list = list.filter((m) => m.file);

  msgBox.innerHTML = "";

  list.forEach((msg) => {
    msgBox.innerHTML += `
      <div class="msg-box">
        <div class="read-dot ${msg.read ? "read" : ""}" onclick="toggleRead(${msg.id})"></div>
        <button class="msg-delete" onclick="deleteMsg(${msg.id})">Delete</button>
        <div class="msg-content">
          <h3>${msg.name}</h3>
          <div class="msg-email">${msg.email}</div>
          <div class="msg-category">Category: ${msg.category || "Unknown"}</div>
          <div class="msg-text">${msg.message || "(empty)"}</div>
          ${msg.file ? `<img src="${msg.file}" class="msg-img" onclick="openImgModal('${msg.file}')">` : ""}
          <div class="msg-date">${msg.date}</div>
        </div>
      </div>
    `;
  });
}

// 🟢 OKUNDU / OKUNMADI
window.toggleRead = async function (id) {
  const msg = allMessages.find((m) => m.id === id);
  await supabase.from("messages").update({ read: !msg.read }).eq("id", id);
  loadMessages();
};

// 🗑 MESAJ SİL
window.deleteMsg = async function (id) {
  if (!confirm("Delete this message?")) return;
  await supabase.from("messages").delete().eq("id", id);
  loadMessages();
};

// 📸 GÖRSEL MODAL
window.openImgModal = function (url) {
  document.getElementById("imgModalContent").src = url;
  document.getElementById("imgModal").style.display = "flex";
};
window.closeImgModal = function () {
  document.getElementById("imgModal").style.display = "none";
};

// 🔁 BAŞLAT
loadMessages();

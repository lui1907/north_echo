import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🔒 Admin kullanıcıları
const ADMINS = ["fstekin", "luivoss", "owner", "admin"];
const user = localStorage.getItem("loggedInUser");

if (!user || !ADMINS.includes(user.toLowerCase())) {
  alert("Access denied.");
  window.location.href = "index.html";
}

const msgBox = document.getElementById("adminMessages");
let allMessages = [];

// 🔄 Mesajları yükle
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

// 🎛 Filtre butonları
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderMessages(btn.dataset.filter);
  });
});

// 🖼 Mesajları görüntüle
function renderMessages(filter) {
  let list = allMessages;

  if (filter === "withfile") list = list.filter((m) => m.file);

  msgBox.innerHTML = "";

  list.forEach((msg) => {
    msgBox.innerHTML += `
      <div class="msg-box">
        <button class="msg-delete" onclick="deleteMsg(${msg.id})">Delete</button>
        <div class="msg-content">
          <h3>${msg.name}</h3>
          <div class="msg-email">${msg.email}</div>
          <div class="msg-category">Category: ${msg.category || "Unknown"}</div>
          <div class="msg-text">${msg.message || "(empty)"}</div>
          ${
            msg.file
              ? `<img src="${msg.file}" class="msg-img" onclick="openImgModal('${msg.file}')">`
              : ""
          }
          <div class="msg-date">${msg.date}</div>
        </div>
      </div>
    `;
  });
}

// 🗑 Mesaj sil
window.deleteMsg = async function (id) {
  if (!confirm("Delete this message?")) return;
  await supabase.from("messages").delete().eq("id", id);
  loadMessages();
};

// 📸 Görsel modal
window.openImgModal = function (url) {
  document.getElementById("imgModalContent").src = url;
  document.getElementById("imgModal").style.display = "flex";
};
window.closeImgModal = function () {
  document.getElementById("imgModal").style.display = "none";
};

// 🔁 Başlat
loadMessages();

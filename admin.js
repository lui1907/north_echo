// -----------------------------------------
// 🔥 Supabase Bağlantısı
// -----------------------------------------
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.32.0/dist/esm/supabase.js";

const supabase = createClient(
  "https://xedfviwffpsvbmyqzoof.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM"
);


// -----------------------------------------
// 🔐 Admin Kontrol
// -----------------------------------------
const ADMINS = ["owner", "admin", "ahmet", "luivoss", "fstekin"];

let loggedUser = localStorage.getItem("loggedInUser");

if (!loggedUser || !ADMINS.includes(loggedUser.toLowerCase())) {
  window.location.href = "index.html";
}


// -----------------------------------------
// 📩 Mesajları Yükle
// -----------------------------------------
const msgBox = document.getElementById("adminMessages");
let ALL_MESSAGES = [];

async function loadMessages() {
  msgBox.innerHTML = "<p style='opacity:.6;'>Loading...</p>";

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Fetch error:", error);
    msgBox.innerHTML = "<p style='color:red;'>Failed to load messages.</p>";
    return;
  }

  ALL_MESSAGES = data;
  renderMessages("all");
}


// -----------------------------------------
// 🎛️ Filtreleme
// -----------------------------------------
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    renderMessages(btn.dataset.filter);
  });
});


// -----------------------------------------
// 🖨️ Mesajları Listele
// -----------------------------------------
function renderMessages(filterType) {
  msgBox.innerHTML = "";

  let list = [...ALL_MESSAGES];

  if (filterType === "unread") {
    list = list.filter(msg => msg.read === false);
  }

  if (filterType === "withfile") {
    list = list.filter(msg => msg.file && msg.file !== "");
  }

  if (list.length === 0) {
    msgBox.innerHTML = "<p style='opacity:.6;'>No messages.</p>";
    return;
  }

  list.forEach(msg => {
    msgBox.innerHTML += `
      <div class="msg-box">

        <div class="msg-top">
          <div>
            <div class="msg-sender">${msg.name}</div>
            <div class="msg-email">${msg.email}</div>
          </div>

          <button class="msg-delete" onclick="deleteMessage('${msg.id}')">
            Delete
          </button>
        </div>

        <div class="msg-text">${msg.message}</div>

        ${msg.file ? 
          `<img src="${msg.file}" class="msg-img" onclick="openImgModal('${msg.file}')">`
          : ""
        }

        <div class="msg-date">${msg.date}</div>

        <textarea id="reply-${msg.id}" class="reply-input" placeholder="Write admin reply...">${msg.reply || ""}</textarea>

        <button class="reply-btn" onclick="sendReply('${msg.id}')">Send Reply</button>
      </div>
    `;
  });
}


// -----------------------------------------
// 💬 Reply Gönder
// -----------------------------------------
window.sendReply = async function (id) {
  const replyText = document.getElementById(`reply-${id}`).value;

  const { error } = await supabase
    .from("messages")
    .update({
      reply: replyText,
      read: true
    })
    .eq("id", id);

  if (error) return alert("Error saving reply.");

  alert("Reply saved.");
  loadMessages();
};


// -----------------------------------------
// 🗑️ Mesaj Sil
// -----------------------------------------
window.deleteMessage = async function (id) {
  if (!confirm("Delete this message?")) return;

  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", id);

  if (error) return alert("Delete failed.");

  loadMessages();
};


// -----------------------------------------
// 🖼️ Fotoğraf Modal
// -----------------------------------------
window.openImgModal = function (url) {
  document.getElementById("imgModalContent").src = url;
  document.getElementById("imgModal").style.display = "flex";
};

window.closeImgModal = function () {
  document.getElementById("imgModal").style.display = "none";
};


// -----------------------------------------
// 🚀 Başlangıç
// -----------------------------------------
loadMessages();

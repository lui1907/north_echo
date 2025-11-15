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
// 📨 Fetch Messages
// -----------------------------------------
const msgContainer = document.getElementById("adminMessages");
const filterSelect = document.getElementById("filterCategory");
let allMessages = [];

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
// 🧾 Render Messages
// -----------------------------------------
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

  bindEvents();
}

// -----------------------------------------
// 🖱️ Events
// -----------------------------------------
function bindEvents() {
  document.querySelectorAll(".msg-delete").forEach((btn) => {
    btn.onclick = () => deleteMessage(btn.dataset.id);
  });
  document.querySelectorAll(".msg-img").forEach((img) => {
    img.onclick = () => openImage(img.dataset.url);
  });
}

// -----------------------------------------
// 🗑️ Delete Message
// -----------------------------------------
async function deleteMessage(id) {
  if (!confirm("Delete this message?")) return;

  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) {
    alert("Delete failed ❌");
    console.error(error);
    return;
  }

  allMessages = allMessages.filter((m) => String(m.id) !== String(id));
  renderMessages();
  alert("Deleted ✅");
}

// -----------------------------------------
// 🖼️ Image Modal
// -----------------------------------------
window.openImage = (url) => {
  const modal = document.getElementById("imgModal");
  const img = document.getElementById("imgModalContent");
  img.src = url;
  modal.style.display = "flex";
};
window.closeImgModal = () => {
  document.getElementById("imgModal").style.display = "none";
};

// -----------------------------------------
// 🔄 Filter
// -----------------------------------------
filterSelect.onchange = renderMessages;

// -----------------------------------------
// 🚀 Start
// -----------------------------------------
loadMessages();

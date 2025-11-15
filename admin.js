import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🔒 Sadece adminler erişebilsin
const ADMINS = ["ahmet", "luivoss", "owner", "admin"];
const user = localStorage.getItem("loggedInUser");
if (!user || !ADMINS.includes(user.toLowerCase())) {
  alert("Access denied. Only admins can view this page.");
  window.location.href = "index.html";
}

const msgBox = document.getElementById("adminMessages");

// 🔄 MESAJLARI YÜKLE
async function loadMessages() {
  msgBox.innerHTML = "<p style='opacity:.6;'>Loading...</p>";

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    msgBox.innerHTML = "<p style='color:red;'>Failed to load messages.</p>";
    console.log(error);
    return;
  }

  if (!data || data.length === 0) {
    msgBox.innerHTML = "<p style='opacity:.6;'>No messages yet.</p>";
    return;
  }

  renderMessages(data);
}

// 🔎 MESAJLARI EKRANA YAZ
function renderMessages(list) {
  msgBox.innerHTML = "";

  list.forEach((msg) => {
    msgBox.innerHTML += `
      <div class="msg-box">
        <div class="read-dot ${msg.read ? "read" : ""}"></div>
        <button class="msg-delete" onclick="deleteMsg('${msg.id}')">Delete</button>
        <h3>${msg.name}</h3>
        <p>${msg.email}</p>
        <p class="msg-category">Category: ${msg.category || "Unknown"}</p>
        <p>${msg.message}</p>
        ${msg.file ? `<img class="msg-img" src="${msg.file}" onclick="openImgModal('${msg.file}')">` : ""}
        <div class="msg-date">${msg.date}</div>
      </div>
    `;
  });
}

// 🗑 SİLME
window.deleteMsg = async function (id) {
  if (!confirm("Delete this message?")) return;
  await supabase.from("messages").delete().eq("id", id);
  loadMessages();
};

// 🖼 RESİM BÜYÜTME
window.openImgModal = function (url) {
  document.getElementById("imgModalContent").src = url;
  document.getElementById("imgModal").style.display = "flex";
};

window.closeImgModal = function () {
  document.getElementById("imgModal").style.display = "none";
};

loadMessages();

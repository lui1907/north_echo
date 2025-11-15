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
let sortOrder = "desc"; // desc = newest first

// 🔹 MESAJLARI YÜKLE
async function loadMessages() {
  msgContainer.innerHTML = "<p style='opacity:.6;'>Loading...</p>";

  const { data, error } = await supabase.from("messages").select("*");

  if (error) {
    console.error("Load error:", error);
    msgContainer.innerHTML = "<p>Error loading messages.</p>";
    return;
  }

  // Güncel listeyi kaydet
  allMessages = Array.isArray(data) ? data : [];
  renderMessages();
}

// 🔹 MESAJLARI GÖSTER
function renderMessages() {
  msgContainer.innerHTML = "";

  let list = [...allMessages];

  // Kategori filtresi
  const category = filterSelect.value;
  if (category !== "All") list = list.filter((m) => m.category === category);

  // Tarihe göre sırala
  list.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  if (list.length === 0) {
    msgContainer.innerHTML = "<p style='opacity:.6;'>No messages found.</p>";
    return;
  }

  // Mesajları render et
  list.forEach((msg) => {
    const safeMessage = msg.message ? msg.message.replace(/\n/g, "<br>") : "";

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

        <div class="msg-text">${safeMessage}</div>

        ${
          msg.file
            ? `<img src="${msg.file}" class="msg-img" data-url="${msg.file}" alt="attachment">`
            : ""
        }
      </div>
    `;

    msgContainer.insertAdjacentHTML("beforeend", html);
  });

  // Her render'dan sonra butonları yeniden bağla
  bindEvents();
}

// 🔹 BUTON EVENTLERİ
function bindEvents() {
  // Delete
  document.querySelectorAll(".msg-delete").forEach((btn) => {
    btn.onclick = async () => {
      const id = btn.getAttribute("data-id");
      if (!confirm("Delete this message?")) return;

      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) {
        console.error(error);
        alert("Failed to delete message.");
      } else {
        alert("Message deleted.");
        // Anında listeden kaldır
        allMessages = allMessages.filter((m) => m.id !== id);
        renderMessages();
      }
    };
  });

  // Image modal
  document.querySelectorAll(".msg-img").forEach((img) => {
    img.onclick = () => {
      imgContent.src = img.getAttribute("data-url");
      imgModal.style.display = "flex";
    };
  });
}

// 🔹 MODAL KAPATMA
window.closeImgModal = function () {
  imgModal.style.display = "none";
};

// 🔹 SIRALAMA BUTONU
sortButton.addEventListener("click", () => {
  sortOrder = sortOrder === "desc" ? "asc" : "desc";
  sortButton.textContent =
    sortOrder === "desc" ? "Sort: Newest First" : "Sort: Oldest First";
  renderMessages();
});

// 🔹 FİLTRE MENÜSÜ
filterSelect.addEventListener("change", renderMessages);

// 🔹 SAYFA YÜKLENİNCE BAŞLAT
loadMessages();

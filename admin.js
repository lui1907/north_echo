import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const msgContainer = document.getElementById("adminMessages");
const filterSelect = document.getElementById("filterCategory");
const sortButton = document.getElementById("sortButton");

let allMessages = [];
let sortOrder = "desc"; // varsayılan: yeni → eski

// 🔹 MESAJLARI YÜKLE
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

// 🔹 MESAJLARI LİSTELE
function renderMessages() {
  msgContainer.innerHTML = "";

  let list = [...allMessages];

  // Filtreleme (kategori)
  const category = filterSelect.value;
  if (category !== "All") list = list.filter((m) => m.category === category);

  // Sıralama
  list.sort((a, b) => {
    const dA = new Date(a.date);
    const dB = new Date(b.date);
    return sortOrder === "desc" ? dB - dA : dA - dB;
  });

  if (list.length === 0) {
    msgContainer.innerHTML = "<p style='opacity:.6;'>No messages found.</p>";
    return;
  }

  list.forEach((msg) => {
    msgContainer.innerHTML += `
      <div class="msg-box">
        <div class="msg-top">
          <div>
            <div class="msg-sender">${msg.name || "Unknown"}</div>
            <div class="msg-email" style="opacity:.7;">${msg.email || ""}</div>
            <div class="msg-category">${msg.category || "No Category"}</div>
            <div class="msg-date">${msg.date || ""}</div>
          </div>
          <button class="msg-delete" data-id="${msg.id}">Delete</button>
        </div>

        <div class="msg-text">${msg.message || ""}</div>

        ${
          msg.file
            ? `<img src="${msg.file}" class="msg-img" onclick="window.open('${msg.file}', '_blank')">`
            : ""
        }
      </div>
    `;
  });

  // 🔹 Her render'dan sonra delete butonlarını aktif et
  document.querySelectorAll(".msg-delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (confirm("Delete this message?")) {
        const { error } = await supabase.from("messages").delete().eq("id", id);
        if (error) {
          alert("Failed to delete message.");
          console.error(error);
        } else {
          alert("Message deleted.");
          loadMessages();
        }
      }
    });
  });
}

// 🔹 SIRALAMA DÜĞMESİ
sortButton.addEventListener("click", () => {
  sortOrder = sortOrder === "desc" ? "asc" : "desc";
  sortButton.textContent =
    sortOrder === "desc" ? "Sort: Newest First" : "Sort: Oldest First";
  renderMessages();
});

// 🔹 FİLTRE MENÜSÜ
filterSelect.addEventListener("change", renderMessages);

// 🔹 BAŞLANGIÇTA YÜKLE
loadMessages();

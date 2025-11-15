import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🟢 Fonksiyonları global yap
window.toggleSupportPanel = toggleSupportPanel;
window.sendSupportMessage = sendSupportMessage;

// 💬 Panel toggle
function toggleSupportPanel() {
  const p = document.getElementById("supportPanel");
  if (p) {
    p.style.display = p.style.display === "block" ? "none" : "block";
  }
}

// 📩 Mesaj gönder
async function sendSupportMessage() {
  const name = document.getElementById("supName").value.trim();
  const email = document.getElementById("supEmail").value.trim();
  const message = document.getElementById("supMsg").value.trim();
  const category = document.getElementById("supCategory").value;
  const fileInput = document.getElementById("supFile");

  if (!name || !email || !message) {
    showToast("Please fill all required fields ❌", "error");
    return;
  }

  openConfirmPopup(async () => {
    let fileUrl = "";

    // 🖼️ Dosya yükleme
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const fileName = `${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        showToast("File upload failed ❌", "error");
        return;
      }

      fileUrl = `${SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;
    }

    // 💾 Mesaj kaydı
    const { error: insertError } = await supabase.from("messages").insert([
      {
        name,
        email,
        message,
        category,
        file: fileUrl || "",
        date: new Date().toLocaleString(),
        read: false,
      },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError);
      showToast("Message failed ❌", "error");
    } else {
      showToast("Message sent ✅", "success");

      document.getElementById("supportPanel").style.display = "none";
      document.getElementById("supName").value = "";
      document.getElementById("supEmail").value = "";
      document.getElementById("supMsg").value = "";
      document.getElementById("supCategory").selectedIndex = 0;
      fileInput.value = "";
    }
  });
}

// ✅ Otomatik olarak buton + panel ekle (her sayfa)
document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("supportBtn")) {
    const btn = document.createElement("div");
    btn.id = "supportBtn";
    btn.innerHTML = `
      <img src="data:image/svg+xml;base64,PHN2ZyBmaWxsPSJ3aGl0ZSIgdmlld0JveD0iMCAwIDI0IDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnPjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuMDggMiAxMS4yNXY5LjI1YzAgMS4yOSAxLjA0IDIuNSAyLjUgMi41aDMuNXYzLjI1YzAgLjQyLjUyLjYzLjgzLjMzTDExLjY3IDIzaDQuODNjNS41MiAwIDEwLTQuMDggMTAtOS4yNVMxNy41MiAyIDEyIDJ6bTAgMkMxNi40MiA0IDIwIDcuMDggMjAgMTEuMjVzLTMuNTggNy4yNS04IDcuMjVoLTUuMTdsLTIuNjcgMi42N1YxOC40N0g0Yy0yLjIxIDAtNC0xLjc5LTQtNC4wNlYxMS4yNUM0IDcuMDggNy41OCA0IDEyIDR6Ii8+PC9nPjwvc3ZnPg=="/>`;
    btn.onclick = toggleSupportPanel;
    document.body.appendChild(btn);
  }

  if (!document.getElementById("supportPanel")) {
    const panel = document.createElement("div");
    panel.id = "supportPanel";
    panel.innerHTML = `
      <div class="sup-header">
        <span>Support</span>
        <button onclick="toggleSupportPanel()">✕</button>
      </div>
      <div class="sup-body">
        <label>Your Name *</label>
        <input type="text" id="supName" placeholder="John Doe" />
        <label>Email *</label>
        <input type="email" id="supEmail" placeholder="your@mail.com" />
        <label>Category *</label>
        <select id="supCategory">
          <option value="Design">Design / Custom Request</option>
          <option value="Order">Order or Delivery</option>
          <option value="Product">Product Information</option>
          <option value="Website">Website Issue</option>
          <option value="Other">Other</option>
        </select>
        <label>Your Message *</label>
        <textarea id="supMsg" placeholder="Write your message..."></textarea>
        <label>Attach File (optional)</label>
        <input type="file" id="supFile" accept="image/*,.pdf,.txt,.zip,.rar,.doc,.docx" />
        <button class="sup-send" onclick="sendSupportMessage()">Send Message →</button>
      </div>`;
    document.body.appendChild(panel);
  }
});

// 💬 Emin misiniz popup
function openConfirmPopup(onConfirm) {
  const popup = document.createElement("div");
  popup.className = "confirm-popup";
  popup.innerHTML = `
    <div class="confirm-box">
      <p>Are you sure you want to send this message?</p>
      <div class="confirm-buttons">
        <button id="confirmYes">Yes</button>
        <button id="confirmNo">No</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById("confirmYes").onclick = () => {
    popup.remove();
    onConfirm();
  };
  document.getElementById("confirmNo").onclick = () => popup.remove();
}

// 🔔 Toast
function showToast(msg, type = "info") {
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add("show"), 50);
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 400);
  }, 2000);
}

// 🎨 Style
const style = document.createElement("style");
style.innerHTML = `
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
.toast.show { opacity: 1; transform: translate(-50%,-50%) scale(1); }
.toast.success { border-color:#00aa66; color:#00ff99; }
.toast.error { border-color:#aa0000; color:#ff5555; }

.confirm-popup {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999998;
}
.confirm-box {
  background: #111;
  padding: 25px 35px;
  border-radius: 12px;
  border: 1px solid #333;
  text-align: center;
  color: #fff;
}
.confirm-buttons {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 10px;
}
.confirm-buttons button {
  background: #222;
  border: 1px solid #444;
  color: #fff;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}
.confirm-buttons button:hover {
  background: #00aa66;
  border-color: #00ff99;
  color: #fff;
}
`;
document.head.appendChild(style);

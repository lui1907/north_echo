import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🧩 SUPPORT PANEL YOKSA OLUŞTUR
function createSupportPanel() {
  if (document.getElementById("supportPanel")) return;

  const panel = document.createElement("div");
  panel.id = "supportPanel";
  panel.innerHTML = `
    <div class="sup-header">
      <span>Support</span>
      <button id="closeSupport">✕</button>
    </div>
    <div class="sup-body">
      <label>Your Name *</label>
      <input type="text" id="supName" placeholder="John Doe" />
      <label>Email *</label>
      <input type="email" id="supEmail" placeholder="your@mail.com" />
      <label>Your Message *</label>
      <textarea id="supMsg" placeholder="Write your message..."></textarea>
      <label>Attach File (optional)</label>
      <input type="file" id="supFile" accept="image/*,.pdf,.txt,.zip,.rar,.doc,.docx" />
      <button class="sup-send" id="sendSupportBtn">Send Message →</button>
    </div>
  `;
  document.body.appendChild(panel);
}
createSupportPanel();

// ✅ SUPPORT BUTONU VARSA TIKLANINCA PANELİ AÇ/KAPA
function bindSupportButton() {
  const btn = document.getElementById("supportBtn");
  const panel = document.getElementById("supportPanel");

  if (!btn || !panel) return;

  btn.addEventListener("click", () => {
    const visible = panel.style.display === "block";
    panel.style.display = visible ? "none" : "block";
  });
}

// DOM TAM YÜKLENİNCE YENİDEN BAĞLA
window.addEventListener("load", () => {
  bindSupportButton();
});

// ❌ PANEL KAPAT / ✅ MESAJ GÖNDER
document.addEventListener("click", async e => {
  if (e.target.id === "closeSupport") {
    document.getElementById("supportPanel").style.display = "none";
  }

  if (e.target.id === "sendSupportBtn") {
    await sendSupportMessage();
  }
});

// 📩 MESAJ GÖNDER
async function sendSupportMessage() {
  const name = document.getElementById("supName").value.trim();
  const email = document.getElementById("supEmail").value.trim();
  const message = document.getElementById("supMsg").value.trim();
  const fileInput = document.getElementById("supFile");

  if (!name || !email || !message) {
    showToast("Please fill all required fields ❌", "error");
    return;
  }

  let fileUrl = "";
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const safeName = `${Date.now()}_${file.name.replace(/\s+/g, "_").replace(/[^\w.-]/g, "")}`;
    
    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(`public/${safeName}`, file, {
        cacheControl: "3600",
        upsert: false
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      showToast("File upload failed ❌", "error");
      return;
    }
    fileUrl = `${SUPABASE_URL}/storage/v1/object/public/uploads/public/${safeName}`;
  }

  const { error: insertError } = await supabase.from("messages").insert([
    { name, email, message, file: fileUrl || "", date: new Date().toLocaleString(), read: false },
  ]);

  if (insertError) {
    console.error("Insert error:", insertError);
    showToast("Message failed ❌", "error");
  } else {
    showToast("Message sent successfully ✅", "success");
    document.getElementById("supportPanel").style.display = "none";
  }
}

// 🔔 TOAST MESAJLARI
function showToast(msg, type = "info") {
  let toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

// 🎨 STİL
const style = document.createElement("style");
style.innerHTML = `
#supportBtn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: #00aa66;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0 12px rgba(0,0,0,0.3);
  z-index: 9999;
  transition: 0.25s;
}
#supportBtn:hover { background: #00cc77; }
#supportBtn img { width: 26px; height: 26px; pointer-events: none; }

#supportPanel {
  position: fixed;
  bottom: 100px;
  right: 40px;
  width: 320px;
  background: rgba(15,15,15,0.95);
  border: 1px solid #222;
  border-radius: 12px;
  padding: 20px;
  display: none;
  z-index: 9998;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
  animation: slideUp 0.25s ease;
}
@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.sup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.sup-header span { font-weight: bold; font-size: 16px; }
.sup-header button {
  background: none; border: none; color: #fff; cursor: pointer; font-size: 18px;
}
.sup-body label { display: block; margin-bottom: 5px; font-size: 13px; color: #aaa; }
.sup-body input, .sup-body textarea {
  width: 100%;
  margin-bottom: 10px;
  border: 1px solid #333;
  border-radius: 6px;
  background: #111;
  color: white;
  padding: 8px;
  font-size: 14px;
}
.sup-send {
  width: 100%;
  background: #00aa66;
  border: none;
  border-radius: 6px;
  padding: 10px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: 0.2s;
}
.sup-send:hover { background: #00cc77; }

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
  z-index: 99999;
  font-size: 15px;
}
.toast.show { opacity: 1; transform: translate(-50%,-50%) scale(1); }
.toast.success { border-color:#00aa66; color:#00ff99; }
.toast.error { border-color:#aa0000; color:#ff5555; }
`;
document.head.appendChild(style);

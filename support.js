import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🎛️ Support panel aç/kapa
window.toggleSupportPanel = function () {
  const panel = document.getElementById("supportPanel");
  panel.style.display = panel.style.display === "block" ? "none" : "block";
};

// 📩 Mesaj gönderme
window.sendSupportMessage = async function () {
  const name = document.getElementById("supName").value.trim();
  const email = document.getElementById("supEmail").value.trim();
  const message = document.getElementById("supMsg").value.trim();
  const fileInput = document.getElementById("supFile");

  if (!name || !email || !message) {
    showToast("Please fill all required fields ❌", "error");
    return;
  }

  openConfirmPopup(async () => {
    let fileUrl = "";

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

    const { error: insertError } = await supabase.from("messages").insert([
      {
        name,
        email,
        message,
        file: fileUrl || "",
        date: new Date().toLocaleString(),
        read: false,
      },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError);
      showToast("Message failed ❌", "error");
    } else {
      showToast("Message sent successfully ✅", "success");
      document.getElementById("supportPanel").style.display = "none";
      document.getElementById("supName").value = "";
      document.getElementById("supEmail").value = "";
      document.getElementById("supMsg").value = "";
      fileInput.value = "";
    }
  });
};

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

// 🔔 Toast mesajı
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

// 🎨 Stiller (ikon + toast + popup)
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
  transition: 0.2s;
}
#supportBtn:hover { background: #00cc77; }
#supportBtn img {
  width: 26px;
  height: 26px;
  pointer-events: none;
}

#supportPanel {
  position: fixed;
  bottom: 100px;
  right: 40px;
  width: 320px;
  background: #0f0f0f;
  border: 1px solid #222;
  border-radius: 10px;
  padding: 20px;
  display: none;
  z-index: 9998;
}
#supportPanel input, #supportPanel textarea, #supportPanel select {
  width: 100%;
  margin-bottom: 10px;
  border: 1px solid #333;
  border-radius: 6px;
  background: #111;
  color: white;
  padding: 8px;
  font-size: 14px;
}
#supportPanel .sup-send {
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
#supportPanel .sup-send:hover { background: #00cc77; }

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
.toast.show {
  opacity: 1;
  transform: translate(-50%,-50%) scale(1);
}
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
  z-index: 99998;
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

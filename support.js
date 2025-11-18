import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ---------------------- SUPABASE ----------------------
const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// bucket adı → panelde sol tarafta ne yazıyorsa onu yaz
const STORAGE_BUCKET = "uploads";

// ------------------------------------------------------
window.toggleSupportPanel = function () {
  document.getElementById("supportPanel").classList.toggle("show");
};

// ------------------------------------------------------
// DOSYA GÖNDERME BUTONU
// ------------------------------------------------------
window.sendSupportMessage = async function () {
  const name = supName.value.trim();
  const email = supEmail.value.trim();
  const message = supMsg.value.trim();
  const category = supCategory?.value || "General";

  if (!name || !email || !message) {
    showToast("Please fill all required fields ❌", "error");
    return;
  }

  let fileUrl = "";

  // -------- FILE UPLOAD FIX --------
  if (supFile.files.length > 0) {
    const file = supFile.files[0];
    const safeName = `${Date.now()}_${file.name
      .replace(/\s+/g, "_")
      .replace(/[^\w.-]/g, "")}`;

    const { data, error: uploadErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(safeName, file);

    if (uploadErr) {
      console.error(uploadErr);
      showToast("File upload failed ❌", "error");
      return;
    }

    fileUrl =
      SUPABASE_URL +
      "/storage/v1/object/public/" +
      STORAGE_BUCKET +
      "/" +
      safeName;
  }

  // DB INSERT
  const { error } = await supabase.from("messages").insert([
    {
      name,
      email,
      message,
      category,
      file: fileUrl,
      date: new Date().toLocaleString(),
      read: false,
    },
  ]);

  if (error) {
    console.error(error);
    showToast("Failed to send ❌", "error");
  } else {
    showToast("Message sent successfully ✅", "success");
    document.getElementById("supportPanel").classList.remove("show");
    supName.value = "";
    supEmail.value = "";
    supMsg.value = "";
    supFile.value = "";
  }
};

// ------------------------------------------------------
// Toast
// ------------------------------------------------------
function showToast(msg, type = "info") {
  let toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 50);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

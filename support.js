// -----------------------------------------
// 🔥 Supabase bağlantısı
// -----------------------------------------
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// -----------------------------------------
// 🧩 Support panel aç/kapa
// -----------------------------------------
window.toggleSupportPanel = function () {
  const p = document.getElementById("supportPanel");
  p.style.display = p.style.display === "block" ? "none" : "block";
};

// -----------------------------------------
// 📩 Mesaj gönderme
// -----------------------------------------
window.sendSupportMessage = async function () {
  const name = document.getElementById("supName").value.trim();
  const email = document.getElementById("supEmail").value.trim();
  const message = document.getElementById("supMsg").value.trim();
  const category = document.getElementById("supCategory").value;
  const fileInput = document.getElementById("supFile");

  if (!name || !email || !message) {
    alert("Please fill all required fields.");
    return;
  }

  let fileUrl = "";

  // -----------------------------------------
  // 🖼️ Dosya yükleme
  // -----------------------------------------
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const fileName = `${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("uploads") // Bucket adın farklıysa burayı değiştir!
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      alert("File upload failed.");
      return;
    }

    fileUrl = `${SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;
  }

  // -----------------------------------------
  // 💾 Mesajı veritabanına kaydet
  // -----------------------------------------
  const { error: insertError } = await supabase.from("messages").insert([
    {
      name,
      email,
      message,
      category,
      file: fileUrl || "",
      date: new Date().toISOString(), // ✅ ISO format (doğru sıralama için)
      read: false,
    },
  ]);

  if (insertError) {
    console.error("Insert error:", insertError);
    alert("Message send failed.");
  } else {
    alert("Message sent successfully!");
    document.getElementById("supportPanel").style.display = "none";

    // Formu temizle
    document.getElementById("supName").value = "";
    document.getElementById("supEmail").value = "";
    document.getElementById("supMsg").value = "";
    document.getElementById("supCategory").selectedIndex = 0;
    fileInput.value = "";
  }
};

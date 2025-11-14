// -------------------------------------------------------
// 🔥 SUPABASE BAĞLANTISI
// -------------------------------------------------------
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


// -------------------------------------------------------
// 🟢 PANELİ AÇ / KAPAT
// -------------------------------------------------------
window.toggleSupportPanel = function () {
    const panel = document.getElementById("supportPanel");
    panel.style.display = panel.style.display === "flex" ? "none" : "flex";
};


// -------------------------------------------------------
// 📩 MESAJ GÖNDER
// -------------------------------------------------------
window.sendSupportMessage = async function () {
    const name = document.getElementById("supName").value.trim();
    const email = document.getElementById("supEmail").value.trim();
    const message = document.getElementById("supMsg").value.trim();
    const fileInput = document.getElementById("supFile");

    if (!name || !email || !message) {
        alert("Please fill in all required fields.");
        return;
    }

    let fileURL = "";

    // ---------------------------------------------------
    // 📷 DOSYA YÜKLE (Supabase Storage)
    // ---------------------------------------------------
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const filePath = `uploads/${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage
            .from("uploads")
            .upload(filePath, file);

        if (error) {
            console.error(error);
            alert("File upload failed.");
            return;
        }

        fileURL = `${SUPABASE_URL}/storage/v1/object/public/uploads/${filePath}`;
    }

    // ---------------------------------------------------
    // 📨 MESAJI VERİTABANINA KAYDET
    // ---------------------------------------------------
    const { error } = await supabase
        .from("messages")
        .insert([
            {
                name: name,
                email: email,
                message: message,
                file: fileURL,
                date: new Date().toLocaleString(),
                read: false,
                reply: ""
            }
        ]);

    if (error) {
        console.error(error);
        alert("Message could not be sent.");
        return;
    }

    alert("Message sent!");
    toggleSupportPanel();
};

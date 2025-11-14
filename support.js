import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// PANEL AÇ/KAPAT
window.toggleSupportPanel = function() {
    const panel = document.getElementById("supportPanel");
    panel.style.display = panel.style.display === "block" ? "none" : "block";
};

// MESAJ GÖNDER
window.sendSupportMessage = async function () {

    const name = document.getElementById("supName").value;
    const email = document.getElementById("supEmail").value;
    const category = document.getElementById("supCategory").value;
    const message = document.getElementById("supMsg").value;
    const fileInput = document.getElementById("supFile");

    if (!name || !email || !message) {
        alert("Please fill all required fields.");
        return;
    }

    let fileUrl = null;

    // DOSYA VARSA STORAGE'A YÜKLE
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileName = `${Date.now()}-${file.name}`;

        const upload = await supabase.storage
            .from("uploadsx")
            .upload(fileName, file);

        if (upload.error) {
            alert("File upload error!");
            return;
        }

        fileUrl = `${SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;
    }

    // MESAJI VERİTABANINA KAYDET
    const { error } = await supabase
        .from("messages")
        .insert({
            name,
            email,
            category,
            message,
            file: fileUrl,
            date: new Date().toLocaleString(),
            reply: "",
            read: false
        });

    if (error) {
        alert("Message send failed!");
        return;
    }

    alert("Message sent!");
    toggleSupportPanel();
};

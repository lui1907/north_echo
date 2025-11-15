import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


// PANEL AÇ/KAPA
window.toggleSupportPanel = function () {
    const p = document.getElementById("supportPanel");
    p.style.display = (p.style.display === "block") ? "none" : "block";
};


// MESAJ GÖNDER
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

    let fileUrl = null;

    // Eğer dosya yüklenmişse Supabase Storage'a gönder
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileName = Date.now() + "_" + file.name;

        const { data, error } = await supabase.storage
            .from("uploads")
            .upload(fileName, file);

        if (error) {
            alert("File upload failed.");
            console.log(error);
        } else {
            fileUrl = `https://xedfviwffpsvbmyqzoof.supabase.co/storage/v1/object/public/uploads/${fileName}`;
        }
    }

    // Supabase’e mesajı kaydet
    const { error } = await supabase
        .from("messages")
        .insert({
            name,
            email,
            message,
            category,
            file: fileUrl,
            read: false,
            date: new Date().toLocaleString()
        });

    if (error) {
        alert("Message send failed.");
    } else {
        alert("Message sent!");
        document.getElementById("supportPanel").style.display = "none";
    }
};

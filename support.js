// ------------------------------------------------------
// 🔥 SUPABASE BAĞLANTISI
// ------------------------------------------------------
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "BURAYA_URL";
const SUPABASE_KEY = "BURAYA_ANON_KEY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


// ------------------------------------------------------
// 🗂 DESTEK PANELİ AÇ / KAPAT
// ------------------------------------------------------
window.toggleSupportPanel = function () {
    const panel = document.getElementById("supportPanel");
    panel.style.display = panel.style.display === "block" ? "none" : "block";
};


// ------------------------------------------------------
// 📩 MESAJ + DOSYA GÖNDER
// ------------------------------------------------------
window.sendSupportMessage = async function () {

    const name = document.getElementById("supName").value.trim();
    const email = document.getElementById("supEmail").value.trim();
    const message = document.getElementById("supMsg").value.trim();
    const fileInput = document.getElementById("supFile");

    if (!name || !email || !message) {
        alert("Please fill all required fields.");
        return;
    }

    let fileURL = null;

    // ------------ 📤 DOSYA YÜKLEME VARSA ------------
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileName = `${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage
            .from("uploads")
            .upload(fileName, file);

        if (error) {
            alert("File upload failed.");
            return;
        }

        fileURL = `${SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;
    }

    // ------------ 📨 MESAJ VERİ TABANINA EKLE ------------
    const { error: insertError } = await supabase
        .from("messages")
        .insert([
            {
                name,
                email,
                message,
                file: fileURL,
                date: new Date().toLocaleString(),
                read: false,
                reply: ""
            }
        ]);

    if (insertError) {
        console.log(insertError);
        alert("Message could not be sent.");
        return;
    }

    alert("Message sent successfully!");
    document.getElementById("supportPanel").style.display = "none";
};

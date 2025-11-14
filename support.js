// -----------------------------------------
// 🔥 Supabase Bağlantısı
// -----------------------------------------
const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// -----------------------------------------
// 📤 DESTEK MESAJI GÖNDER
// -----------------------------------------
async function sendSupportMessage() {
    const name = document.getElementById("supName").value.trim();
    const email = document.getElementById("supEmail").value.trim();
    const message = document.getElementById("supMsg").value.trim();
    const category = document.getElementById("supCategory").value.trim();
    const fileInput = document.getElementById("supFile");

    if (!name || !email || !message || !category) {
        alert("All fields except file are required.");
        return;
    }

    // ----------- DOSYA YÜKLEME ---------------
    let fileURL = "";

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileName = `${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage
            .from("uploads")          // BU AD TAM OLMAK ZORUNDA
            .upload(fileName, file);

        if (error) {
            console.error(error);
            alert("File upload failed.");
            return;
        }

        fileURL = `${SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;
    }

    // ----------- VERİTABANINA KAYDET ---------------
    const { error } = await supabase
        .from("messages")
        .insert([
            {
                name,
                email,
                message,
                category,
                file: fileURL,
                date: new Date().toLocaleString(),
                read: false,
                reply: ""
            }
        ]);

    if (error) {
        console.error(error);
        alert("Message send failed.");
        return;
    }

    alert("Message sent.");
    document.getElementById("supportPanel").style.display = "none";
}

window.sendSupportMessage = sendSupportMessage;

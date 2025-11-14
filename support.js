import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.32.0/+esm";

const supabaseUrl = "https://xedfviwffpsvbmyqzoof.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(supabaseUrl, supabaseKey);

window.sendSupportMessage = async function () {
    const name = document.getElementById("supName").value.trim();
    const email = document.getElementById("supEmail").value.trim();
    const message = document.getElementById("supMsg").value.trim();
    const fileInput = document.getElementById("supFile");

    if (!name || !email || !message) {
        alert("Please fill in all required fields.");
        return;
    }

    let fileUrl = null;

    // Eğer dosya varsa yükle
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const filePath = `messages/${crypto.randomUUID()}-${file.name}`;

        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from("uploads")
            .upload(filePath, file);

        if (uploadError) {
            console.error(uploadError);
            alert("File upload failed.");
            return;
        }

        const { data: publicUrlData } = supabase
            .storage
            .from("uploads")
            .getPublicUrl(filePath);

        fileUrl = publicUrlData.publicUrl;
    }

    // Mesajı tabloya kaydet
    const { error } = await supabase
        .from("messages")
        .insert({
            name,
            email,
            message,
            file: fileUrl,
            date: new Date().toLocaleString("tr-TR")
        });

    if (error) {
        console.error(error);
        alert("Message send failed.");
        return;
    }

    alert("Message sent!");
};

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabaseUrl = "https://xedfviwffpsvbmyqzoof.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(supabaseUrl, supabaseKey);

window.sendSupportMessage = async function () {

    const name = supName.value.trim();
    const email = supEmail.value.trim();
    const category = supCategory.value;
    const message = supMsg.value.trim();
    const fileObj = supFile.files[0];

    if (!name || !email || !message) {
        alert("Fill in all fields.");
        return;
    }

    let fileUrl = null;

    // File upload
    if (fileObj) {
        const path = `messages/${crypto.randomUUID()}-${fileObj.name}`;

        const { error: uploadError } = await supabase
            .storage
            .from("uploads")
            .upload(path, fileObj);

        if (uploadError) {
            alert("File upload failed.");
            return;
        }

        fileUrl = supabase.storage.from("uploads").getPublicUrl(path).data.publicUrl;
    }

    // Insert to database
    const { error } = await supabase
        .from("messages")
        .insert({
            name,
            email,
            category,
            message,
            file: fileUrl,
            date: new Date().toLocaleString("tr-TR")
        });

    if (error) {
        console.log(error);
        alert("Message send failed.");
    } else {
        alert("Message sent!");
        toggleSupportPanel();
    }
};

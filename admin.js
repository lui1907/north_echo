import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.32.0/+esm";

const supabaseUrl = "https://xedfviwffpsvbmyqzoof.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(supabaseUrl, supabaseKey);

// Mesajları çek
async function loadMessages() {
    const msgBox = document.getElementById("adminMessages");
    msgBox.innerHTML = "<p style='opacity:.6;'>Loading...</p>";

    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("date", { ascending: false });

    if (error) {
        console.error(error);
        msgBox.innerHTML = "Error loading messages";
        return;
    }

    msgBox.innerHTML = "";

    data.forEach(msg => {
        msgBox.innerHTML += `
            <div class="msg-box">
                <div class="msg-top">
                    <div>
                        <div class="msg-sender">${msg.name}</div>
                        <div class="msg-email">${msg.email}</div>
                    </div>
                </div>

                <div class="msg-text">${msg.message}</div>

                ${msg.file ? `<img src="${msg.file}" class="msg-img" onclick="openImgModal('${msg.file}')">` : ""}

                <div class="msg-date">${msg.date}</div>
            </div>
        `;
    });
}

window.openImgModal = function(url) {
    document.getElementById("imgModalContent").src = url;
    document.getElementById("imgModal").style.display = "flex";
};

window.closeImgModal = function() {
    document.getElementById("imgModal").style.display = "none";
};

loadMessages();

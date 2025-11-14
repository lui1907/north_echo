import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabaseUrl = "https://xedfviwffpsvbmyqzoof.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(supabaseUrl, supabaseKey);

const msgBox = document.getElementById("adminMessages");

// Load messages
async function loadMessages() {
    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("date", { ascending: false });

    if (error) {
        msgBox.innerHTML = "Failed to load messages.";
        return;
    }

    msgBox.innerHTML = "";

    data.forEach(m => {
        msgBox.innerHTML += `
            <div class="msg-box">

                <div class="msg-top">
                    <div>
                        <div class="msg-sender">${m.name}</div>
                        <div class="msg-email">${m.email}</div>
                        <div class="msg-category">Category: ${m.category}</div>
                    </div>
                </div>

                <div class="msg-text">${m.message}</div>

                ${m.file ? `<img src="${m.file}" class="msg-img" onclick="openImg('${m.file}')">` : ""}

                <div class="msg-date">${m.date}</div>

            </div>
        `;
    });
}

// Image modal
window.openImg = function(url) {
    imgModalContent.src = url;
    imgModal.style.display = "flex";
};

window.closeImgModal = function() {
    imgModal.style.display = "none";
};

loadMessages();

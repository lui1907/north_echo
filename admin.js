import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const msgBox = document.getElementById("adminMessages");

async function loadMessages() {
    msgBox.innerHTML = "<p style='opacity:.6;'>Loading...</p>";

    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("id", { ascending:false });

    if (error) {
        msgBox.innerHTML = "<p style='color:red;'>Failed to load.</p>";
        return;
    }

    render(data);
}

function render(list) {
    msgBox.innerHTML = "";

    if (list.length === 0) {
        msgBox.innerHTML = "<p style='opacity:.6;'>No messages.</p>";
        return;
    }

    list.forEach(msg => {

        msgBox.innerHTML += `
        <div class="msg-box">

          <div class="read-dot ${msg.read ? "read" : ""}"></div>

          <button class="msg-delete" onclick="deleteMsg('${msg.id}')">Delete</button>

          <h3>${msg.name}</h3>
          <p>${msg.email}</p>
          <p class="msg-category">Category: ${msg.category}</p>

          <p>${msg.message}</p>

          ${msg.file ? `<img class="msg-img" onclick="openImgModal('${msg.file}')" src="${msg.file}">` : ""}

          <div class="msg-date">${msg.date}</div>

        </div>`;
    });
}

window.deleteMsg = async function(id) {
    if (!confirm("Delete message?")) return;

    await supabase.from("messages").delete().eq("id", id);
    loadMessages();
};

window.openImgModal = function(url) {
    document.getElementById("imgModalContent").src = url;
    document.getElementById("imgModal").style.display = "flex";
};

window.closeImgModal = function() {
    document.getElementById("imgModal").style.display = "none";
};

loadMessages();

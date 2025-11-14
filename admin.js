import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/esm/supabase.js";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const msgBox = document.getElementById("adminMessages");

// -------- LOAD MESSAGES --------
async function loadMessages() {
    msgBox.innerHTML = "<p style='opacity:.6;'>Loading...</p>";

    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        msgBox.innerHTML = "<p>Error loading messages.</p>";
        return;
    }

    window.ALL_MESSAGES = data;
    renderMessages("all");
}

// -------- RENDER --------
function renderMessages(filterType) {
    const list = filterList(filterType);

    msgBox.innerHTML = "";

    if (!list.length) {
        msgBox.innerHTML = "<p style='opacity:.6;'>No messages.</p>";
        return;
    }

    list.forEach(msg => {
        msgBox.innerHTML += `
            <div class="msg-box">

                <div class="msg-top">
                    <div>
                        <div class="msg-sender">${msg.name}</div>
                        <div class="msg-email">${msg.email}</div>
                        <div class="msg-category">Category: ${msg.category}</div>
                    </div>

                    <button class="msg-delete" onclick="deleteMessage('${msg.id}')">Delete</button>
                </div>

                <div class="msg-text">${msg.message}</div>

                ${msg.file ? `<img src="${msg.file}" class="msg-img" onclick="openImgModal('${msg.file}')">` : ""}

                <div class="msg-date">${msg.date}</div>
            </div>
        `;
    });
}

// -------- FILTER SYSTEM --------
function filterList(type) {
    let list = [...ALL_MESSAGES];

    if (type === "unread") list = list.filter(m => !m.read);
    if (type === "tshirt") list = list.filter(m => m.category === "T-Shirt");
    if (type === "sweatshirt") list = list.filter(m => m.category === "Sweatshirt");
    if (type === "other") list = list.filter(m => m.category === "Other");
    if (type === "withfile") list = list.filter(m => m.file);

    return list;
}

// FILTER BUTTONS
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        renderMessages(btn.dataset.filter);
    });
});

// -------- DELETE --------
window.deleteMessage = async function(id) {
    if (!confirm("Delete this message?")) return;

    await supabase.from("messages").delete().eq("id", id);
    loadMessages();
};

// -------- IMG MODAL --------
window.openImgModal = function(url) {
    document.getElementById("imgModalContent").src = url;
    document.getElementById("imgModal").style.display = "flex";
};

window.closeImgModal = function() {
    document.getElementById("imgModal").style.display = "none";
};

// START
loadMessages();

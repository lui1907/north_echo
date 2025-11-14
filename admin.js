import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM
const msgBox = document.getElementById("adminMessages");
let ALL_MESSAGES = [];

// ---------------- LOAD MESSAGES ----------------
async function loadMessages() {
    msgBox.innerHTML = "<p style='opacity:.6;'>Loading messages...</p>";

    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error(error);
        msgBox.innerHTML = "<p style='opacity:.6;color:red;'>Failed to load messages.</p>";
        return;
    }

    ALL_MESSAGES = data;
    renderMessages("all");
}

// ---------------- RENDER ----------------
function renderMessages(filterType) {
    let list = [...ALL_MESSAGES];

    if (filterType === "unread") list = list.filter(m => !m.read);
    if (filterType === "tshirt") list = list.filter(m => m.category === "T-Shirt");
    if (filterType === "sweatshirt") list = list.filter(m => m.category === "Sweatshirt");
    if (filterType === "other") list = list.filter(m => m.category === "Other");
    if (filterType === "withfile") list = list.filter(m => m.file);

    msgBox.innerHTML = "";

    if (list.length === 0) {
        msgBox.innerHTML = "<p style='opacity:.6;'>No messages found.</p>";
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
        </div>`;
    });
}

// ---------------- FILTER BUTTONS ----------------
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderMessages(btn.dataset.filter);
    });
});

// ---------------- DELETE ----------------
window.deleteMessage = async function(id) {
    if (!confirm("Delete this message?")) return;

    await supabase.from("messages").delete().eq("id", id);
    loadMessages();
};

// ---------------- IMAGE MODAL ----------------
window.openImgModal = function(url) {
    document.getElementById("imgModalContent").src = url;
    document.getElementById("imgModal").style.display = "flex";
};
window.closeImgModal = function() {
    document.getElementById("imgModal").style.display = "none";
};

// START
loadMessages();

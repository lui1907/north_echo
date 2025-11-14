import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


// -----------------------------------------------------
// 🔐 Admin Kontrolü
// -----------------------------------------------------
const ADMINS = ["luivoss", "ahmet", "owner", "admin"];
const logged = localStorage.getItem("loggedInUser");

if (!logged || !ADMINS.includes(logged.toLowerCase())) {
  window.location.href = "index.html";
}


// -----------------------------------------------------
// 📌 MESAJLARI GETİR
// -----------------------------------------------------
async function loadMessages(filter = "all") {
    const msgBox = document.getElementById("adminMessages");
    msgBox.innerHTML = "<p style='opacity:.6;'>Loading...</p>";

    let query = supabase.from("messages").select("*").order("date", { ascending: false });

    if (filter === "unread") {
        query = query.eq("read", false);
    }

    if (filter === "withfile") {
        query = query.not("file", "is", null);
    }

    const { data, error } = await query;

    if (error) {
        msgBox.innerHTML = `<p style="color:red;">Error loading messages.</p>`;
        return;
    }

    renderMessages(data);
}


// -----------------------------------------------------
// 📩 MESAJLARI EKRANA BAS
// -----------------------------------------------------
function renderMessages(list) {
    const msgBox = document.getElementById("adminMessages");
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
                </div>

                <button class="msg-delete" onclick="deleteMsg('${msg.id}')">Delete</button>
            </div>

            <div class="msg-text">${msg.message}</div>

            ${msg.file ? `<img src="${msg.file}" class="msg-img" onclick="openImgModal('${msg.file}')">` : ""}

            <div class="msg-date">${msg.date}</div>

            <textarea id="rep-${msg.id}" class="reply-input" placeholder="Write reply...">${msg.reply || ""}</textarea>

            <button class="reply-btn" onclick="sendReply('${msg.id}')">Save Reply</button>
        </div>`;
    });
}


// -----------------------------------------------------
// 🟢 REPLY KAYDET
// -----------------------------------------------------
window.sendReply = async function (id) {
    const text = document.getElementById("rep-" + id).value;

    await supabase.from("messages").update({
        reply: text,
        read: true
    }).eq("id", id);

    alert("Reply saved.");
    loadMessages();
};


// -----------------------------------------------------
// ❌ MESAJ SİL
// -----------------------------------------------------
window.deleteMsg = async function (id) {
    if (!confirm("Delete?")) return;

    await supabase.from("messages").delete().eq("id", id);
    loadMessages();
};


// -----------------------------------------------------
// 🖼️ FOTO MODAL
// -----------------------------------------------------
window.openImgModal = function(url) {
    document.getElementById("imgModalContent").src = url;
    document.getElementById("imgModal").style.display = "flex";
};

window.closeImgModal = function() {
    document.getElementById("imgModal").style.display = "none";
};


// -----------------------------------------------------
// 🔥 SAYFA AÇILINCA MESAJLARI YÜKLE
// -----------------------------------------------------
loadMessages();


// -----------------------------------------------------
// 🎛️ Filtre Butonları
// -----------------------------------------------------
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        loadMessages(btn.dataset.filter);
    });
});

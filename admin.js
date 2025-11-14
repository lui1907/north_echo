// -----------------------------------------
// 🔥 Supabase Bağlantısı
// -----------------------------------------
const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// -----------------------------------------
// 📥 MESAJLARI YÜKLE
// -----------------------------------------
async function loadMessages() {

    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("date", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    renderMessages(data);
}


// -----------------------------------------
// 🧹 MESAJLARI ADMİN PANELDE GÖSTER
// -----------------------------------------
function renderMessages(messages) {
    const box = document.getElementById("adminMessages");
    box.innerHTML = "";

    if (!messages.length) {
        box.innerHTML = "<p>No messages.</p>";
        return;
    }

    messages.forEach(msg => {
        box.innerHTML += `
          <div class="msg-box">

            <div class="msg-top">
              <div>
                <div class="msg-sender">${msg.name}</div>
                <div class="msg-email">${msg.email}</div>
                <div class="msg-cat">Category: <b>${msg.category}</b></div>
              </div>

              <button class="msg-delete" onclick="deleteMessage('${msg.id}')">
                Delete
              </button>
            </div>

            <div class="msg-text">${msg.message}</div>

            ${msg.file ? `<img src="${msg.file}" class="msg-img">` : ""}

            <div class="msg-date">${msg.date}</div>

            <textarea id="reply-${msg.id}" class="reply-input" placeholder="Reply...">${msg.reply || ""}</textarea>

            <button class="reply-btn" onclick="sendReply('${msg.id}')">
              Save Reply
            </button>
          </div>
        `;
    });
}


// -----------------------------------------
// ✉️ REPLY SEND
// -----------------------------------------
window.sendReply = async function(id) {
    const text = document.getElementById(`reply-${id}`).value;

    await supabase
        .from("messages")
        .update({
            reply: text,
            read: true
        })
        .eq("id", id);

    loadMessages();
};


// -----------------------------------------
// ❌ DELETE MESSAGE
// -----------------------------------------
window.deleteMessage = async function(id) {
    await supabase
        .from("messages")
        .delete()
        .eq("id", id);

    loadMessages();
};


// -----------------------------------------
// 🚀 BAŞLAT
// -----------------------------------------
loadMessages();

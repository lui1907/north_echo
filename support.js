/* ============================
   SUPPORT CHAT PANEL AÇ / KAPAT
============================ */
function toggleSupportPanel() {
    const panel = document.getElementById("supportPanel");
    panel.style.display = (panel.style.display === "flex") ? "none" : "flex";

    loadChatMessages(); // Açıldığında mesajları yükle
}


/* ============================
   MESAJ GÖNDER (KULLANICI)
============================ */
function sendSupportMessage() {
    let input = document.getElementById("chatInput");
    let fileInput = document.getElementById("supFile");

    let text = input.value.trim();
    let file = fileInput.files[0];

    if (!text && !file) return; // Boş mesaj yok

    const username = localStorage.getItem("loggedInUser") || "guest";

    let fileData = null;

    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            fileData = reader.result;
            saveSupportMessage(username, text, fileData);
        };
        reader.readAsDataURL(file);
    } else {
        saveSupportMessage(username, text, null);
    }

    input.value = "";
    fileInput.value = "";
}


/* ============================
   MESAJI LOCALSTORAGE'A KAYDET
============================ */
function saveSupportMessage(username, text, fileData) {
    let msgs = JSON.parse(localStorage.getItem("supportMessages")) || [];

    msgs.push({
        user: username,
        text: text || "",
        file: fileData || null,
        fromAdmin: false,
        date: new Date().toLocaleString(),
        adminReply: null
    });

    localStorage.setItem("supportMessages", JSON.stringify(msgs));

    loadChatMessages();
}


/* ============================
   WHATSAPP CHAT GÖRÜNÜMÜ
============================ */
function loadChatMessages() {
    const chat = document.getElementById("chatWindow");
    if (!chat) return;

    const username = localStorage.getItem("loggedInUser") || "guest";
    let msgs = JSON.parse(localStorage.getItem("supportMessages")) || [];

    // Sadece bu kullanıcıya ait mesajlar + admin cevapları
    let userMsgs = msgs.filter(m => m.user === username);

    chat.innerHTML = "";

    userMsgs.forEach(m => {
        let cls = m.fromAdmin ? "msg admin-msg" : "msg user-msg";

        chat.innerHTML += `
            <div class="${cls}">
                ${m.text ? `<p>${m.text}</p>` : ""}
                ${m.file ? `<img src="${m.file}" class="chat-img">` : ""}
                <span class="chat-date">${m.date}</span>
            </div>
        `;

        if (m.adminReply) {
            chat.innerHTML += `
                <div class="msg admin-msg">
                    <p>${m.adminReply}</p>
                </div>
            `;
        }
    });

    chat.scrollTop = chat.scrollHeight;
}


/* ============================
   ADMIN PANELDEN CEVAP YAZMA
============================ */
function adminReply(index, replyText) {
    let msgs = JSON.parse(localStorage.getItem("supportMessages")) || [];
    if (!msgs[index]) return;

    msgs[index].adminReply = replyText;
    msgs[index].fromAdmin = true;

    localStorage.setItem("supportMessages", JSON.stringify(msgs));
}


/* ============================
   PANEL OTOMATİK YÜKLEME
============================ */
document.addEventListener("DOMContentLoaded", () => {
    loadChatMessages();
});

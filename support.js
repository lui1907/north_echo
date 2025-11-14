function toggleSupportPanel() {
    const panel = document.getElementById("supportPanel");
    panel.style.display = (panel.style.display === "flex") ? "none" : "flex";
}

function sendSupportMessage() {
    let name = document.getElementById("supName").value.trim();
    let email = document.getElementById("supEmail").value.trim();
    let text = document.getElementById("supMsg").value.trim();
    let fileInput = document.getElementById("supFile");

    if (!name || !email || !text) {
        alert("Please fill in all required fields.");
        return;
    }

    let fileData = null;

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function () {
            fileData = reader.result;
            saveMessage(name, email, text, fileData);
        };

        reader.readAsDataURL(file);
    } else {
        saveMessage(name, email, text, null);
    }
}

function saveMessage(name, email, text, fileData) {
    let messages = JSON.parse(localStorage.getItem("supportMessages")) || [];

    messages.push({
        name: name,
        email: email,
        text: text,
        file: fileData,
        date: new Date().toLocaleString(),
        read: false,
        adminNote: ""
    });

    localStorage.setItem("supportMessages", JSON.stringify(messages));

    alert("Message sent!");
    toggleSupportPanel();
}
// Kullanıcıya admin cevabını göster
function loadAdminReply() {
    let msgs = JSON.parse(localStorage.getItem("supportMessages")) || [];
    
    if (msgs.length === 0) return;

    let last = msgs[msgs.length - 1];

    if (!last.reply) return;

    let box = document.getElementById("supReplyBox");
    if (box) {
        box.innerHTML = `
            <div class="reply-container">
                <b>Admin Reply:</b>
                <p>${last.reply}</p>
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", loadAdminReply);


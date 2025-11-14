// PANEL AÇ / KAPAT
function toggleSupportPanel() {
    const panel = document.getElementById("supportPanel");
    panel.classList.toggle("open");
}

// MESAJ GÖNDER
function sendSupportMessage() {
    let name = document.getElementById("supName").value.trim();
    let email = document.getElementById("supEmail").value.trim();
    let msg = document.getElementById("supMsg").value.trim();
    let fileInput = document.getElementById("supFile");

    if (!name || !email || !msg) {
        alert("Please fill all required fields.");
        return;
    }

    let fileData = null;

    if (fileInput.files.length > 0) {
        let reader = new FileReader();
        reader.onload = function() {
            fileData = reader.result;
            saveMessage(name, email, msg, fileData);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        saveMessage(name, email, msg, null);
    }
}

function saveMessage(name, email, msg, file) {
    let messages = JSON.parse(localStorage.getItem("supportMessages")) || [];

    messages.push({
        name: name,
        email: email,
        text: msg,
        file: file,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("supportMessages", JSON.stringify(messages));

    alert("Message sent successfully!");
    document.getElementById("supportPanel").classList.remove("open");
}

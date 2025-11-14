/* =========================================================
   SUPPORT PANEL TOGGLE
========================================================= */
function toggleSupportPanel() {
    const panel = document.getElementById("supportPanel");
    if (panel.style.display === "block") {
        panel.style.display = "none";
    } else {
        panel.style.display = "block";
    }
}

/* =========================================================
   SEND MESSAGE
========================================================= */
function sendSupportMessage() {
    let name = document.getElementById("supName").value.trim();
    let email = document.getElementById("supEmail").value.trim();
    let text = document.getElementById("supMsg").value.trim();
    let category = document.getElementById("supCategory").value;
    let fileInput = document.getElementById("supFile");

    if (!name || !email || !text) {
        alert("Please fill all required fields.");
        return;
    }

    // Dosya eklenmişse okuyacağız
    if (fileInput.files.length > 0) {
        let reader = new FileReader();
        reader.onload = function(e) {
            saveMessage(name, email, text, category, e.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        saveMessage(name, email, text, category, "");
    }
}

/* =========================================================
   SAVE MESSAGE TO LOCAL STORAGE
========================================================= */
function saveMessage(name, email, text, category, fileData) {
    let messages = JSON.parse(localStorage.getItem("supportMessages")) || [];

    messages.push({
        name: name,
        email: email,
        text: text,
        category: category,
        file: fileData,
        date: new Date().toLocaleString(),
        read: false,
        adminNote: ""
    });

    localStorage.setItem("supportMessages", JSON.stringify(messages));

    alert("Your message has been sent!");
    toggleSupportPanel();

    // form temizleme
    document.getElementById("supName").value = "";
    document.getElementById("supEmail").value = "";
    document.getElementById("supMsg").value = "";
    document.getElementById("supFile").value = "";
}

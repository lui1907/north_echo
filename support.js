// Destek panelini aç/kapat
function toggleSupportPanel() {
    const panel = document.getElementById("supportPanel");
    panel.classList.toggle("open");
}

// Destek mesajı gönderme
function sendSupportMessage() {
    let name = document.getElementById("supName").value.trim();
    let email = document.getElementById("supEmail").value.trim();
    let msg = document.getElementById("supMsg").value.trim();

    if (!name || !email || !msg) {
        alert("Please fill all required fields.");
        return;
    }

    const data = {
        name,
        email,
        msg,
        date: new Date().toLocaleString()
    };

    // mesajları sakla
    let messages = JSON.parse(localStorage.getItem("supportMessages")) || [];
    messages.push(data);
    localStorage.setItem("supportMessages", JSON.stringify(messages));

    alert("Your message has been sent!");
    toggleSupportPanel();
    
    document.getElementById("supName").value = "";
    document.getElementById("supEmail").value = "";
    document.getElementById("supMsg").value = "";
}

document.addEventListener("DOMContentLoaded", function () {

    // PANEL AÇ/KAPA
    window.toggleSupportPanel = function () {
        const panel = document.getElementById("supportPanel");
        if (!panel) return;

        panel.style.display = (panel.style.display === "flex") ? "none" : "flex";
    };

    // MESAJ GÖNDER
    window.sendSupportMessage = function () {

        const name = document.getElementById("supName")?.value.trim();
        const email = document.getElementById("supEmail")?.value.trim();
        const message = document.getElementById("supMsg")?.value.trim();
        const file = document.getElementById("supFile")?.files[0];

        if (!name || !email || !message) {
            alert("Please fill all required fields.");
            return;
        }

        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                saveSupportMessage(name, email, message, reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            saveSupportMessage(name, email, message, null);
        }
    };

    function saveSupportMessage(name, email, message, fileData) {

        let messages = JSON.parse(localStorage.getItem("supportMessages")) || [];

        messages.push({
            name,
            email,
            message,
            file: fileData,
            date: new Date().toLocaleString()
        });

        localStorage.setItem("supportMessages", JSON.stringify(messages));

        alert("Message sent!");

        document.getElementById("supName").value = "";
        document.getElementById("supEmail").value = "";
        document.getElementById("supMsg").value = "";
        document.getElementById("supFile").value = "";

        document.getElementById("supportPanel").style.display = "none";
    }

});

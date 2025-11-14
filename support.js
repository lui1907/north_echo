/* ===============================
   SUPPORT PANEL OPEN/CLOSE
================================ */

document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("supportBtn");
  const panel = document.getElementById("supportPanel");
  const close = document.getElementById("supportClose");

  if (btn) {
    btn.addEventListener("click", () => {
      panel.style.display = "flex";
    });
  }

  if (close) {
    close.addEventListener("click", () => {
      panel.style.display = "none";
    });
  }

});


/* ===============================
   SEND MESSAGE
================================ */

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("supportForm");

  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    let username = localStorage.getItem("loggedInUser") || "Guest";

    let name = document.getElementById("sup_name").value.trim();
    let email = document.getElementById("sup_email").value.trim();
    let message = document.getElementById("sup_msg").value.trim();
    let file = document.getElementById("sup_file").files[0];

    if (message === "") {
      alert("Please write your message.");
      return;
    }

    let savedMessages = JSON.parse(localStorage.getItem("support_messages")) || [];

    let fileDataUrl = null;

    if (file) {
      const reader = new FileReader();

      reader.onload = function() {
        fileDataUrl = reader.result;

        saveMessage();
      };

      reader.readAsDataURL(file);
    } else {
      saveMessage();
    }

    function saveMessage() {

      let newMsg = {
        from: username,
        name: name,
        email: email,
        message: message,
        file: fileDataUrl,
        date: new Date().toLocaleString()
      };

      savedMessages.push(newMsg);

      localStorage.setItem("support_messages", JSON.stringify(savedMessages));

      alert("Your message has been sent.");
      form.reset();
    }

  });

});

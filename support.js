/* ===========================
   SUPPORT PANEL TOGGLE
=========================== */
function toggleSupportPanel() {
  const panel = document.getElementById("supportPanel");
  if (!panel) return;

  panel.classList.toggle("open");
}


/* ===========================
   SEND SUPPORT MESSAGE
=========================== */
function sendSupportMessage() {
  const name = document.getElementById("supName").value.trim();
  const email = document.getElementById("supEmail").value.trim();
  const message = document.getElementById("supMsg").value.trim();
  const fileInput = document.getElementById("supFile");

  if (!name || !email || !message) {
    alert("Please fill in all required fields.");
    return;
  }

  let fileData = null;

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function () {
      fileData = reader.result;
      saveSupportMessage(name, email, message, fileData);
    };

    reader.readAsDataURL(file);
  } else {
    saveSupportMessage(name, email, message, null);
  }
}


/* ===========================
   SAVE TO LOCALSTORAGE
=========================== */
function saveSupportMessage(name, email, message, fileData) {
  const loggedUser = localStorage.getItem("loggedInUser") || "Guest";

  const newMessage = {
    id: Date.now(),
    user: loggedUser,
    name: name,
    email: email,
    message: message,
    file: fileData,
    date: new Date().toLocaleString()
  };

  let allMessages = JSON.parse(localStorage.getItem("support_messages")) || [];
  allMessages.push(newMessage);

  localStorage.setItem("support_messages", JSON.stringify(allMessages));

  alert("Your message has been sent successfully!");

  // Temizle
  document.getElementById("supName").value = "";
  document.getElementById("supEmail").value = "";
  document.getElementById("supMsg").value = "";
  document.getElementById("supFile").value = "";

  toggleSupportPanel();
}

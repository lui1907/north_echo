const supportBtn = document.getElementById("supportBtn");
const supportPanel = document.getElementById("supportPanel");
const spClose = document.getElementById("spClose");

supportBtn.onclick = () => supportPanel.classList.add("open");
spClose.onclick = () => supportPanel.classList.remove("open");

function sendSupportMessage() {

  let name = sp_name.value.trim();
  let email = sp_email.value.trim();
  let subject = sp_subject.value;
  let message = sp_message.value.trim();
  let file = sp_file.files[0];

  if (!name || !email || !message) {
    sp_status.innerHTML = "⚠ Please fill all required fields.";
    sp_status.style.color = "orange";
    return;
  }

  let username = localStorage.getItem("loggedInUser") || "GUEST";

  let msgObj = {
    user: username,
    name, email, subject, message,
    date: new Date().toLocaleString(),
    fileName: file ? file.name : null
  };

  let all = JSON.parse(localStorage.getItem("support_messages")) || [];
  all.push(msgObj);
  localStorage.setItem("support_messages", JSON.stringify(all));

  sp_status.innerHTML = "✔ Your support message has been sent.";
  sp_status.style.color = "#00ff88";

  sp_name.value = "";
  sp_email.value = "";
  sp_message.value = "";
  sp_file.value = "";
}

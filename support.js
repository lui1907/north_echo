function toggleSupportPanel() {
  const panel = document.getElementById("supportPanel");
  panel.classList.toggle("open");
}

function sendSupportMessage() {
  const nameInput = document.getElementById("supName");
  const emailInput = document.getElementById("supEmail");
  const msgInput = document.getElementById("supMsg");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const msg = msgInput.value.trim();

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

  let messages = JSON.parse(localStorage.getItem("supportMessages") || "[]");
  messages.push(data);
  localStorage.setItem("supportMessages", JSON.stringify(messages));

  alert("Your message has been sent!");

  nameInput.value = "";
  emailInput.value = "";
  msgInput.value = "";

  toggleSupportPanel();
}

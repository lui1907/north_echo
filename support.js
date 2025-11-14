/* SUPPORT PANEL AÇ KAPAT */
function toggleSupportPanel() {
  const panel = document.getElementById("supportPanel");
  panel.style.display = (panel.style.display === "flex") ? "none" : "flex";
}

/* MESAJ GÖNDER */
function sendSupportMessage() {
  const name = document.getElementById("supName").value.trim();
  const email = document.getElementById("supEmail").value.trim();
  const text = document.getElementById("supMsg").value.trim();
  const fileInput = document.getElementById("supFile");
  const file = fileInput.files[0];

  if (!name || !email || !text) {
    alert("Please fill all required fields.");
    return;
  }

  let fileData = "";

  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      fileData = reader.result;
      saveMessage(name, email, text, fileData);
    };
    reader.readAsDataURL(file);
  } else {
    saveMessage(name, email, text, "");
  }
}

/* MESAJ KAYDET */
function saveMessage(name, email, text, fileData) {
  const msg = {
    name: name,
    email: email,
    text: text,
    file: fileData,
    date: new Date().toLocaleString(),
    read: false,
    adminNote: ""
  };

  let messages = JSON.parse(localStorage.getItem("supportMessages")) || [];
  messages.push(msg);
  localStorage.setItem("supportMessages", JSON.stringify(messages));

  alert("Your message has been sent!");
  toggleSupportPanel();

  // inputları temizle
  document.getElementById("supName").value = "";
  document.getElementById("supEmail").value = "";
  document.getElementById("supMsg").value = "";
  document.getElementById("supFile").value = "";
}

/* IMAGE MODAL */
function openImgModal(url) {
  let win = window.open();
  win.document.write("<img src='" + url + "' style='width:100%; border-radius:12px;'>");
}

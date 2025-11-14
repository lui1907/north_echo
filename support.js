// -------------------------------
// FIREBASE CONFIG
// -------------------------------
var firebaseConfig = {
  apiKey: "AIzaSyCbWvQenaRuSp0Op0IJLCl2fjV7I45tMX4",
  authDomain: "northecho-support.firebaseapp.com",
  projectId: "northecho-support"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

// -------------------------------
// PANEL AÇ / KAPAT
// -------------------------------
function toggleSupportPanel() {
  const p = document.getElementById("supportPanel");
  p.style.display = (p.style.display === "block") ? "none" : "block";
}

// -------------------------------
// MESAJ GÖNDER
// -------------------------------
async function sendSupportMessage() {

  let name = document.getElementById("supName").value.trim();
  let email = document.getElementById("supEmail").value.trim();
  let category = document.getElementById("supCategory").value;
  let message = document.getElementById("supMsg").value.trim();

  if (!name || !email || !message) {
    alert("Please fill all required fields!");
    return;
  }

  try {

    await db.collection("supportMessages").add({
      name,
      email,
      category,
      message,
      date: new Date().toISOString()
    });

    alert("Message sent!");
    toggleSupportPanel();

  } catch (err) {
    console.error("SEND ERROR:", err);
    alert("Error sending message!");
  }
}

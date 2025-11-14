// ----------------------------
// FIREBASE CONFIG
// ----------------------------
var firebaseConfig = {
  apiKey: "AIzaSyCbWvQenaRuSp0Op0IJLCl2fjV7I45tMX4",
  authDomain: "northecho-support.firebaseapp.com",
  projectId: "northecho-support",
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

// ----------------------------
// PANEL AÇ / KAPAT
// ----------------------------
function toggleSupportPanel() {
  const p = document.getElementById("supportPanel");
  p.style.display = (p.style.display === "block") ? "none" : "block";
}

// ----------------------------
// MESAJ GÖNDER
// ----------------------------
async function sendSupportMessage() {

  const name = document.getElementById("supName").value.trim();
  const email = document.getElementById("supEmail").value.trim();
  const message = document.getElementById("supMsg").value.trim();
  const category = document.getElementById("supCategory").value;

  if (!name || !email || !message) {
    alert("Please fill all required fields!");
    return;
  }

  try {
    await db.collection("supportMessages").add({
      name: name,
      email: email,
      message: message,
      category: category,
      date: new Date().toISOString()
    });

    alert("Your message was sent successfully!");
    toggleSupportPanel();

  } catch (err) {
    console.error("SEND ERROR:", err);
    alert("Error sending message.");
  }
}

//-----------------------------------
// FIREBASE CONFIG
//-----------------------------------
var firebaseConfig = {
  apiKey: "AIzaSyCbWvQenaRuSp0Op0IJLCl2fjV7I45tMX4",
  authDomain: "northecho-support.firebaseapp.com",
  projectId: "northecho-support"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

//-----------------------------------
// PANEL AÇ KAPAT
//-----------------------------------
function toggleSupportPanel() {
  const p = document.getElementById("supportPanel");
  p.style.display = (p.style.display === "block") ? "none" : "block";
}

//-----------------------------------
// MESAJ GÖNDER
//-----------------------------------
async function sendSupportMessage() {

  let name = document.getElementById("supName").value;
  let email = document.getElementById("supEmail").value;
  let category = document.getElementById("supCategory").value;
  let msg = document.getElementById("supMsg").value;

  if (!name || !email || !msg) {
    alert("Please fill all fields");
    return;
  }

  try {
    await db.collection("supportMessages").add({
      name,
      email,
      category,
      msg,
      date: new Date().toISOString()
    });

    alert("Message sent!");
    toggleSupportPanel();

  } catch (e) {
    console.error("SEND ERROR", e);
    alert("Error sending message");
  }
}

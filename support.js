// --- FIREBASE INIT ---
const firebaseConfig = {
  apiKey: "AIzaSyCbWvQenaRuSp0Op0IJLCl2fjV7I45tMX4",
  authDomain: "northecho-support.firebaseapp.com",
  projectId: "northecho-support",
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


// --- PANEL AÇ / KAPAT ---
function toggleSupportPanel() {
  const panel = document.getElementById("supportPanel");
  panel.style.display = (panel.style.display === "block") ? "none" : "block";
}


// --- MESAJ GÖNDER ---
async function sendSupportMessage() {

  const name = document.getElementById("supName").value.trim();
  const email = document.getElementById("supEmail").value.trim();
  const message = document.getElementById("supMsg").value.trim();
  const category = document.getElementById("supCategory").value;

  if (!name || !email || !message) {
    alert("Please fill required fields.");
    return;
  }

  await db.collection("supportMessages").add({
    name,
    email,
    message,
    category,
    date: new Date().toISOString(),
  });

  alert("Your message has been sent!");
  toggleSupportPanel();
}

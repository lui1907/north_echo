// support.js  (FIREBASE + GLOBAL FONKSİYONLAR)

// --- Firebase importları (CDN üzerinden) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// --- SENİN PROJENİN AYNI CONFIG'İ ---
const firebaseConfig = {
  apiKey: "AIzaSyCbWvQenaRuSp0Op0IJLCl2fjV7I45tMX4",
  authDomain: "northecho-support.firebaseapp.com",
  projectId: "northecho-support",
  storageBucket: "northecho-support.firebasestorage.app",
  messagingSenderId: "1009667934154",
  appId: "1:1009667934154:web:9cbd8552178713dc12f133"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ==============================
// PANEL AÇ / KAPAT
// ==============================
function _toggleSupportPanel () {
  const p = document.getElementById("supportPanel");
  if (!p) return;
  p.style.display = (p.style.display === "block") ? "none" : "block";
}

// HTML’de onclick="toggleSupportPanel()" çalışsın diye:
window.toggleSupportPanel = _toggleSupportPanel;

// ==============================
// DOSYAYI DATA URL'E ÇEVİRME
// ==============================
function fileToDataURL(file) {
  return new Promise((resolve) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

// ==============================
// MESAJ GÖNDER
// ==============================
async function _sendSupportMessage () {
  const nameEl  = document.getElementById("supName");
  const mailEl  = document.getElementById("supEmail");
  const msgEl   = document.getElementById("supMsg");
  const fileEl  = document.getElementById("supFile");

  if (!nameEl || !mailEl || !msgEl) {
    alert("Form elemanları bulunamadı (supName / supEmail / supMsg).");
    return;
  }

  const name  = nameEl.value.trim();
  const email = mailEl.value.trim();
  const text  = msgEl.value.trim();
  const file  = fileEl?.files[0] || null;

  if (!name || !email || !text) {
    alert("Please fill all required fields.");
    return;
  }

  try {
    // Dosya varsa DataURL’e çevir
    const fileDataUrl = await fileToDataURL(file);

    // Firestore’a kaydet
    await addDoc(collection(db, "messages"), {
      name,
      email,
      text,
      file: fileDataUrl || null,
      date: new Date().toLocaleString(),
      createdAt: serverTimestamp(),
      read: false,
      adminNote: ""
    });

    // Formu temizle
    nameEl.value = "";
    mailEl.value = "";
    msgEl.value = "";
    if (fileEl) fileEl.value = "";

    alert("Message sent successfully.");
    _toggleSupportPanel();

  } catch (err) {
    console.error("Support send error:", err);
    alert("Error sending message. Check console.");
  }
}

// HTML’de onclick="sendSupportMessage()" çalışsın diye:
window.sendSupportMessage = _sendSupportMessage;

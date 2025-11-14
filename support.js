/* ============================================================
   FIREBASE BAĞLANTISI
   ============================================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

/* -- SENİN CONFIGİN -- */
const firebaseConfig = {
  apiKey: "AIzaSyCbWvQenaRuSp0Op0IJLCl2fjV7I45tMX4",
  authDomain: "northecho-support.firebaseapp.com",
  projectId: "northecho-support",
  storageBucket: "northecho-support.firebasestorage.app",
  messagingSenderId: "1009667934154",
  appId: "1:1009667934154:web:9cbd8552178713dc12f133"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


/* ============================================================
   SUPPPORT PANEL AÇ/KAPAT
   ============================================================ */
function toggleSupportPanel() {
  let panel = document.getElementById("supportPanel");
  panel.style.display = (panel.style.display === "block") ? "none" : "block";
}
window.toggleSupportPanel = toggleSupportPanel;


/* ============================================================
   MESAJ GÖNDERME
   ============================================================ */
window.sendSupportMessage = async function () {

  const name = document.getElementById("supName").value.trim();
  const email = document.getElementById("supEmail").value.trim();
  const msg = document.getElementById("supMsg").value.trim();
  const fileInput = document.getElementById("supFile");

  if (!name || !email || !msg) {
    alert("Please fill all required fields.");
    return;
  }

  let fileURL = "";

  // ---------- FOTOĞRAF / DOSYA VARSA YÜKLE ----------
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const filePath = `uploads/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filePath);

    await uploadBytes(storageRef, file);
    fileURL = await getDownloadURL(storageRef);
  }

  // ---------- FIRESTORE'A KAYDET ----------
  await addDoc(collection(db, "messages"), {
    name,
    email,
    message: msg,
    file: fileURL,
    date: new Date().toISOString()
  });

  alert("Your message was sent successfully!");
  toggleSupportPanel();

  // inputları temizle
  document.getElementById("supName").value = "";
  document.getElementById("supEmail").value = "";
  document.getElementById("supMsg").value = "";
  document.getElementById("supFile").value = "";
};

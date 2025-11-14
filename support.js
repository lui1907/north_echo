// ==============================
//  FIREBASE IMPORTS
// ==============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";


// ==============================
//  FIREBASE CONFIG
// ==============================
const firebaseConfig = {
  apiKey: "AIzaSyCbWvQenaRuSp0Op0IJLCl2fjV7I45tMX4",
  authDomain: "northecho-support.firebaseapp.com",
  projectId: "northecho-support",
  storageBucket: "northecho-support.appspot.com",
  messagingSenderId: "1009667934154",
  appId: "1:1009667934154:web:9cbd8552178713dc12f133"
};

// Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


// ==============================
//  PANEL AÇ/KAPAT
// ==============================
window.toggleSupportPanel = function () {
  const panel = document.getElementById("supportPanel");
  panel.style.display = panel.style.display === "block" ? "none" : "block";
};


// ==============================
//  MESSAGE SEND
// ==============================
window.sendSupportMessage = async function () {
  const name = document.getElementById("supName").value.trim();
  const email = document.getElementById("supEmail").value.trim();
  const msg = document.getElementById("supMsg").value.trim();
  const fileInput = document.getElementById("supFile");

  if (!name || !email || !msg) {
    alert("Please fill all required fields!");
    return;
  }

  let fileURL = "";

  try {

    // =====================================
    //  UPLOAD FILE (if exists)
    // =====================================
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const storageRef = ref(storage, "supportUploads/" + Date.now() + "_" + file.name);

      await uploadBytes(storageRef, file);
      fileURL = await getDownloadURL(storageRef);
    }


    // =====================================
    //  SAVE MESSAGE TO FIRESTORE
    // =====================================
    await addDoc(collection(db, "messages"), {
      name: name,
      email: email,
      text: msg,
      file: fileURL,
      createdAt: serverTimestamp()
    });

    alert("Message sent successfully!");
    document.getElementById("supportPanel").style.display = "none";

    document.getElementById("supName").value = "";
    document.getElementById("supEmail").value = "";
    document.getElementById("supMsg").value = "";
    fileInput.value = "";

  } catch (e) {
    console.error("Error sending message:", e);
    alert("An error occurred.");
  }
};
<!-- Firebase SDK (importsuz çalışır) -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"></script>

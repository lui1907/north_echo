/* ============================================================
   FIREBASE BAĞLANTISI (importsuz GitHub uyumlu sürüm)
============================================================ */
const firebaseConfig = {
    apiKey: "AIzaSyCbWvQenaRuSp0Op0IJLCl2fjV7I45tMX4",
    authDomain: "northecho-support.firebaseapp.com",
    projectId: "northecho-support",
    storageBucket: "northecho-support.appspot.com",
    messagingSenderId: "1009667934154",
    appId: "1:1009667934154:web:9cbd8552178713dc12f133"
};

// Firebase başlat
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* ============================================================
   PANEL AÇ / KAPAT
============================================================ */
function toggleSupportPanel() {
    let panel = document.getElementById("supportPanel");
    panel.style.display = (panel.style.display === "block") ? "none" : "block";
}

/* ============================================================
   DOSYAYI BASE64'E ÇEVİR
============================================================ */
function fileToBase64(file) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}

/* ============================================================
   MESAJ GÖNDER
============================================================ */
async function sendSupportMessage() {
    const name = document.getElementById("supName").value.trim();
    const email = document.getElementById("supEmail").value.trim();
    const message = document.getElementById("supMsg").value.trim();
    const fileInput = document.getElementById("supFile");

    if (!name || !email || !message) {
        alert("Please fill in all required fields.");
        return;
    }

    let fileData = null;

    if (fileInput.files.length > 0) {
        fileData = await fileToBase64(fileInput.files[0]);
    }

    await db.collection("supportMessages").add({
        name: name,
        email: email,
        message: message,
        file: fileData,
        date: new Date().toISOString(),
        read: false
    });

    alert("Message sent!");
    toggleSupportPanel();
}

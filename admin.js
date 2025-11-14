// -----------------------------------------
// 🔥 Firebase Bağlantısı
// -----------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore,
    collection,
    getDocs,
    deleteDoc,
    doc,
    updateDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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



// -----------------------------------------
// 🔐 Admin Login Kontrolü
// -----------------------------------------
const ADMINS = ["luivoss", "lui1907", "ahmet", "owner", "admin"];

let loggedUser = localStorage.getItem("loggedInUser");

if (!loggedUser || !ADMINS.includes(loggedUser.toLowerCase())) {
    window.location.href = "index.html";
}



// -----------------------------------------
// 📩 MESAJLARI FIREBASE'DEN ÇEK
// -----------------------------------------
const msgBox = document.getElementById("adminMessages");
let ALL_MESSAGES = [];

async function loadMessages() {

    msgBox.innerHTML = "<p style='opacity:.6;'>Loading...</p>";

    const snap = await getDocs(collection(db, "messages"));
    ALL_MESSAGES = [];

    snap.forEach(docItem => {
        ALL_MESSAGES.push({
            id: docItem.id,
            ...docItem.data()
        });
    });

    renderMessages("all");
}



// -----------------------------------------
// 🎛️ FİLTRELEME
// -----------------------------------------
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;
        renderMessages(filter);
    });
});



// -----------------------------------------
// 🖼️ Mesajları Listele
// -----------------------------------------
function renderMessages(filterType) {

    msgBox.innerHTML = "";

    let list = ALL_MESSAGES;

    if (filterType === "unread") {
        list = list.filter(m => !m.read);
    }

    if (filterType === "withfile") {
        list = list.filter(m => m.file);
    }

    if (list.length === 0) {
        msgBox.innerHTML = "<p style='opacity:.6;'>No messages.</p>";
        return;
    }

    list.forEach(msg => {

        msgBox.innerHTML += `
        
        <div class="msg-box">

            <div class="msg-top">
                <div>
                    <div class="msg-sender">${msg.name || "Unknown"}</div>
                    <div class="msg-email">${msg.email || ""}</div>
                </div>

                <button class="msg-delete" onclick="deleteMessage('${msg.id}')">
                    Delete
                </button>
            </div>

            <div class="msg-text">${msg.message || "(empty)"}</div>

            ${msg.file ? 
                `<img src="${msg.file}" class="msg-img" onclick="openImgModal('${msg.file}')">`
                : ""
            }

            <div class="msg-date">${msg.date || ""}</div>

            <textarea id="reply-${msg.id}" class="reply-input" placeholder="Write admin reply...">${msg.reply || ""}</textarea>

            <button class="reply-btn" onclick="sendReply('${msg.id}')">
                Send Reply
            </button>
        </div>

        `;
    });

}



// -----------------------------------------
// 💬 ADMİN YANIT GÖNDER
// -----------------------------------------
window.sendReply = async function(id) {
    const replyText = document.getElementById(`reply-${id}`).value;

    await updateDoc(doc(db, "messages", id), {
        reply: replyText,
        read: true
    });

    alert("Reply saved.");

    loadMessages();
}



// -----------------------------------------
// 🗑️ MESAJ SİL
// -----------------------------------------
window.deleteMessage = async function(id) {
    if (!confirm("Delete this message?")) return;

    await deleteDoc(doc(db, "messages", id));

    loadMessages();
}



// -----------------------------------------
// 🖼️ FOTO MODAL
// -----------------------------------------
window.openImgModal = function(url) {
    document.getElementById("imgModalContent").src = url;
    document.getElementById("imgModal").style.display = "flex";
};

window.closeImgModal = function() {
    document.getElementById("imgModal").style.display = "none";
};



// -----------------------------------------
// 📌 BAŞLANGIÇ
// -----------------------------------------
loadMessages();


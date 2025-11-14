// -------------------
// Supabase Config
// -------------------
const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const messageList = document.getElementById("messageList");
const noMessages = document.getElementById("noMessages");

let allMessages = [];

// -------------------
// VERİLERİ ÇEK
// -------------------
async function loadMessages() {
    const { data, error } = await client
        .from("messages")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error("Supabase Error:", error);
        return;
    }

    allMessages = data;
    renderMessages("all");
}

// -------------------
// MESAJLARI RENDER ET
// -------------------
function renderMessages(category = "all") {
    messageList.innerHTML = "";

    let filtered = category === "all"
        ? allMessages
        : allMessages.filter(m => m.category === category);

    if (filtered.length === 0) {
        noMessages.style.display = "block";
        return;
    }

    noMessages.style.display = "none";

    filtered.forEach(msg => {
        const div = document.createElement("div");
        div.className = "message";

        div.innerHTML = `
            <div class="name">
                <div class="tick"></div> ${msg.name}
            </div>

            <p>${msg.message}</p>

            <small>${new Date(msg.created_at).toLocaleString()}</small>

            <button class="delete-btn" data-id="${msg.id}">Delete</button>
        `;

        messageList.appendChild(div);
    });

    // Silme
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async e => {
            let id = e.target.getAttribute("data-id");

            await client.from("messages").delete().eq("id", id);

            allMessages = allMessages.filter(m => m.id != id);
            renderMessages(category);
        });
    });
}

// -------------------
// KATEGORİ TIKLAMA
// -------------------
document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {

        document.querySelectorAll(".category-btn")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        const cat = btn.getAttribute("data-category");
        renderMessages(cat);
    });
});

// Başlangıçta yükle
loadMessages();

// -----------------------------------------
// 🔥 Supabase Connection
// -----------------------------------------
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// -----------------------------------------
// 🔐 Admin Access Check
// -----------------------------------------
const ADMINS = ["luivoss", "fstekin"]; // sadece bu kullanıcılar erişebilir
const loggedUser = localStorage.getItem("loggedInUser");

if (!loggedUser || !ADMINS.includes(loggedUser.toLowerCase())) {
  window.location.href = "index.html";
}

// -----------------------------------------
// 🧭 Panel Sections
// -----------------------------------------
const msgTab = document.getElementById("tabMessages");
const prodTab = document.getElementById("tabProducts");
const msgSection = document.getElementById("messagesSection");
const prodSection = document.getElementById("productsSection");

// aktif sekme değiştirme
msgTab.onclick = () => showSection("messages");
prodTab.onclick = () => showSection("products");

function showSection(which) {
  if (which === "messages") {
    msgSection.style.display = "block";
    prodSection.style.display = "none";
    msgTab.classList.add("active");
    prodTab.classList.remove("active");
    loadMessages();
  } else {
    msgSection.style.display = "none";
    prodSection.style.display = "block";
    msgTab.classList.remove("active");
    prodTab.classList.add("active");
  }
}

// -----------------------------------------
// 📨 Load Messages (for admin)
// -----------------------------------------
const msgContainer = document.getElementById("adminMessages");

async function loadMessages() {
  msgContainer.innerHTML = "<p>Loading...</p>";
  const { data, error } = await supabase.from("messages").select("*").order("id", { ascending: false });
  if (error) {
    msgContainer.innerHTML = "<p>Error loading messages.</p>";
    console.error(error);
    return;
  }

  msgContainer.innerHTML = "";
  data.forEach((msg) => {
    msgContainer.innerHTML += `
      <div class="msg-box">
        <div class="msg-top">
          <div>
            <b>${msg.name}</b> <small>(${msg.email})</small><br>
            <span>${msg.category}</span>
          </div>
          <button class="msg-delete" data-id="${msg.id}">🗑️</button>
        </div>
        <p>${msg.message}</p>
        ${msg.file ? `<img src="${msg.file}" class="msg-img" />` : ""}
      </div>
    `;
  });

  document.querySelectorAll(".msg-delete").forEach((btn) => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      await supabase.from("messages").delete().eq("id", id);
      loadMessages();
    };
  });
}

// -----------------------------------------
// 🛍️ Product Add Section
// -----------------------------------------
const saveBtn = document.getElementById("saveProduct");

saveBtn.onclick = async () => {
  const name = document.getElementById("pName").value.trim();
  const price = parseFloat(document.getElementById("pPrice").value);
  const category = document.getElementById("pCategory").value.trim();
  const desc = document.getElementById("pDesc").value.trim();
  const sizes = document.getElementById("pSizes").value.trim();
  const imgs = document.getElementById("pImages").value.trim();

  if (!name || !price || !category) {
    alert("Please fill all required fields!");
    return;
  }

  const { error } = await supabase.from("products").insert([
    {
      name,
      price,
      category,
      description: desc,
      sizes,
      images: imgs,
    },
  ]);

  if (error) {
    console.error("Insert error:", error);
    alert("Product insert failed ❌");
  } else {
    alert("Product added ✅");
    document.getElementById("pName").value = "";
    document.getElementById("pPrice").value = "";
    document.getElementById("pCategory").value = "";
    document.getElementById("pDesc").value = "";
    document.getElementById("pSizes").value = "";
    document.getElementById("pImages").value = "";
  }
};

// -----------------------------------------
// 🚀 Initialize
// -----------------------------------------
showSection("messages");

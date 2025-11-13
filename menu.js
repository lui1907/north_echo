const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const closeMenu = document.getElementById("closeMenu");

// MENU AÇ
menuBtn.addEventListener("click", () => {
    sideMenu.classList.add("open");
});

// MENU KAPAT
closeMenu.addEventListener("click", () => {
    sideMenu.classList.remove("open");
});

// MENÜ AÇIKKEN DIŞA TIKLAYINCA KAPAT
document.addEventListener("click", (e) => {
    if (!sideMenu.contains(e.target) && e.target !== menuBtn) {
        sideMenu.classList.remove("open");
    }
});

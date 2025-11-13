document.addEventListener("DOMContentLoaded", () => {
  
  const menuBtn = document.getElementById("menuBtn");
  const closeBtn = document.getElementById("closeMenu");
  const sideMenu = document.getElementById("sideMenu");

  // MENÜ AÇ
  menuBtn.addEventListener("click", () => {
    sideMenu.classList.add("open");
  });

  // MENÜ KAPAT
  closeBtn.addEventListener("click", () => {
    sideMenu.classList.remove("open");
  });

});

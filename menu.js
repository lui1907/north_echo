const sideMenu = document.getElementById("sideMenu");
const menuBtn = document.getElementById("menuBtn");
const closeMenu = document.getElementById("closeMenu");

menuBtn.onclick = () => {
    sideMenu.style.left = "0";
};

closeMenu.onclick = () => {
    sideMenu.style.left = "-260px";
};

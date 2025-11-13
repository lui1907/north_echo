const btn = document.getElementById("themeToggle");

btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");

    if (current === "light") {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
    }
});

// Load saved theme
const saved = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", saved);

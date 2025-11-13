// theme.js

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("themeToggle");

    // Kaydedilmiş tema var mı?
    let theme = localStorage.getItem("theme") || "dark";
    applyTheme(theme);

    btn.addEventListener("click", () => {
        theme = theme === "dark" ? "light" : "dark";
        localStorage.setItem("theme", theme);
        applyTheme(theme);
    });
});

function applyTheme(theme) {
    if (theme === "light") {
        document.documentElement.style.setProperty("--bg", "#fff");
        document.documentElement.style.setProperty("--text", "#000");
        document.documentElement.style.setProperty("--card", "#f4f4f4");
        document.documentElement.style.setProperty("--border", "#ccc");
    } else {
        document.documentElement.style.setProperty("--bg", "#000");
        document.documentElement.style.setProperty("--text", "#fff");
        document.documentElement.style.setProperty("--card", "#111");
        document.documentElement.style.setProperty("--border", "#222");
    }
}

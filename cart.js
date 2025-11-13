<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <link rel="stylesheet" href="style.css"/>
  <script src="cart.js" defer></script>
</head>
<body>

<header class="header">
  <div class="hamburger" id="menuBtn">☰</div>
  <a href="index.html" class="logo">NORTH ECHO</a>
  <div class="right-buttons">
    <a href="cart.html" class="cart-icon">🛒 <span id="cartCount">0</span></a>
    <button id="themeToggle" class="theme-btn">○</button>
  </div>
</header>

<main class="cart-page">
  <h1>Your Cart</h1>
  <div id="cartItems" class="cart-items"></div>
  <h2 id="cartTotal"></h2>
</main>

<script>
const itemsEl = document.getElementById("cartItems");
const totalEl = document.getElementById("cartTotal");

const cart = JSON.parse(localStorage.getItem("cart")) || [];

if (cart.length === 0) {
    itemsEl.innerHTML = "<p>Cart is empty.</p>";
    totalEl.textContent = "";
} else {
    let total = 0;

    cart.forEach(item => {
        itemsEl.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" width="80" />
                <h3>${item.name}</h3>
                <p>${item.price}€ × ${item.quantity}</p>
            </div>
        `;

        total += item.price * item.quantity;
    });

    totalEl.textContent = "Total: " + total + "€";
}
</script>

</body>
</html>

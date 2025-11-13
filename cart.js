// CART SYSTEM — FINAL VERSION

// CART COUNT LOADER
function loadCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((total, item) => total + item.quantity, 0);

  const badge = document.getElementById("cartCount");
  if (badge) badge.textContent = count;
}

// ADD TO CART (QTY SUPPORT)
function addToCart(name, price, image, size, qty = 1) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let existing = cart.find(item => item.name === name && item.size === size);

  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({
      name: name,
      price: price,
      image: image,
      size: size,
      quantity: qty
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartCount();
}

// LOAD COUNTER
document.addEventListener("DOMContentLoaded", loadCartCount);

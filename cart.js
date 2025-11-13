// CART SYSTEM — FINAL VERSION

function loadCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  
  const badge = document.getElementById("cartCount");
  if (badge) badge.textContent = count;
}

// ADD TO CART FUNCTION
function addToCart(name, price, image, size) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // SAME PRODUCT & SAME SIZE? → Increase quantity
  let existing = cart.find(item => item.name === name && item.size === size);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      name: name,
      price: price,
      image: image,
      size: size,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartCount();

  alert("Added to cart!");
}

// LOAD COUNT ON PAGE START
document.addEventListener("DOMContentLoaded", loadCartCount);

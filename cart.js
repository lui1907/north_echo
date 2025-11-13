/* ===============================
   CART SYSTEM — North Echo
   Fully Connected (Products → Cart → Checkout)
================================= */

function loadCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;
    cart.forEach(i => total += i.quantity);
    document.getElementById("cartCount").textContent = total;
}

document.addEventListener("DOMContentLoaded", loadCartCount);


/* ===========================
   ADD TO CART
=========================== */
function addToCart(name, price, image, size, qty = 1) {

    if (!size) {
        alert("Please select a size.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Aynı ürün + aynı beden varsa miktarı arttır
    let existing = cart.find(
        item => item.name === name && item.size === size
    );

    if (existing) {
        existing.quantity += qty;
    } else {
        cart.push({
            name: name,
            price: price,
            size: size,
            image: image,
            quantity: qty
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartCount();

    alert("Added to cart!");
}

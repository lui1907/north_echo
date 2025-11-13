// ------------------------------
// SLIDER (Eğer isteğe göre geliştirilecek)
// ------------------------------
function initProductPage() {
    const img = document.querySelector(".product-img");
    return; // Şimdilik slider yok, sade tasarım
}

// ------------------------------
// ADD TO CART (ASIL KISIM)
// ------------------------------

function addToCart(name, price) {
    const sizeSelect = document.querySelector("select");
    const size = sizeSelect.value;

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    cart.push({
        name: name,
        price: price,
        size: size,
        qty: 1
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Added to cart ✔");
}

// Eğer sayfa ürün sayfasıysa slider init edilir
document.addEventListener("DOMContentLoaded", initProductPage);

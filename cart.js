function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById("cartCount");
    if (cartCountEl) cartCountEl.textContent = count;
}

function changeQuantity(name, type) {
    let cart = getCart();
    let item = cart.find(i => i.name === name);

    if (!item) return;

    if (type === "increase") {
        item.quantity += 1;
    } 
    if (type === "decrease") {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.name !== name); // ürünü sil
        }
    }

    saveCart(cart);
    loadCartPage();
    updateCartCount();
}

document.addEventListener("DOMContentLoaded", updateCartCount);

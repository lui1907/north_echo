/* ================= CART SYSTEM ================= */

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

/* SEPET SAYISINI GÜNCELLE */
function updateCartCount() {
    const cart = getCart();
    let totalQty = 0;

    cart.forEach(item => {
        totalQty += item.quantity;
    });

    document.getElementById("cartCount").textContent = totalQty;
}

/* SEPETE EKLE */
function addToCart(product) {
    let cart = getCart();

    const existing = cart.find(
        item => item.id == product.id && item.size == product.size
    );

    if (existing) {
        existing.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    saveCart(cart);
}

/* ================= CART PAGE ================= */
function renderCartPage() {
    const cart = getCart();

    const list = document.getElementById("cartItems");
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("total");

    if (!list) return;

    list.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;

        list.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" class="ci-img">

                <div class="ci-info">
                    <h3>${item.name}</h3>
                    <p>Size: ${item.size}</p>
                    <p>${item.price}€</p>

                    <div class="ci-qty">
                        <button onclick="changeQty(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQty(${index}, 1)">+</button>
                        <button onclick="removeItem(${index})">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    });

    subtotalEl.textContent = subtotal + "€";
    totalEl.textContent = subtotal + "€";
}

function changeQty(index, val) {
    let cart = getCart();
    cart[index].quantity += val;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
    renderCartPage();
}

function removeItem(index) {
    let cart = getCart();
    cart.splice(index, 1);

    saveCart(cart);
    renderCartPage();
}

/* SAYFA YÜKLENİNCE */
window.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    renderCartPage();
});

/* ============================================================
   NORTH ECHO — CART SYSTEM
   ============================================================ */

// 🛒 CART'I LOCALSTORAGE'DAN AL
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// 🛒 CART'I LOCALSTORAGE'A KAYDET
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

// 🔥 CART SAYACINI GÜNCELLE (Header)
function updateCartCount() {
    let cart = getCart();

    // Toplam ürün miktarı (örneğin 2 ürün varsa ama 3 tane quantity varsa 3 yazar)
    let totalQty = 0;
    cart.forEach(item => totalQty += item.quantity);

    const cartCount = document.getElementById("cartCount");
    if (cartCount) cartCount.textContent = totalQty;
}

// 🛒 ÜRÜNÜ SEPETE EKLE
function addToCart(name, price, image, size, qty = 1) {
    let cart = getCart();

    // Aynı ürün + aynı beden varsa, üstüne eklesin
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

    saveCart(cart);
    updateCartCount();
}

// 🔥 CART ITEM MİKTARINI DEĞİŞTİR
function changeQuantity(index, amount) {
    let cart = getCart();

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1); // 0 olursa ürünü sil
    }

    saveCart(cart);
    location.reload();
}

// 🗑️ ÜRÜN SİL
function removeItem(index) {
    let cart = getCart();

    cart.splice(index, 1);
    saveCart(cart);
    location.reload();
}

/* ============================================================
   SAYFA AÇILDIĞINDA OTOMATİK ÇALIŞANLAR
   ============================================================ */

// HEADER CART SAYACINI HER SAYFADA GÜNCELLE
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
});

/* ============================================================
   CART.HTML — ÜRÜNLERİ LİSTELEME
   ============================================================ */

function loadCartItems() {
    const cart = getCart();
    const container = document.getElementById("cartItems");

    if (!container) return; // cart.html değilse çalışmaz

    container.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;

        container.innerHTML += `
            <div class="cart-item-box">
                <img src="${item.image}" class="cart-img" />

                <div class="cart-info">
                    <h3>${item.name}</h3>
                    <p>Size: ${item.size}</p>
                    <p>${item.price}€</p>

                    <div class="quantity-controls">
                        <button onclick="changeQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)">+</button>
                        <button onclick="removeItem(${index})">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    });

    // ÖZETİ GÜNCELLE
    const subtotalEl = document.getElementById("cartSubtotal");
    const totalEl = document.getElementById("cartTotal");

    if (subtotalEl) subtotalEl.textContent = subtotal + "€";
    if (totalEl) totalEl.textContent = subtotal + "€";
}

// Cart sayfasında otomatik yükle
document.addEventListener("DOMContentLoaded", loadCartItems);

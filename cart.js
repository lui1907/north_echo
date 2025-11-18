/* =============== CART CORE =============== */

function normalizeItem(raw) {
  if (!raw) return null;

  const item = { ...raw };

  // ID zorunlu
  if (item.id == null) return null;

  // quantity düzelt
  let q = Number(item.quantity);
  if (!Number.isFinite(q) || q <= 0) q = 1;
  item.quantity = q;

  // price hem "20" hem "20€" hem NaN gelse toparla
  let priceNum = Number(item.price);
  if (!Number.isFinite(priceNum)) {
    const cleaned = String(item.price || "")
      .replace(",", ".")
      .replace(/[^\d.]/g, "");
    priceNum = parseFloat(cleaned);
  }
  if (!Number.isFinite(priceNum)) priceNum = 0;
  item.price = priceNum;

  // name / size / image boş kalmasın
  item.name = item.name || "Product";
  item.size = item.size || "-";
  item.image = item.image || "assets/noimg.png";

  return item;
}

function getCart() {
  let cart;
  try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
  } catch (e) {
    cart = [];
  }

  cart = cart
    .map(normalizeItem)
    .filter((x) => x !== null);

  // bozuk veriyi temizleyip geri yaz
  localStorage.setItem("cart", JSON.stringify(cart));
  return cart;
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

/* =============== CART ICON COUNT =============== */

function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (!el) return;

  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  el.textContent = total;
}

/* =============== ADD TO CART (GLOBAL) =============== */

function addToCart(product) {
  // product: {id, name, price, size, image}
  let cart = getCart();

  // Fiyatı garantiye al
  let p = Number(product.price);
  if (!Number.isFinite(p)) {
    const cleaned = String(product.price || "")
      .replace(",", ".")
      .replace(/[^\d.]/g, "");
    p = parseFloat(cleaned);
  }
  if (!Number.isFinite(p)) p = 0;

  const normalized = {
    id: product.id,
    name: product.name || "Product",
    price: p,
    size: product.size || "-",
    image: product.image || "assets/noimg.png",
    quantity: 1,
  };

  const existing = cart.find(
    (item) => item.id == normalized.id && item.size === normalized.size
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(normalized);
  }

  saveCart(cart);
}

// global yap
window.addToCart = addToCart;

/* =============== CART PAGE RENDER =============== */

function renderCartPage() {
  const list = document.getElementById("cartItems");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");

  if (!list) return; // cart.html dışında çağrılırsa

  const cart = getCart();

  if (cart.length === 0) {
    list.innerHTML = `<p style="color:#aaa;">Your cart is empty.</p>`;
    if (subtotalEl) subtotalEl.textContent = "0€";
    if (totalEl) totalEl.textContent = "0€";
    return;
  }

  list.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;

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

  if (subtotalEl) subtotalEl.textContent = subtotal + "€";
  if (totalEl) totalEl.textContent = subtotal + "€";
}

function changeQty(index, diff) {
  let cart = getCart();
  if (!cart[index]) return;

  cart[index].quantity += diff;
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

window.changeQty = changeQty;
window.removeItem = removeItem;

/* =============== INIT =============== */

window.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCartPage();
});

// ------------------------------
// LOAD CART ITEMS
// ------------------------------
function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const container = document.getElementById("cartItems");
    const totalEl = document.getElementById("cartTotal");

    container.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <p><b>${item.name}</b></p>
            <p>Size: ${item.size}</p>
            <p>Qty: ${item.qty}</p>
            <p>Price: ${item.price * item.qty}€</p>
            <button onclick="removeItem(${index})">Remove</button>
        `;

        total += item.price * item.qty;
        container.appendChild(div);
    });

    totalEl.textContent = total + "€";
}

// ------------------------------
// REMOVE ITEM
// ------------------------------
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart(); // Refresh UI
}

// ------------------------------
document.addEventListener("DOMContentLoaded", loadCart);

function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Update count in header
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countEl = document.getElementById("cartCount");
    if (countEl) countEl.textContent = count;

    alert("Added to cart!");
}

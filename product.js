function addToCart(productName, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.name === productName);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1,
            image: image
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Sayacı güncelle
    const cartCountEl = document.getElementById("cartCount");
    if (cartCountEl) {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = total;
    }

    alert("Added to cart!");
}

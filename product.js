// Ürün veri listesi (örnek)
const products = {
    "white_tshirt": {
        name: "White Minimal Tee",
        price: 459,
        images: [
            "assets/white/main.jpg",
            "assets/white/1.jpg",
            "assets/white/2.jpg",
            "assets/white/3.jpg"
        ]
    }
};

// URL’den ürün ID al
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// Ürün bilgisi
const product = products[productId];

if (!product) {
    document.querySelector(".product-page").innerHTML = "<h2>Product not found</h2>";
} else {

    // HTML oluştur
    document.querySelector(".product-page").innerHTML = `
        <div class="product-left">
            <img src="${product.images[0]}" id="mainImage" class="product-main-img">

            <div class="product-thumbnails">
                ${product.images.map(img => `
                    <img src="${img}" onclick="changeImage('${img}')">
                `).join("")}
            </div>
        </div>

        <div class="product-right">
            <h2 class="product-title">${product.name}</h2>
            <p class="price">₺${product.price}</p>

            <label>Beden:</label>
            <select id="sizeSelect">
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
            </select>

            <button class="add-cart-btn" onclick="addToCart('${product.name}', ${product.price}, '${product.images[0]}')">
                Add to Cart
            </button>
        </div>
    `;
}

// Thumbnail tıklayınca büyük resmi değiştir
function changeImage(src) {
    document.getElementById("mainImage").src = src;
}


//

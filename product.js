import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://xedfviwffpsvbmyqzoof.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZGZ2aXdmZnBzdmJteXF6b29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM0NzMsImV4cCI6MjA3ODY5OTQ3M30.SK7mEei8GTfUWWPPi4PZjxQzDl68yHsOgQMgYIHunaM";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// URL'den ürün id'si al
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// Ana container
const container = document.querySelector(".product-page");

// Ürünü getir
async function loadProduct() {
  if (!productId) {
    container.innerHTML = "<h2>Product not found ❌</h2>";
    return;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error || !data) {
    console.error("Product fetch error:", error);
    container.innerHTML = "<h2>Product not found ❌</h2>";
    return;
  }

  const product = data;
  const images = product.images ? product.images.split(",") : [];

  container.innerHTML = `
    <div class="product-left">
      <img src="${images[0] || 'assets/default-product.png'}" id="mainImage" class="product-main-img">

      <div class="product-thumbnails">
        ${images.map(img => `
          <img src="${img}" onclick="changeImage('${img}')">
        `).join("")}
      </div>
    </div>

    <div class="product-right">
      <h2 class="product-title">${product.name}</h2>
      <p class="price">€${product.price}</p>

      <p class="product-desc">${product.description || ""}</p>

      <label>Size:</label>
      <select id="sizeSelect">
        ${(product.sizes || "S,M,L,XL").split(",").map(s => `<option>${s.trim()}</option>`).join("")}
      </select>

      <button class="add-cart-btn" onclick="addToCart('${product.name}', ${product.price}, '${images[0]}')">
        Add to Cart
      </button>
    </div>
  `;
}

// Thumbnail tıklayınca ana görseli değiştir
window.changeImage = (src) => {
  document.getElementById("mainImage").src = src;
};

// Ürünü yükle
loadProduct();

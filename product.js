let currentIndex = 0;

function showImage(index) {
  const imgs = document.querySelectorAll(".thumb");
  const mainImg = document.querySelector(".product-img");
  const dots = document.querySelectorAll(".dot");

  if (index < 0) index = imgs.length - 1;
  if (index >= imgs.length) index = 0;

  currentIndex = index;

  mainImg.src = imgs[index].dataset.full;

  dots.forEach(d => d.classList.remove("active"));
  dots[index].classList.add("active");
}

function nextImage() {
  showImage(currentIndex + 1);
}

function prevImage() {
  showImage(currentIndex - 1);
}

document.addEventListener("DOMContentLoaded", () => {
  showImage(0);
});

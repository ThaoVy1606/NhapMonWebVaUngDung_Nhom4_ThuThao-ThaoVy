//xử lý sự kiện thêm sản phẩm vào giỏ hàng (livingrooom)
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".product-card-horizontal").forEach((card, index) => {
    const btn = card.querySelector(".add-to-cart-circle");
    if (btn) {
      btn.addEventListener("click", () => {
        const id = "living-" + (index + 1);
        const name = card.querySelector("h3").innerText;
        const desc = card.querySelector("p.desc").innerText;
        const img = card.querySelector(".prod-img-wrap img").getAttribute("src");
        const priceText = card.querySelector(".price").innerText;
        const price = parseInt(priceText.replace(/[^0-9]/g, ""), 10);

        addToCart({ id, name, price, image: img, desc });
      });
    }
  });
});
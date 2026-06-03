//xử lý giỏ hàng
document.addEventListener("DOMContentLoaded", () => {
  //lấy các phần tử DOM 
  const tbody = document.getElementById("cart-tbody");
  const totalSpan = document.getElementById("cart-total-sum");
  const checkoutBtn = document.getElementById("place-order-btn");
  const couponInput = document.getElementById("coupon-code");
  const applyCouponBtn = document.getElementById("apply-coupon-btn");

  let discountPercentage = 0; //biến lưu phần trăm giảm giá

  //hiển thị giỏ hàng
  function renderCart() {
    const cart = getCart();
    tbody.innerHTML = "";

    //nếu giỏ hàng trống
    if (cart.length === 0) {
      tbody.innerHTML = `
            <tr>
              <td colspan="4" class="center" style="padding: 40px; font-size: 16px; color: #666; font-family: var(--font-family-poltawski-nowy);">
                Giỏ hàng của mèo đang trống! Hãy quay lại chọn sản phẩm nhé.
              </td>
            </tr>
          `;
      totalSpan.innerText = "Tổng: 0đ";
      checkoutBtn.disabled = true; //vô hiệu hóa nút đặt hàng
      checkoutBtn.style.opacity = "0.5";
      checkoutBtn.style.cursor = "not-allowed";
      return;
    }

    //nếu có sản phẩm -> kích hoạt nút đặt hàng
    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = "1";
    checkoutBtn.style.cursor = "pointer";

    let subtotal = 0;

    cart.forEach((item, index) => {
      subtotal += item.price * item.quantity; //cộng giá trị

      const tr = document.createElement("tr");
      tr.innerHTML = `
            <td>
              <div class="cart-product-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-product-info">
                  <h4>${item.name}</h4>
                  <p>${item.desc}</p>
                </div>
              </div>
            </td>
            <td class="center">
              <span class="cart-price">${formatCurrency(item.price)}</span>
            </td>
            <td class="center">
              <div class="quantity-selector">
                <button type="button" class="qty-btn minus" data-id="${item.id}">-</button>
                <input type="text" value="${item.quantity}" readonly>
                <button type="button" class="qty-btn plus" data-id="${item.id}">+</button>
              </div>
            </td>
            <td class="center">
              <div class="cart-actions">
                <img src="images/edit-property-466.png" alt="Edit" title="Sửa">
                <img src="images/delete-trash-465.png" alt="Delete" class="delete-btn" data-id="${item.id}" title="Xóa">
              </div>
            </td>
          `;
      tbody.appendChild(tr);
    });

    //tính toán tổng tiền sau khi giảm giá
    const discountAmount = subtotal * (discountPercentage / 100);
    const finalTotal = subtotal - discountAmount;

    totalSpan.innerText = `Tổng: ${formatCurrency(finalTotal)}` + (discountPercentage > 0 ? ` (Đã giảm ${discountPercentage}%)` : '');

    //gán lại các sự kiện cho các nút
    bindCartEvents();
  }

  //gán sự kiện cho các nút
  function bindCartEvents() {
    //tổng số lượng
    document.querySelectorAll(".qty-btn.plus").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const cart = getCart();
        const item = cart.find(i => i.id === id);
        if (item) {
          item.quantity += 1;
          saveCart(cart);
          renderCart();
        }
      });
    });

    //giảm số lượng 
    document.querySelectorAll(".qty-btn.minus").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const cart = getCart();
        const itemIndex = cart.findIndex(i => i.id === id);
        if (itemIndex > -1) {
          cart[itemIndex].quantity -= 1;
          if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
          }
          saveCart(cart);
          renderCart();
        }
      });
    });

    //nút xóa sản phẩm 
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        let cart = getCart();
        cart = cart.filter(i => i.id !== id);
        saveCart(cart);
        renderCart();
        showNotification("Đã xóa sản phẩm khỏi giỏ hàng.");
      });
    });
  }

  //mã giảm giá
  applyCouponBtn.addEventListener("click", () => {
    const code = couponInput.value.trim().toUpperCase();
    if (code === "MOONCAT20") {
      discountPercentage = 20;
      showNotification("Áp dụng mã MOONCAT20 thành công! Giảm 20% tổng đơn hàng.");
      renderCart();
    } else if (code === "FREESHIP") {
      showNotification("Áp dụng mã FREESHIP thành công! Miễn phí vận chuyển.");
    } else {
      showNotification("Mã giảm giá không hợp lệ!");
    }
  });

  //đặt hàng
  checkoutBtn.addEventListener("click", () => {
    const user = getSessionUser();
    if (!user) {
      showNotification("Vui lòng đăng nhập để tiến hành đặt hàng!");
      setTimeout(() => {
        window.location.href = "sign-in.html";
      }, 1000);
      return;
    }

    const cart = getCart();
    if (cart.length === 0) return;

    //tổng giá trị tạm tính - tổng cuối
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const finalTotal = subtotal * (1 - discountPercentage / 100);

    //tạo đối tượng đơn hàng - Create mock order
    const orders = JSON.parse(localStorage.getItem("tmc_orders")) || [];
    const nextId = "MC" + Math.floor(1000 + Math.random() * 9000);
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    const newOrder = {
      orderId: nextId,
      username: user.username,
      date: formattedDate,
      total: formatCurrency(finalTotal),
      status: "Đang xử lý"
    };

    //lưu đơn hàng
    orders.push(newOrder);
    localStorage.setItem("tmc_orders", JSON.stringify(orders));

    //xóa giỏ hàng
    localStorage.setItem("tmc_cart", JSON.stringify([]));
    updateCartUI();

    showNotification("Đặt hàng thành công! Đang chuyển hướng đến trang tài khoản...");
    setTimeout(() => {
      window.location.href = "account.html";
    }, 1200);
  });

  //hiển thị dữ liệu lên màn hình
  renderCart();
});
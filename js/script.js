//xử lý giao diện
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.navbar-collapse');
  //chức năng đóng/mở menu mobile
  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      // Toggle hiển thị
      if (navMenu.style.display === 'flex') {
        navMenu.style.display = 'none';
      } else {
        navMenu.style.display = 'flex';
      }
    });
  }
});


//cấu hình dữ liệu mẫu (MOCK DATA)
const DEFAULT_USERS = [
  {
    username: "admin",
    email: "admin@themooncat.com",
    phone: "0988 789 999",
    address: "180 Cao Lỗ, Phường Chánh Hưng, TP.HCM",
    password: "admin",
    rank: "ĐỒNG",
    spending: 10500000
  }
];

const DEFAULT_ORDERS = [
  {
    orderId: "MC1002",
    username: "admin",
    date: "20/05/2026",
    total: "3.890.000đ",
    status: "Đang xử lý"
  },
  {
    orderId: "MC1001",
    username: "admin",
    date: "15/05/2026",
    total: "6.610.000đ",
    status: "Đã hoàn thành"
  }
];

//quản lý dữ iệu với LOCALSTORAGE
//kiểm tra và tạo dữ liệu mặc định vào localstorage nếu chưa tồn tại
function initDatabase() {
  if (!localStorage.getItem("tmc_users")) {
    localStorage.setItem("tmc_users", JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem("tmc_orders")) {
    localStorage.setItem("tmc_orders", JSON.stringify(DEFAULT_ORDERS));
  }
  if (!localStorage.getItem("tmc_cart")) {
    localStorage.setItem("tmc_cart", JSON.stringify([]));
  }
}

//lấy thông tin người dùng đang đăng nhập từ sesion
function getSessionUser() {
  const session = localStorage.getItem("tmc_session");
  return session ? JSON.parse(session) : null;
}

//lưu thông tin người dùng khi đăng nhập thành công
function setSessionUser(user) {
  localStorage.setItem("tmc_session", JSON.stringify(user));
}

//xóa thông tin đăng nhập và quay về trang chủ 
function logoutUser() {
  localStorage.removeItem("tmc_session");
  window.location.href = "index.html";
}

//Xử lý giỏ hàng
//lấy danh sách sản phẩm trong giỏ hàng
function getCart() {
  return JSON.parse(localStorage.getItem("tmc_cart")) || []; //chuyển từ chuỗi JSON về mảng
}

//lưu giỏ hàng và gọi hàm cập nhật icon hiển thị
function saveCart(cart) {
  localStorage.setItem("tmc_cart", JSON.stringify(cart));
  updateCartUI();
}

//thêm sản phẩm vào giỏ hàng
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      desc: product.desc
    });
  }

  saveCart(cart);

  //hiển thị thông báo đã thêm sản phẩm vào giỏ hàng
  showNotification(`Đã thêm "${product.name}" vào giỏ hàng!`);
}

//hiển thị thông báo trên màn hình
function showNotification(message) {
  const container = document.getElementById("toast-container") || createToastContainer();
  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.innerText = message;

  container.appendChild(toast);

  //hiệu ứng trượt vào của thông báo
  setTimeout(() => toast.classList.add("show"), 10);

  //tự động xóa hiệu ứng sau 3s
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

//tạo khung chứa các thông báo nếu chưa có trên DOM
function createToastContainer() {
  const container = document.createElement("div");
  container.id = "toast-container";
  container.style.position = "fixed";
  container.style.bottom = "20px";
  container.style.right = "20px";
  container.style.zIndex = "9999";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "10px";
  document.body.appendChild(container);
  return container;
}

//cập nhật số lượng hiển thị trên icon giỏ hàng
function updateCartUI() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartLink = document.getElementById("cart-link");
  if (cartLink) {
    let badge = cartLink.querySelector(".cart-badge");
    if (!badge && totalItems > 0) { //tạo badge nếu chưa có và giỏ hàng có sản phẩm
      const iconWrap = cartLink.querySelector(".cart-icon-wrap");
      badge = document.createElement("span");
      badge.className = "cart-badge";
      iconWrap.appendChild(badge);
    }

    if (badge) {
      if (totalItems > 0) {
        badge.innerText = totalItems;
        badge.style.display = "flex";
      } else {
        badge.style.display = "none";
      }
    }
  }
}

//thay đổi thông tin hiển thị trên header -> người dùng đăng nhập
function updateHeaderProfile() {
  const user = getSessionUser();
  const accountLink = document.getElementById("account-link");

  if (accountLink && user) {
    const actionText = accountLink.querySelector(".action-text");
    if (actionText) {
      actionText.innerHTML = `
        <span class="sub-text">Chào, ${user.username}</span>
        <span class="main-text">Tài khoản của tôi</span>
      `;
    }
    //trỏ đến trang tài khoản
    accountLink.href = "account.html";
  }
}

//định dạng tiền
function formatCurrency(number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(number)
    .replace('₫', 'đ');
}

//khởi chạy hệ thống
document.addEventListener("DOMContentLoaded", () => {
  initDatabase();
  updateHeaderProfile();
  updateCartUI();

  //tự động chèn css cho thông báo và badge 
  const style = document.createElement("style");
  style.textContent = `
    .toast-message {
      background-color: #353f5a;
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(0,0,0,0.25);
      border: 1px solid rgba(255,255,255,0.1);
      transform: translateX(120%);
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s;
      opacity: 0;
    }
    .toast-message.show {
      transform: translateX(0);
      opacity: 1;
    }
    .cart-badge {
      position: absolute;
      top: -5px;
      right: -8px;
      background-color: #ff3b30;
      color: #ffffff;
      font-size: 11px;
      font-weight: bold;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
  `;
  document.head.appendChild(style);
});
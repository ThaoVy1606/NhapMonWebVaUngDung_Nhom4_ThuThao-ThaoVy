document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.navbar-collapse');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            // Toggle hiển thị
            if (navMenu.style.display === 'flex') {
                navMenu.style.display = 'none';
            } else {
                navMenu.style.display = 'flex';
            }
        });
    }
});


// Default mock database structure
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

// Initialize database
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

// Get current session user
function getSessionUser() {
  const session = localStorage.getItem("tmc_session");
  return session ? JSON.parse(session) : null;
}

// Set active session user
function setSessionUser(user) {
  localStorage.setItem("tmc_session", JSON.stringify(user));
}

// Remove session (Logout)
function logoutUser() {
  localStorage.removeItem("tmc_session");
  window.location.href = "index.html";
}

// Get cart items
function getCart() {
  return JSON.parse(localStorage.getItem("tmc_cart")) || [];
}

// Save cart items
function saveCart(cart) {
  localStorage.setItem("tmc_cart", JSON.stringify(cart));
  updateCartUI();
}

// Add item to cart
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
  
  // Visual micro-feedback notification
  showNotification(`Đã thêm "${product.name}" vào giỏ hàng!`);
}

// Helper to show modal/alert toast notification
function showNotification(message) {
  const container = document.getElementById("toast-container") || createToastContainer();
  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.innerText = message;
  
  container.appendChild(toast);
  
  // Trigger slide-in animation
  setTimeout(() => toast.classList.add("show"), 10);
  
  // Fade out and remove
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

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

// Update Cart Badge and Header Texts dynamically
function updateCartUI() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const cartLink = document.getElementById("cart-link");
  if (cartLink) {
    let badge = cartLink.querySelector(".cart-badge");
    if (!badge && totalItems > 0) {
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

// Update Header User Profile state
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
    // Also point the href directly to account dashboard
    accountLink.href = "account.html";
  }
}

// Format currency
function formatCurrency(number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(number)
    .replace('₫', 'đ');
}

// Bind load event
document.addEventListener("DOMContentLoaded", () => {
  initDatabase();
  updateHeaderProfile();
  updateCartUI();

  // Add notification container styles dynamically to page
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

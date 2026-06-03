//xử lý trang tài khoản
document.addEventListener("DOMContentLoaded", () => {
    //kiểm tra đăng nhập
    const user = getSessionUser();
    if (!user) {
        window.location.href = "sign-in.html";
        return;
    }

    //gán thông tin cá nhân
    document.getElementById("profile-phone").value = user.phone;
    document.getElementById("profile-email").value = user.email;
    document.getElementById("profile-address").value = user.address;

    //hiển thị tên người dùng trên header
    const usernameHeader = document.querySelector(".account-username");
    if (usernameHeader) {
        usernameHeader.innerText = user.username;
    }

    //hiển thị hạng thành viên và tổng chi tiêu
    const rankVal = document.querySelector(".rank-box .value");
    const spendVal = document.querySelector(".spend-box .value");
    if (rankVal) rankVal.innerText = user.rank;
    if (spendVal) spendVal.innerText = formatCurrency(user.spending);

    //xử lý hồ sơ
    document.querySelectorAll(".account-field").forEach(field => {
        const editIcon = field.querySelector(".edit-icon");
        const input = field.querySelector("input");

        if (editIcon && input) {
            editIcon.addEventListener("click", () => {
                if (input.hasAttribute("readonly")) {
                    //chuyển sang chế độ chỉnh sửa
                    input.removeAttribute("readonly");
                    input.focus();
                    //đổi màu icon để thông báo đang chế độ sửa
                    editIcon.style.filter = "invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)";
                } else {
                    //lưu thay đổi
                    input.setAttribute("readonly", true);
                    editIcon.style.filter = "none";

                    //cập nhật dữ liệu vào user
                    const fieldType = input.getAttribute("id");
                    if (fieldType === "profile-phone") user.phone = input.value;
                    if (fieldType === "profile-email") user.email = input.value;
                    if (fieldType === "profile-address") user.address = input.value;

                    //lưu vào danh sách người dùng 
                    setSessionUser(user);
                    const users = JSON.parse(localStorage.getItem("tmc_users")) || [];
                    const userIdx = users.findIndex(u => u.username === user.username);
                    if (userIdx > -1) {
                        users[userIdx] = user;
                        localStorage.setItem("tmc_users", JSON.stringify(users));
                    }

                    showNotification("Cập nhật hồ sơ thành công!");
                }
            });

            //lưu bằng phím enter
            input.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    editIcon.click();
                }
            });
        }
    });

    //hiển thị danh sách đơn hàng 
    const ordersTbody = document.getElementById("orders-tbody");
    if (ordersTbody) {
        const orders = JSON.parse(localStorage.getItem("tmc_orders")) || [];
        const userOrders = orders.filter(o => o.username === user.username);

        if (userOrders.length === 0) {
            ordersTbody.innerHTML = `
            <tr>
              <td colspan="5" class="center" style="padding: 20px; color: #666; font-family: var(--font-family-poltawski-nowy);">
                Chưa có đơn hàng nào được đặt.
              </td>
            </tr>
          `;
        } else {
            ordersTbody.innerHTML = "";
            //hiển thị đơn hàng mới nhất lên đầu 
            userOrders.reverse().forEach(o => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
              <td>#${o.orderId}</td>
              <td>${o.date}</td>
              <td>${o.total}</td>
              <td style="color: ${o.status === 'Đã hoàn thành' ? 'green' : 'orange'}; font-weight: bold;">
                ${o.status}
              </td>
              <td><a href="#" class="details-link" onclick="event.preventDefault(); showNotification('Chi tiết đơn hàng đang được cập nhật...');">Xem</a></td>
            `;
                ordersTbody.appendChild(tr);
            });
        }
    }

    //xử lý đăng xuất
    const logoutLink = document.getElementById("logout-link");
    if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            logoutUser();
        });
    }
});
//xử lý đăng nhập
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const errorDiv = document.getElementById("login-error");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        errorDiv.style.display = "none";

        const userInput = document.getElementById("login-user").value.trim();
        const passInput = document.getElementById("login-pass").value;

        //lấy danh sách người dùng, nếu chưa có thì dùng mặc định
        const users = JSON.parse(localStorage.getItem("tmc_users")) || DEFAULT_USERS;

        //xác thực -> có trùng khớp vs user trong danh sách người dùng không
        const user = users.find(u =>
            (u.username === userInput || u.email === userInput) &&
            u.password === passInput
        );

        if (user) {
            //lưu thông tin người dùng
            setSessionUser(user);

            //hiển thị thông báo thành công 
            showNotification(`Đăng nhập thành công! Chào mừng ${user.username}.`);
            setTimeout(() => {
                window.location.href = "index.html"; //về trang chủ
            }, 800);
        } else {
            //hiển thị thông báo lỗi -> user không trùng khớp
            errorDiv.innerText = "Sai tài khoản hoặc mật khẩu!";
            errorDiv.style.display = "block";
        }
    });
});
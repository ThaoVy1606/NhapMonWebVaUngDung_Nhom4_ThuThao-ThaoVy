//xử lý đăng ký tài khoản
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const errorDiv = document.getElementById("register-error");

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    errorDiv.style.display = "none";

    const userInput = document.getElementById("register-user").value.trim();
    const contactInput = document.getElementById("register-contact").value.trim();
    const passInput = document.getElementById("register-pass").value;
    const confirmInput = document.getElementById("register-confirm").value;

    //kiểm tra mật khẩu nhập lại có trung khớp không
    if (passInput !== confirmInput) {
      errorDiv.innerText = "Mật khẩu xác nhận không trùng khớp!";
      errorDiv.style.display = "block";
      return;
    }

    //kiểm tra độ dài tên đăng nhập
    if (userInput.length < 3) {
      errorDiv.innerText = "Tên đăng nhập phải chứa ít nhất 3 ký tự!";
      errorDiv.style.display = "block";
      return;
    }

    //lấy danh sách người dùng
    const users = JSON.parse(localStorage.getItem("tmc_users")) || DEFAULT_USERS;

    //kiểm tra người dùng đã tồn tại chưa
    const exists = users.some(u => u.username === userInput || u.email === contactInput || u.phone === contactInput);
    if (exists) {
      errorDiv.innerText = "Tên đăng nhập hoặc Email/Số điện thoại đã tồn tại!";
      errorDiv.style.display = "block";
      return;
    }

    //tạo user mới
    const isEmail = contactInput.includes("@");
    const newUser = {
      username: userInput,
      email: isEmail ? contactInput : `${userInput}@themooncat.com`,
      phone: isEmail ? "Chưa cập nhật" : contactInput,
      address: "Chưa cập nhật",
      password: passInput,
      rank: "ĐỒNG", //rank mặc định cho ng mới và chi tiêu = 0
      spending: 0
    };

    //lưu user mới vào danh sách
    users.push(newUser);
    localStorage.setItem("tmc_users", JSON.stringify(users));

    //tự động đăng nhập sau khi đăng ký thành công 
    setSessionUser(newUser);

    //phản hồi người dùng
    showNotification("Đăng ký tài khoản thành công! Đang đăng nhập...");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);
  });
});
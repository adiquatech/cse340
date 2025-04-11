document.addEventListener("DOMContentLoaded", function () {
    // Account Update Form Validation
    const accountUpdateForm = document.getElementById("accountUpdateForm");
    if (accountUpdateForm) {
      accountUpdateForm.addEventListener("submit", function (event) {
        const firstName = document.getElementById("account_firstname").value.trim();
        const lastName = document.getElementById("account_lastname").value.trim();
        const email = document.getElementById("account_email").value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
        if (!firstName) {
          alert("First name is required.");
          event.preventDefault();
          return;
        }
        if (!lastName) {
          alert("Last name is required.");
          event.preventDefault();
          return;
        }
        if (!email || !emailRegex.test(email)) {
          alert("A valid email is required.");
          event.preventDefault();
          return;
        }
      });
    }
  
    // Change Password Form Validation
    const changePasswordForm = document.getElementById("changePasswordForm");
    if (changePasswordForm) {
      changePasswordForm.addEventListener("submit", function (event) {
        const password = document.getElementById("account_password").value;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,}$/;
  
        if (!passwordRegex.test(password)) {
          alert(
            "Password must be at least 12 characters long, include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
          );
          event.preventDefault();
          return;
        }
      });
    }
  
    // Toggle Password Visibility
    const togglePassword = document.querySelector(".toggle-password");
    if (togglePassword) {
      togglePassword.addEventListener("click", function () {
        const passwordInput = document.getElementById("account_password");
        if (passwordInput.type === "password") {
          passwordInput.type = "text";
          togglePassword.textContent = "Hide Password";
        } else {
          passwordInput.type = "password";
          togglePassword.textContent = "Show Password";
        }
      });
    }
  });
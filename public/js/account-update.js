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

  // Toggle Password Visibility for all .toggle-password buttons
  const toggleButtons = document.querySelectorAll(".toggle-password");
  if (toggleButtons.length > 0) {
    toggleButtons.forEach((button, index) => {
      button.addEventListener("click", function () {
        // Find the closest form and get the password input within it
        const form = button.closest("form");
        if (!form) {
          console.error(`Toggle button ${index} is not inside a form element.`, button);
          return;
        }

        const passwordInput = form.querySelector("#account_password");
        if (passwordInput) {
          const isPasswordVisible = passwordInput.type === "password";
          passwordInput.type = isPasswordVisible ? "text" : "password";
          button.textContent = isPasswordVisible ? "Hide Password" : "Show Password";
        } else {
          console.error(`Password input (#account_password) not found in form for toggle button ${index}.`, form);
        }
      });
    });
  } else {
    console.log("No toggle-password buttons found on this page.");
  }
});
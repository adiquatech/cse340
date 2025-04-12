//Regstration toggle passowrd script
function togglePassword() {
    const passwordField = document.getElementById("account_password");
    const toggleButton = document.querySelector(".toggle-password");
    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleButton.textContent = "Hide Password";
    } else {
        passwordField.type = "password";
        toggleButton.textContent = "Show Password";
    }
};
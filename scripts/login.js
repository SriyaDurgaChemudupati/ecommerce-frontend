const togglePassword =
    document.getElementById("toggle-login-password");

const passwordInput =
    document.getElementById("login-password");

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }

});

document
    .getElementById("login-form")
    .addEventListener("submit", (e) => {

        e.preventDefault();

        const email =
            document.getElementById("login-email").value;

        const password =
            document.getElementById("login-password").value;

        const user =
            JSON.parse(localStorage.getItem("user"));

        if (
            user &&
            user.email === email &&
            user.password === password
        ) {

            alert("Login Successful!");

            window.location.href = "index.html";

        } else {

            alert("Invalid Email or Password");

        }

    });
    const savedEmail =
    localStorage.getItem("userEmail");

const savedPassword =
    localStorage.getItem("userPassword");

if (
    email === savedEmail &&
    password === savedPassword
) {

    alert("Login Successful!");

    window.location.href = "index.html";

} else {

    alert("Invalid Email or Password");
}
if (password.value !== confirmPassword.value) {

    matchError.textContent =
        "Passwords do not match";

    return;
}
const passwordInput =
    document.getElementById("password");

const strengthText =
    document.getElementById("password-strength");

passwordInput.addEventListener("input", () => {

    const password = passwordInput.value;

    const strongRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (strongRegex.test(password)) {

        strengthText.textContent =
            "Strong Password ✅";

        strengthText.style.color =
            "green";

    } else {

        strengthText.textContent =
            "Password must contain 8+ characters, uppercase, lowercase and number";

        strengthText.style.color =
            "red";

    }

});

document
    .getElementById("signup-form")
    .addEventListener("submit", (e) => {

        e.preventDefault();

        const name =
            document.getElementById("name").value;

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirm-password").value;

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!emailRegex.test(email)) {

            alert("Invalid Email");

            return;
        }

        if (!passwordRegex.test(password)) {

            alert("Weak Password");

            return;
        }

        if (password !== confirmPassword) {

            alert("Passwords do not match");

            return;
        }

        const user = {
            name,
            email,
            password
        };

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        alert("Account Created Successfully!");

        window.location.href =
            "login.html";

    });
    localStorage.setItem(
    "userEmail",
    email
);

localStorage.setItem(
    "userPassword",
    password
);
const password =
    document.getElementById("password");

const confirmPassword =
    document.getElementById("confirm-password");

const matchError =
    document.getElementById("match-error");

confirmPassword.addEventListener("input", () => {

    if (
        confirmPassword.value !== password.value
    ) {

        matchError.textContent =
            "Passwords do not match";

    } else {

        matchError.textContent = "";

    }

});
if (password.value !== confirmPassword.value) {

    matchError.textContent =
        "Passwords do not match";

    return;
}
import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

console.log("SIGNUP JS LOADED");

const passwordInput = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const strengthText = document.getElementById("password-strength");
const matchError = document.getElementById("match-error");

// Password Strength Live UI updates
passwordInput.addEventListener("input", () => {
    const password = passwordInput.value;
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (strongRegex.test(password)) {
        strengthText.textContent = "Strong Password ✅";
        strengthText.style.color = "green";
    } else {
        strengthText.textContent = "Password must contain 8+ characters, uppercase, lowercase and number";
        strengthText.style.color = "red";
    }
});

// Password Match Live UI updates
confirmPassword.addEventListener("input", () => {
    if (confirmPassword.value !== passwordInput.value) {
        matchError.textContent = "Passwords do not match ❌";
        matchError.style.color = "red";
    } else {
        matchError.textContent = "Passwords match ✅";
        matchError.style.color = "green";
    }
});

// Signup Form Event Handler
document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = passwordInput.value;
    const confirm = confirmPassword.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    // Pre-flight Client Validations
    if (!emailRegex.test(email)) {
        alert("Invalid Email Format");
        return;
    }

    if (!passwordRegex.test(password)) {
        alert("Weak Password. Must contain 8+ characters, uppercase, lowercase, and numbers.");
        return;
    }

    if (password !== confirm) {
        alert("Passwords do not match");
        return;
    }

    // Submit credentials to Firebase
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        
        // Cache display name locally for personalization on index.html
        localStorage.setItem("userName", name);

        alert("Account Created Successfully 🎉");
        window.location.href = "login.html";
    } catch (error) {
        console.error("Signup error details:", error.code, error.message);
        if (error.code === 'auth/email-already-in-use') {
            alert("This email is already in use. Please log in instead.");
        } else {
            alert(`Registration Failed: ${error.message}`);
        }
    }
});
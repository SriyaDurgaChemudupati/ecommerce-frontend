import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email =
    document.getElementById("login-email").value;

  const password =
    document.getElementById("login-password").value;

  const errorEl =
    document.getElementById("login-error");

  errorEl.textContent = "";

  try {
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    window.location.href = "index.html";

  } catch (error) {
    errorEl.textContent = error.message;
  }
});
const emailInput = document.getElementById("login-email");
const passwordInput = document.getElementById("login-password");

const emailMsg = document.getElementById("login-email-msg");
const passwordMsg = document.getElementById("login-password-msg");

emailInput.addEventListener("input", () => {
    const valid =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);

    emailMsg.textContent =
        valid ? "✓ Valid Email" : "Enter valid email";

    emailMsg.style.color =
        valid ? "green" : "red";
});

passwordInput.addEventListener("input", () => {
    const valid =
        passwordInput.value.length >= 6;

    passwordMsg.textContent =
        valid
            ? "✓ Password looks good"
            : "Minimum 6 characters";

    passwordMsg.style.color =
        valid ? "green" : "red";
});
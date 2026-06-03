import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const passwordInput = document.getElementById("signup-password");
const confirmInput = document.getElementById("signup-confirm-password");

const ruleLength = document.getElementById("rule-length");
const ruleLower = document.getElementById("rule-lower");
const ruleUpper = document.getElementById("rule-upper");
const ruleNumber = document.getElementById("rule-number");
const ruleSpecial = document.getElementById("rule-special");
const ruleSpace = document.getElementById("rule-space");

const strengthBar = document.getElementById("password-strength-bar");
const confirmMsg = document.getElementById("confirm-msg");

function updateRule(element, valid) {
    element.style.color = valid ? "green" : "red";
    element.style.fontWeight = valid ? "600" : "400";
}

passwordInput.addEventListener("input", () => {

    const password = passwordInput.value;

    const lengthOk = password.length >= 8;
    const lowerOk = /[a-z]/.test(password);
    const upperOk = /[A-Z]/.test(password);
    const numberOk = /\d/.test(password);
    const specialOk = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const noSpaceOk = !/\s/.test(password);

    updateRule(ruleLength, lengthOk);
    updateRule(ruleLower, lowerOk);
    updateRule(ruleUpper, upperOk);
    updateRule(ruleNumber, numberOk);
    updateRule(ruleSpecial, specialOk);
    updateRule(ruleSpace, noSpaceOk);

    let score = 0;

    if (lengthOk) score++;
    if (lowerOk) score++;
    if (upperOk) score++;
    if (numberOk) score++;
    if (specialOk) score++;
    if (noSpaceOk) score++;

    strengthBar.style.width = `${(score / 6) * 100}%`;

    if (score <= 2) {
        strengthBar.style.background = "#ef4444";
    } else if (score <= 4) {
        strengthBar.style.background = "#f59e0b";
    } else {
        strengthBar.style.background = "#22c55e";
    }
});

confirmInput.addEventListener("input", () => {

    if (
        confirmInput.value === passwordInput.value &&
        confirmInput.value !== ""
    ) {
        confirmMsg.textContent = "✓ Passwords match";
        confirmMsg.style.color = "green";
    } else {
        confirmMsg.textContent = "Passwords do not match";
        confirmMsg.style.color = "red";
    }

});
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  errorEl.textContent = "";

  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm-password").value;

  if (password !== confirmPassword) {
    errorEl.textContent = "Passwords do not match";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(userCredential.user, {
      displayName: name
    });

    await userCredential.user.reload();

    alert("Signup successful!");

    window.location.href = "index.html";

  } catch (error) {
    errorEl.textContent = error.message;
  }
});
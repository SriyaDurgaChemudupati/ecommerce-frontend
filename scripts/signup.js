import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ---------------- DOM ELEMENTS ----------------
const form = document.getElementById("signup-form");
const errorEl = document.getElementById("signup-error");

const nameInput = document.getElementById("signup-name");
const emailInput = document.getElementById("signup-email");
const passwordInput = document.getElementById("signup-password");
const confirmInput = document.getElementById("signup-confirm-password");

const confirmMsg = document.getElementById("confirm-msg");

// ---------------- RULE ELEMENTS ----------------
const ruleLength = document.getElementById("rule-length");
const ruleLower = document.getElementById("rule-lower");
const ruleUpper = document.getElementById("rule-upper");
const ruleNumber = document.getElementById("rule-number");
const ruleSpecial = document.getElementById("rule-special");
const ruleSpace = document.getElementById("rule-space");

// ---------------- RULE FUNCTION ----------------
function updateRule(element, valid) {
  element.style.color = valid ? "green" : "red";
  element.style.fontWeight = valid ? "600" : "400";
}

// ---------------- PASSWORD RULE CHECK (LIVE) ----------------
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
});

// ---------------- PASSWORD MATCH ----------------
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

// ---------------- SIGNUP ----------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  errorEl.textContent = "";

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmInput.value;

  if (!name || !email || !password || !confirmPassword) {
    errorEl.textContent = "Please fill all fields";
    return;
  }

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

    alert("Signup successful!");

    window.location.href = "index.html";

  } catch (error) {
    console.log(error.code, error.message);
    errorEl.textContent = error.message;
  }
});
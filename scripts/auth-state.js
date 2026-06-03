import { auth } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const authContainer = document.getElementById("auth-nav-container");

onAuthStateChanged(auth, (user) => {

  if (user) {

    const userName =
      user.displayName ||
      user.email.split("@")[0];

    authContainer.innerHTML = `
      <span class="welcome-user">Hello, ${userName}</span>
      <a href="#" id="logout-btn" class="auth-link">Logout</a>
    `;

    document
      .getElementById("logout-btn")
      .addEventListener("click", async (e) => {

        e.preventDefault();

        await signOut(auth);

        window.location.href = "index.html";
      });

  } else {

    authContainer.innerHTML = `
      <a href="login.html" class="auth-link">Login</a>
      <a href="signup.html" class="auth-link">Signup</a>
    `;
  }
});
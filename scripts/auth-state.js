import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const authContainer =
    document.getElementById("auth-nav-container");

onAuthStateChanged(auth, (user) => {

    if (user) {

        const userName =
            localStorage.getItem("userName") ||
            user.displayName ||
            user.email.split("@")[0];

        authContainer.innerHTML = `
            <span class="welcome-user">
                Hey, ${userName} 👋
            </span>

            <a href="#" id="logout-btn">
                Logout
            </a>
        `;

        document
            .getElementById("logout-btn")
            .addEventListener("click", async (e) => {

                e.preventDefault();

                await signOut(auth);

                localStorage.removeItem("userName");

                window.location.reload();
            });

    } else {

        authContainer.innerHTML = `
            <a href="login.html">Login</a>
            <a href="signup.html">Signup</a>
        `;
    }
});
import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

console.log("STOREFRONT AUTH TRACKER ACTIVE");

const authContainer = document.getElementById("auth-nav-container");

// Continuously listen to Firebase state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in -> Update navbar with Greeting and Logout button
        const savedName = localStorage.getItem("userName") || user.email.split('@')[0];
        
        // CHANGED: inline style color altered to #fff (white) for perfect readability
        authContainer.innerHTML = `
            <li style="color: #fff; font-weight: 500;">Hi, ${savedName} 👋</li>
            <li><a href="#" id="logout-btn" style="color: #ff4d4d; font-weight: bold;">Logout</a></li>
        `;

        // Attach action listener safely to the freshly updated logout element
        document.getElementById("logout-btn").addEventListener("click", async (e) => {
            e.preventDefault();
            try {
                await signOut(auth);
                localStorage.removeItem("userName");
                alert("Logged out securely. Come back soon! 👋");
                window.location.reload(); // Hard reloads updates back to initial Login/Signup links
            } catch (error) {
                console.error("Signout Failure:", error);
            }
        });
    } else {
        // No active account session -> Restore basic links
        authContainer.innerHTML = `
            <li><a href="login.html" id="login-link">Login</a></li>
            <li><a href="signup.html" id="signup-link">Signup</a></li>
        `;
    }
});
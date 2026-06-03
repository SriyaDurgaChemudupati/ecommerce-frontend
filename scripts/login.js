import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

console.log("LOGIN JS LOADED");

// Login Form Event Handler
document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Send sign-in payload to Firebase
    try {
        await signInWithEmailAndPassword(auth, email, password);

        alert("Login Successful 🎉");
        window.location.href = "index.html";
    } catch (error) {
        console.error("Login error details:", error.code, error.message);
        
        // Generic catch handling for invalid setups or missing matching users
        if (
            error.code === 'auth/invalid-credential' || 
            error.code === 'auth/user-not-found' || 
            error.code === 'auth/wrong-password'
        ) {
            alert("Invalid Email or Password ❌");
        } else {
            alert(`Authentication Error: ${error.message}`);
        }
    }
});
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0TlXlz41Me-qmOGWTEEhq3J9FJ4FKUL0",
  authDomain: "shopeasy-b71bf.firebaseapp.com",
  projectId: "shopeasy-b71bf",
  storageBucket: "shopeasy-b71bf.firebasestorage.app",
  messagingSenderId: "321540243849",
  appId: "1:321540243849:web:5b3adfc2a47aa810022158"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Authentication service
export const auth = getAuth(app);
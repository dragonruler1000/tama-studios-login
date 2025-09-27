// Firebase imports (v9+ modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
await setPersistence(auth, browserLocalPersistence);

// DOM elements
const loginForm = document.getElementById("loginForm");
const googleLogin = document.getElementById("googleLogin");
const toggleRegister = document.getElementById("toggleRegister");
const message = document.getElementById("message");

// Track register mode
let isRegistering = false;
toggleRegister.addEventListener("click", (e) => {
  e.preventDefault();
  isRegistering = !isRegistering;
  loginForm.querySelector("button").innerText = isRegistering ? "Register" : "Login";
  toggleRegister.innerText = isRegistering ? "Already have an account? Login" : "Don’t have an account? Register";
});

// Show message helper
function showMessage(text, type="error") {
  message.innerText = text;
  message.className = `mt-4 text-center text-sm ${type === "error" ? "text-red-600" : "text-green-600"}`;
}

// Handle login/register
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    if (isRegistering) {
      await createUserWithEmailAndPassword(auth, email, password);
      showMessage("✅ Account created!", "success");
    } else {
      await signInWithEmailAndPassword(auth, email, password);
      showMessage("✅ Logged in!", "success");
    }
  } catch (err) {
    showMessage(err.message);
  }
});

// Handle Google login
googleLogin.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    showMessage("✅ Logged in with Google!", "success");
  } catch (err) {
    showMessage(err.message);
  }
});

// Track login state
onAuthStateChanged(auth, (user) => {
  if (user) {
    showMessage(`👋 Hello, ${user.email}`, "success");
    // Example: redirect to dashboard.html
    // window.location.href = "/dashboard.html";
  } else {
    console.log("No user logged in");
  }
});

// Optional logout (add button in your UI if needed)
window.logout = async () => {
  await signOut(auth);
  showMessage("👋 Logged out", "success");
};

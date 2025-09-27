import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const googleLogin = document.getElementById("googleLogin");
  const toggleRegister = document.getElementById("toggleRegister");
  const message = document.getElementById("message");

  let isRegistering = false;

  toggleRegister.addEventListener("click", (e) => {
    e.preventDefault();
    isRegistering = !isRegistering;
    loginForm.querySelector("button").innerText = isRegistering ? "Register" : "Login";
    toggleRegister.innerText = isRegistering ? "Already have an account? Login" : "Don’t have an account? Register";
  });

  function showMessage(text, type="error") {
    message.innerText = text;
    message.className = `message ${type}`;
  }

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
      showMessage(err.message, "error");
    }
  });

  googleLogin.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      showMessage("✅ Logged in with Google!", "success");
    } catch (err) {
      showMessage(err.message, "error");
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      showMessage(`👋 Hello, ${user.email}`, "success");
      // redirect if desired:
       window.location.href = "dashboard.html";
    }
  });
});

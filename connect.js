import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
    import {
      getAuth,
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword
    } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
    import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

    const firebaseConfig = {
      databaseURL: "https://cursa-academia-default-rtdb.asia-southeast1.firebasedatabase.app/",
      apiKey: "AIzaSyCKfjWixcRQQsJSfEpy6j8iHCCgw5A2Pbs",
      authDomain: "cursa-academia.firebaseapp.com",
      projectId: "cursa-academia",
      storageBucket: "cursa-academia.firebasestorage.app",
      messagingSenderId: "934135588662",
      appId: "1:934135588662:web:04780bc2176cbd2d82f597"
  };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    // Connexion (corrigé : bons IDs)
    document.getElementById("login-btn").addEventListener("click", () => {
      const email = document.getElementById("email").value.trim(); 
      const password = document.getElementById("password").value.trim(); 
      const message = document.getElementById("message");

      if (!email || !password) {
        message.textContent = "Veuillez remplir tous les champs.";
        return;
      }

      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          message.style.color = "green";
          message.textContent = "Connexion réussie. Redirection...";
          setTimeout(() => {
            window.location.href = "course.html"; // Redirection
          }, 1500);
        })
        .catch(error => {
          message.style.color = "red";
          if (error.code === 'auth/invalid-credential') {
            message.textContent = "Email ou mot de passe incorrect.";
          }
          else if (error.code === 'auth/user-not-found') {
            message.textContent = "Aucun utilisateur trouvé avec cet email.";
          } else {
            message.textContent = "Erreur de connexion : " + error.message;
          }
        });
    });

    
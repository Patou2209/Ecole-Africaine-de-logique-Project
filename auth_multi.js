import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
    import {
      getAuth,
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword
    } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
    import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

   const appSettings = {
    databaseURL: "https://ecole-africaine-default-rtdb.asia-southeast1.firebasedatabase.app/",
    apiKey: "AIzaSyBpBDRdbCzQ6KWFkFO2UK8K_rbTbHHCwF0",
    authDomain: "ecole-africaine.firebaseapp.com",
    projectId: "ecole-africaine",
    storageBucket: "ecole-africaine.firebasestorage.app",
    messagingSenderId: "740167043479",
    appId: "1:740167043479:web:78a965e3f34f44920a1cd2"

  };

    const app = initializeApp(appSettings);
    const auth = getAuth(app);

    // Inscription
    document.getElementById("signup-btn").addEventListener("click", () => {
      const email = document.getElementById("signup-email").value.trim();
      const password = document.getElementById("signup-password").value.trim();
      const number = document.getElementById("signup-num").value.trim();
      const message = document.getElementById("signup-message");


      if (!email || !password || !number) {
        message.textContent = "Veuillez remplir tous les champs.";
        return;
      }
      

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
      message.textContent = "Adresse email invalide.";
      return;
    }


      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const db = getDatabase();
          set(ref(db, 'users/' + user.uid), {
            email: email,
            number: number
          });
          message.style.color = "green";
          message.textContent = "Inscription réussie. Vous pouvez vous connecter.";
          window.location.href = "connexion.html"; // Redirection vers la page de connexion
        })
        .catch(error => {
          message.style.color = "red";
          if (error.code === 'auth/email-already-in-use') {
            message.textContent = "Cette adresse email est déjà utilisée.";
          } else {
            message.textContent = "Erreur : " + error.message;
          }
        });
    });



    
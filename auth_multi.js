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



    
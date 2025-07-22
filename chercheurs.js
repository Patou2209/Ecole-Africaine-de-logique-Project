import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, update, get, child } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";


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
const database = getDatabase(app);
const adsRef = ref(database, "che");
const auth = getAuth(app);



const adForm = document.getElementById("chercheur_form");

  adForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("chercheur-name").value;
    const field = document.getElementById("chercheur-field").value;
    const imageInput = document.getElementById("chercheur-image").files[0];
    const description = document.getElementById("chercheur-description").value;

    const userId = auth.currentUser.uid;
    const dbRef = ref(getDatabase());
    const userSnap = await get(child(dbRef, `users/${userId}`));
    //let number = "";
    //if (userSnap.exists()) {
    //  number = userSnap.val().number || "";
    //}

    const saveAd = async (imageData) => {
      const ad = {
        name,
        field,
        image: imageData,
        description,
        userEmail: user.email,
        createdAt: Date.now(),
      };

      // Validate form fields
      if (!name || !field || !imageInput || !description) {
        alert("Remplissez toutes les cases Svp!.");
        return;
      } 

      if (editingAdId) {
        await update(ref(database, `che/${editingAdId}`), ad);
        editingAdId = null;
      } else {
        await push(adsRef, ad);
      }

      adForm.reset();
      displayAds();
    };

    if (imageInput) {
      const reader = new FileReader();
      reader.onload = () => saveAd(reader.result);
      reader.readAsDataURL(imageInput);
    } else {
      saveAd();
    }
    console.log("Ad saved successfully");
  });

  function displayAds() {
    const adsContainer = document.getElementById("chercheur-container");
    adsContainer.innerHTML = "";

    onValue(adsRef, (snapshot) => {
      adsContainer.innerHTML = "";
      snapshot.forEach(childSnap => {
        const ad = childSnap.val();
        const adId = childSnap.key;
        if (ad.userEmail === user.email) {
          const adBox = document.createElement("div");
          adBox.classList.add("profil");
          adBox.innerHTML = `
            <img src="${ad.image}" alt="">
            <h3>${ad.name}</h3>
            <h4>${ad.field}</h4>
            <p>${ad.description}</p>
            <button class="normal" id="green" onclick="editAd('${adId}')">Modifier</button>
            <button class="normal" id="red" onclick="deleteAd('${adId}')">Supprimer</button>
          `;
          adsContainer.appendChild(adBox);
        }
      });
    });
  }

  window.deleteAd = async function(adId) {
    await remove(ref(database, `che/${adId}`));
  };

  window.editAd = async function(adId) {
    const adSnap = await get(child(ref(database), `che/${adId}`));
    if (adSnap.exists()) {
      const ad = adSnap.val();
      document.getElementById("chercheur-name").value = ad.name;
      document.getElementById("chercheur-field").value = ad.field;
      document.getElementById("chercheur-image").value = ad.image ;
      document.getElementById("chercheur-description").value = ad.description;
      editingAdId = adId;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  displayAds();
});



///////////////////////////////////////// La Partie concenant le Chercheur////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  
        
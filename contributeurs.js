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
const adsRef = ref(database, "cont");
const auth = getAuth(app);

let editingAdId = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "contributeur.html";
    return;
  }

  document.getElementById("user-name").textContent = user.email;
  init(user); // Lancer le script avec le bon user
});

function init(user) {
  const adForm = document.getElementById("chercheur_form");

  adForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("contributeur-name").value;
    const field = document.getElementById("contributeur-field").value;
    const imageInput = document.getElementById("contributeur-image").files[0];
    const description = document.getElementById("contributeur-description").value;

    if (!name || !field || !imageInput || !description) {
      alert("Remplissez toutes les cases svp !");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const ad = {
        name,
        field,
        image: reader.result,
        description,
        userEmail: user.email,
        createdAt: Date.now()
      };

      try {
        if (editingAdId) {
          await update(ref(database, `che/${editingAdId}`), ad);
          editingAdId = null;
        } else {
          await push(adsRef, ad);
        }

        adForm.reset();
        displayAds(user);
      } catch (err) {
        console.error("Erreur lors de l'enregistrement :", err);
      }
    };
    reader.readAsDataURL(imageInput);
  });

  displayAds(user);
}

function displayAds(user) {
  const adsContainer = document.getElementById("contributeur-container");
  adsContainer.innerHTML = "";

  onValue(adsRef, (snapshot) => {
    adsContainer.innerHTML = "";
    snapshot.forEach((childSnap) => {
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

window.deleteAd = async function (adId) {
  try {
    await remove(ref(database, `cont/${adId}`));
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
  }
};

window.editAd = async function (adId) {
  try {
    const adSnap = await get(child(ref(database), `cont/${adId}`));
    if (adSnap.exists()) {
      const ad = adSnap.val();
      document.getElementById("contributeur-name").value = ad.name;
      document.getElementById("contributeur-field").value = ad.field;
      document.getElementById("contributeur-description").value = ad.description;
      editingAdId = adId;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } catch (err) {
    console.error("Erreur chargement pour modification :", err);
  }
};
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  update,
  get,
  child
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

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
const adsRef = ref(database, "ann");

let editingAdId = null;

const adForm = document.getElementById("article_form");

if (adForm) {
  adForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const date = document.getElementById("annonce-date").value;
    const title = document.getElementById("annonce-title").value;
    const description = document.getElementById("annonce-description").value;

    const ad = {
      date,
      title,
      description,
      createdAt: Date.now()
    };

    try {
      if (editingAdId) {
        await update(ref(database, `ann/${editingAdId}`), ad);
        editingAdId = null;
      } else {
        await push(adsRef, ad);
      }

      adForm.reset();
      displayAds();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
    }
  });
}

displayAds();

function displayAds() {
  const adsContainer = document.getElementById("annonce-container");
  if (!adsContainer) return;

  adsContainer.innerHTML = "";

  onValue(adsRef, (snapshot) => {
    adsContainer.innerHTML = "";

    snapshot.forEach((childSnap) => {
      const ad = childSnap.val();
      const adId = childSnap.key;

      const adBox = document.createElement("div");
      adBox.classList.add("article-princ");
      adBox.innerHTML = `
        <span>Annonce Publiée le : ${ad.date}</span>
        <h2>${ad.title}</h2>
        <p class="article-content">${ad.description}</p>
        <button class="toggle-btn">Voir plus</button>
        <button class="normal" id="green" onclick="editAd('${adId}')">Modifier</button>
        <button class="normal" id="red" onclick="deleteAd('${adId}')">Supprimer</button>
      `;
      adsContainer.appendChild(adBox);
    });
  });
}

window.deleteAd = async function (adId) {
  try {
    await remove(ref(database, `ann/${adId}`));
    displayAds();
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
};

window.editAd = async function (adId) {
  try {
    const adSnap = await get(child(ref(database), `ann/${adId}`));
    if (adSnap.exists()) {
      const ad = adSnap.val();
      document.getElementById("annonce-date").value = ad.date;
      document.getElementById("annonce-title").value = ad.title;
      document.getElementById("annonce-description").value = ad.description;
      editingAdId = adId;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } catch (error) {
    console.error("Erreur lors du chargement de l'annonce :", error);
  }
};

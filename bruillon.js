

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
const adsRef = ref(database, "ads");
const auth = getAuth(app);

let editingAdId = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  document.getElementById("user-name").textContent = user.email;

  document.getElementById("logout-btn").addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.href = "index.html";
    });
  });

const adForm = document.getElementById("article_form");

  adForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const date = document.getElementById("art-date").value;
    const volume = document.getElementById("art-volt").value;
    const title = document.getElementById("art-title").value;
    const containt = document.getElementById("art-containt").value;
    const pdfInput = document.getElementById("art-pdf").files[0];

    const userId = auth.currentUser.uid;
    const dbRef = ref(getDatabase());
    const userSnap = await get(child(dbRef, `users/${userId}`));
    //let number = "";
    //if (userSnap.exists()) {
    //  number = userSnap.val().number || "";
    //}

    const saveAd = async (pdfData) => {
      const ad = {
        date,
        volume,
        title,
        containt,
        pdf: pdfData || null,
        userEmail: user.email,
        createdAt: Date.now(),
      };

      // Validate form fields
      if (!date || !volume || !title || !pdfData || !containt) {
        alert("Remplissez toutes les cases Svp!.");
        return;
      } 

      if (editingAdId) {
        await update(ref(database, `ads/${editingAdId}`), ad);
        editingAdId = null;
      } else {
        await push(adsRef, ad);
      }

      adForm.reset();
      displayAds();
    };

    if (pdfInput) {
      const reader = new FileReader();
      reader.onload = () => saveAd(reader.result);
      reader.readAsDataURL(pdfInput);
    } else {
      saveAd();
    }
  });

  function displayAds() {
    const adsContainer = document.getElementById("article-container");
    adsContainer.innerHTML = "";

    onValue(adsRef, (snapshot) => {
      adsContainer.innerHTML = "";
      snapshot.forEach(childSnap => {
        const ad = childSnap.val();
        const adId = childSnap.key;
        if (ad.userEmail === user.email) {
          const adBox = document.createElement("div");
          adBox.classList.add("article-princ");
          adBox.innerHTML = `
            <span>Article Publié le : ${ad.date}  | ${ad.volume}</span>
            <h2>${ad.title}</h2>
            <p class="article-content">${ad.containt}</p>
            <p class="pdf_link"><a href="${ad.pdf}" target="_blank">Voir le PDF</a></p>
            <button class="toggle-btn">Voir plus</button>
            <button class="normal" id="green" onclick="editAd('${adId}')">Modifier</button>
            <button class="normal" id="red" onclick="deleteAd('${adId}')">Supprimer</button>
          `;
          adsContainer.appendChild(adBox);
        }
      });
    });
  }

  window.deleteAd = async function(adId) {
    await remove(ref(database, `ads/${adId}`));
  };

  window.editAd = async function(adId) {
    const adSnap = await get(child(ref(database), `ads/${adId}`));
    if (adSnap.exists()) {
      const ad = adSnap.val();
      document.getElementById("art-date").value = ad.date;
      document.getElementById("art-volt").value = ad.volume;
      document.getElementById("art-title").value = ad.title;
      document.getElementById("art-containt").value = ad.containt;
      editingAdId = adId;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  displayAds();
});

  //toggleBtn Voir plus clicked
  document.getElementById("article-container").addEventListener("click", function (e) {
  if (e.target.classList.contains("toggle-btn")) {
    const btn = e.target;
    const content = btn.parentElement.querySelector(".article-content");
    content.classList.toggle("expanded");
    btn.textContent = content.classList.contains("expanded") ? "Voir moins" : "Voir plus";
  }
});


  
  
        
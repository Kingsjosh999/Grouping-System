import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/* 🔥 FIREBASE CONFIG */
const firebaseConfig = {
  apiKey: "AIzaSyDuBek8rT7rH0o0SkyMLjkYJ6XftcIgcgc",
  authDomain: "grouping-system-2d529.firebaseapp.com",
  projectId: "grouping-system-2d529",
  storageBucket: "grouping-system-2d529.firebasestorage.app",
  messagingSenderId: "317853326834",
  appId: "1:317853326834:web:71d64991425b5c9c539f6b"
};

/* INIT FIREBASE */
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Firebase connected successfully");

/* GROUPS */
const groups = [
  "UGOCHUKWU DANIEL CHIMEREMEZE (Daniboiofthebuilding)",
  "OSONDU CHIMEREZE GOODLUCK (gud luck)",
  "OKPARA JOEL CHIBUEZE (j.c.o)",
  "AKPARANTA SAMUEL CHIBUIKEM (ñelly fundz)",
  "OKORE FRANK AGWU (Flawless Ex)",
  "NWOGAZI WISDOM CHIMCHETARAM (WinCo)",
  "BASIL KELECHI SHEDRACK (shédräçk Lãbs)",
  "EKWUEME IFESINACHI (xperience)",
  "CHUKWUMA INCREASE CHIMEREMEZE (crease FX)",
  "AGBAI VALENTINE NNAMDI (Diviytoobig)",
  "IKPO JUSTICE ROLAND (JUICE CREATIONS)",
  "ANEKE FAITH FECHUKWU (fabulous)",
  "IKECHUKWU UGOCHI FAVOUR",
  "NDUKWE ESTHER AMARACHI",
  "OGECHUKWU PRINCE CHINOMSO (OFFICIAL of MOUAU)",
  "ORJI HARMONY CHIMAOBI (CM)",
  "NDUDIM HARMONY CHUKWUEBUKA",
  "ONUOHA BLOSSOM FECHUKWU",
  "IKECHUKWU MMESOMACHI GOODNESS (ZARA)",
  "CHIDEBERE PROSPER KELECHI"
];

const groupSelect = document.getElementById("groupSelect");

/* LOAD GROUPS WITH COUNTS */
async function loadGroups() {
  groupSelect.innerHTML = `<option value="">Select Group</option>`;

  for (let group of groups) {
    const q = query(collection(db, "students"), where("group", "==", group));
    const snapshot = await getDocs(q);

    const count = snapshot.size;

    const option = document.createElement("option");
    option.value = group;
    option.textContent = `${group} (${count}/30)`;

    if (count >= 30) {
      option.disabled = true;
      option.textContent += " - Full";
    }

    groupSelect.appendChild(option);
  }
}

loadGroups();

/* FORM */
const form = document.getElementById("groupForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const matricInput = document.getElementById("matric").value;
  const group = groupSelect.value;

  const matric = `MOUAU/CMP/${matricInput}`;

  /* CHECK DUPLICATE */
  const q = query(collection(db, "students"), where("matric", "==", matric));
  const snap = await getDocs(q);

  if (!snap.empty) {
    showPopup("❌ You already registered");
    return;
  }

  /* CHECK GROUP LIMIT */
  const gq = query(collection(db, "students"), where("group", "==", group));
  const gsnap = await getDocs(gq);

  if (gsnap.size >= 30) {
    showPopup("❌ Please select another group");
    return;
  }

  /* SAVE DATA */
  await addDoc(collection(db, "students"), {
    name,
    phone,
    matric,
    group
  });

  showPopup("✅ Successfully  Joined Group";

  form.reset();
  loadGroups();
});

/* POPUP */
function showPopup(message) {
  document.getElementById("popupText").innerText = message;
  document.getElementById("popup").style.display = "flex";
}

window.closePopup = function () {
  document.getElementById("popup").style.display = "none";
};
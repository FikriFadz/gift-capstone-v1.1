// profile.js

const authInstance = window.firebaseAuth;
const dbInstance = window.firebaseDb;

// Helper
const setText = (selector, text) => {
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
};
const setImage = (selector, url) => {
  const el = document.querySelector(selector);
  if (el) el.src = url;
};

// Listen for auth state
if (authInstance) {
  authInstance.onAuthStateChanged((user) => {
    if (!user) {
      console.warn("No user logged in — redirecting.");
      window.location.href = "../index.html";
      return;
    }

    dbInstance.collection("users").doc(user.uid).get().then((doc) => {
      if (!doc.exists) {
        console.warn("No profile document for", user.uid);
        return;
      }
      const data = doc.data();

      // Map Firestore fields → Profile HTML
      if (data.name) {
        setText(".profile-info h2", data.name);
        setText(".detail-row:nth-child(1) .detail-value", data.name);
      }
      if (data.email) {
        setText(".profile-email", data.email);
        setText(".detail-row:nth-child(2) .detail-value", data.email);
      }
      if (data.joined) setText(".profile-joined", "Member since " + data.joined);
      if (data.phone) setText(".detail-row:nth-child(3) .detail-value", data.phone);

      if (data.points !== undefined) setText(".stat-item:nth-child(1) .stat-number", data.points);
      if (data.vouchers !== undefined) setText(".stat-item:nth-child(2) .stat-number", data.vouchers);
      if (data.offerused !== undefined) setText(".stat-item:nth-child(3) .stat-number", data.offerused);

      if (data.photoURL) {
        setImage(".profile-avatar img", data.photoURL);
      } else if (data.profilepic) {
        setImage(".profile-avatar img", data.profilepic);
      }
    }).catch((err) => console.error("Error fetching profile:", err));
  });
}

// Logout
const logoutBtn = document.querySelector(".logout-button");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    console.log("Logout button clicked ✅");

    if (!window.firebaseAuth) {
      console.error("Firebase Auth not initialized");
      return;
    }

    window.firebaseAuth
      .signOut()
      .then(() => {
        console.log("SignOut completed ✅");

        // Create popup dynamically
        const popupOverlay = document.createElement("div");
        popupOverlay.classList.add("popup-overlay");
        popupOverlay.style.display = "flex";

        popupOverlay.innerHTML = `
          <div class="popup-content">
            <h2>Logged Out</h2>
            <p>You have been logged out successfully.</p>
            <button id="closePopup">OK</button>
          </div>
        `;

        document.body.appendChild(popupOverlay);

        // Add close button behavior
        const closePopup = document.getElementById("closePopup");
        if (closePopup) {
          closePopup.addEventListener("click", () => {
            popupOverlay.remove();
            window.location.href = "../index.html";
          });
        }
      })
      .catch((error) => {
        console.error("Logout Error:", error);
      });
  });
}

const authInstance = window.firebaseAuth;
const dbInstance = window.firebaseDb;

// Helpers
const setText = (selector, text) => {
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
};
const setImage = (selector, url) => {
  const el = document.querySelector(selector);
  if (el) el.src = url;
};

// Auth state listener
if (authInstance) {
  authInstance.onAuthStateChanged((user) => {
    if (!user) {
      console.warn("No user logged in — redirecting.");
      window.location.href = "../index.html";
      return;
    }

    // Fetch profile details
    dbInstance
      .collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (!doc.exists) return;

        const data = doc.data();
        if (data.name) {
          setText(".profile-info h2", data.name);
          setText(".detail-row:nth-child(1) .detail-value", data.name);
        }
        if (data.email) {
          setText(".profile-email", data.email);
          setText(".detail-row:nth-child(2) .detail-value", data.email);
        }
        if (data.joined)
          setText(".profile-joined", "Member since " + data.joined);
        if (data.phone)
          setText(".detail-row:nth-child(3) .detail-value", data.phone);

        if (data.points !== undefined)
          setText(".stat-item:nth-child(1) .stat-number", data.points);
        if (data.vouchers !== undefined)
          setText(".stat-item:nth-child(2) .stat-number", data.vouchers);
        if (data.offerused !== undefined)
          setText(".stat-item:nth-child(3) .stat-number", data.offerused);

        if (data.photoURL) {
          setImage(".profile-avatar img", data.photoURL);
        } else if (data.profilepic) {
          setImage(".profile-avatar img", data.profilepic);
        }

        // Fetch recent history after profile loads
        fetchRecentHistory(user.uid);
      })
      .catch((err) => console.error("Error fetching profile:", err));
  });
}

function fetchRecentHistory(userId) {
  const historyContainer = document.getElementById("recentActivity");
  if (!historyContainer) return;

  historyContainer.innerHTML = "<p>Loading recent activity...</p>";

  dbInstance
    .collection("users")
    .doc(userId)
    .collection("history")
    .orderBy("time", "desc")
    .limit(10)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        historyContainer.innerHTML = "<p>No recent activity found.</p>";
        return;
      }

      historyContainer.innerHTML = "";

      querySnapshot.forEach((doc) => {
        const activity = doc.data();

        const item = document.createElement("div");
        item.classList.add("activity-item");

        // ✅ Points style: debit = green, credit = red
        let pointsClass = "activity-points";
        if (activity.type === "debit") pointsClass = "activity-points green";
        if (activity.type === "credit") pointsClass = "activity-points red";

        item.innerHTML = `
          <div class="activity-content">
            <p>${activity.description || "Activity"}</p>
            <span class="activity-time">${
              activity.time?.toDate().toLocaleString() || ""
            }</span>
          </div>
          <div class="${pointsClass}">
            ${activity.points || 0} pts
          </div>
        `;

        historyContainer.appendChild(item);
      });
    })
    .catch((error) => {
      console.error("Error fetching history:", error);
      historyContainer.innerHTML = "<p>Error loading recent activity.</p>";
    });
}



// Logout
const logoutBtn = document.querySelector(".logout-button");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    authInstance
      .signOut()
      .then(() => {
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

        document
          .getElementById("closePopup")
          .addEventListener("click", () => {
            popupOverlay.remove();
            window.location.href = "../index.html";
          });
      })
      .catch((error) => console.error("Logout Error:", error));
  });
}

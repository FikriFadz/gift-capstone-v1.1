// Discover Page JavaScript
document.addEventListener("DOMContentLoaded", function () {
  const offersGrid = document.getElementById("offersGrid");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  let offers = [];
  let displayedOffers = 6;
  let currentOffers = [];
  let currentUser = null;

  // Get current user (Firebase Auth)
  function getCurrentUser() {
    return new Promise((resolve, reject) => {
      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      }, reject);
    });
  }

  async function init() {
    currentUser = await getCurrentUser();
    await fetchOffers();
    currentOffers = [...offers];
    renderOffers(currentOffers.slice(0, displayedOffers));
    setupEventListeners();
  }
  // Fetch vouchers from Firestore
  async function fetchOffers() {
    try {
      const snapshot = await db.collection("vouchers").get();
      offers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // Only show vouchers that are active and not yet redeemed
      offers = offers.filter((offer) => offer.status === "active" && !offer.redeemed);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  }

  // Render vouchers
  function renderOffers(offersToRender) {
    offersGrid.innerHTML = "";

    offersToRender.forEach((offer) => {
      const offerCard = createOfferCard(offer);
      offersGrid.appendChild(offerCard);
    });

    loadMoreBtn.style.display =
      currentOffers.length > displayedOffers ? "block" : "none";

    // Add new event listeners to "Add to My Voucher" buttons
    document.querySelectorAll(".add-btn").forEach((btn) => {
      btn.addEventListener("click", async function () {
        const offerId = btn.getAttribute("data-id");
        await handleAddToMyVoucher(offerId, btn);
      });
    });
  }

  // Create voucher card
  function createOfferCard(offer) {
    const card = document.createElement("div");
    card.className = "offer-card";
    card.dataset.id = offer.id;
    card.dataset.category = offer.category || "general";

    // Format expiry date nicely
    const expiryDate = offer.expiry
      ? new Date(offer.expiry).toLocaleDateString()
      : "N/A";

    card.innerHTML = `
    <div class="offer-image">
        <img src="${offer.imageURL || "https://via.placeholder.com/300x200"}" 
             alt="${offer.title}" />
    </div>
    <div class="offer-content">
        <span class="offer-category">${capitalize(
          offer.category || "general"
        )}</span>
        <span class="offer-badge">${capitalize(offer.badge || "new")}</span>
        <h3 class="offer-title">${offer.title}</h3>
        <p class="offer-description">${offer.description}</p>
        <div class="offer-points">
            <i class="fas fa-coins"></i> ${offer.points} Points
        </div>
        <small class="offer-expiry">Valid until: ${expiryDate}</small>
        <div class="offer-actions">
            <button class="btn btn-primary add-btn" data-id="${
              offer.id
            }">Add to My Voucher</button>
            <button class="btn btn-outline use-btn" data-id="${
              offer.id
            }">Use Now</button>
        </div>
    </div>
  `;
    return card;
  }

  // Helpers
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Event listeners
  function setupEventListeners() {
    // Search
    searchInput.addEventListener("input", function () {
      const query = searchInput.value.toLowerCase();
      currentOffers = offers.filter(
        (offer) =>
          offer.title.toLowerCase().includes(query) ||
          offer.description.toLowerCase().includes(query) ||
          (offer.code || "").toLowerCase().includes(query)
      );
      displayedOffers = 6;
      renderOffers(currentOffers.slice(0, displayedOffers));
    });

    // Category filter
    categoryFilter.addEventListener("change", function () {
      const selected = categoryFilter.value;
      if (selected === "") {
        currentOffers = [...offers];
      } else {
        currentOffers = offers.filter(
          (offer) => (offer.category || "general") === selected
        );
      }
      displayedOffers = 6;
      renderOffers(currentOffers.slice(0, displayedOffers));
    });

    // Load more
    loadMoreBtn.addEventListener("click", function () {
      displayedOffers += 6;
      renderOffers(currentOffers.slice(0, displayedOffers));
    });
  }

  // Handle "Add to My Voucher" click
  async function handleAddToMyVoucher(offerId, btn) {
    if (!currentUser) {
      alert("Please log in to add vouchers.");
      return;
    }
    btn.disabled = true;
    btn.textContent = "Adding...";

    try {
      // 1. Update the voucher's 'redeemed' status in Firestore
      await db.collection("vouchers").doc(offerId).update({
        redeemed: true,
      });

      // 2. Get the voucher data to copy to user's collection
      const offerDoc = await db.collection("vouchers").doc(offerId).get();
      const offerData = offerDoc.data();

      // 3. Add voucher details to the user's "my vouchers" collection
      await db
        .collection("users")
        .doc(currentUser.uid)
        .collection("myvouchers")
        .doc(offerId)
        .set({
          ...offerData,
          redeemedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

      // 4. Optionally, remove from local offers and re-render
      offers = offers.filter((offer) => offer.id !== offerId);
      currentOffers = currentOffers.filter((offer) => offer.id !== offerId);
      renderOffers(currentOffers.slice(0, displayedOffers));

      alert("Voucher added to your account!");
    } catch (error) {
      console.error("Error adding voucher:", error);
      alert("Failed to add voucher. Please try again.");
      btn.disabled = false;
      btn.textContent = "Add to My Voucher";
    }
  }

  // Run
  init();
});
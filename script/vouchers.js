// My Voucher Page JavaScript - Updated for new card layout and modal without image
document.addEventListener('DOMContentLoaded', function () {
  const vouchersGrid = document.getElementById('vouchersGrid');
  const emptyState = document.getElementById('emptyState');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const totalVouchers = document.getElementById('totalVouchers');
  const activeVouchers = document.getElementById('activeVouchers');
  const modal = document.getElementById('voucherModal');
  const closeModal = document.querySelector('.close-modal');
  const modalBody = document.querySelector('.modal-body');

  let vouchers = [];

  // ✅ Wait until user is signed in
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      await fetchUserVouchers(user.uid);
      updateVoucherStats();
      renderVouchers('all');
      setupEventListeners();
      checkEmptyState();
    } else {
      emptyState.style.display = 'block';
      vouchersGrid.style.display = 'none';
    }
  });

  // 🔹 Fetch from Firestore: users/{uid}/myvouchers
  async function fetchUserVouchers(userId) {
    try {
      const snapshot = await db
        .collection("users")
        .doc(userId)
        .collection("myvouchers")
        .get();

      vouchers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  }

  function updateVoucherStats() {
    totalVouchers.textContent = vouchers.length;
    const activeCount = vouchers.filter(v => v.status === 'active').length;
    activeVouchers.textContent = activeCount;
  }

  function renderVouchers(tab) {
    vouchersGrid.innerHTML = '';

    let filteredVouchers = vouchers;
    if (tab !== 'all') {
      filteredVouchers = vouchers.filter(voucher => voucher.status === tab);
    }

    if (filteredVouchers.length === 0) {
      emptyState.style.display = 'block';
      vouchersGrid.style.display = 'none';
    } else {
      emptyState.style.display = 'none';
      vouchersGrid.style.display = 'grid';

      filteredVouchers.forEach(voucher => {
        const voucherCard = createVoucherCard(voucher);
        vouchersGrid.appendChild(voucherCard);
      });
    }
  }

  // Updated card layout: image covers all purple, all text in white below
  function createVoucherCard(voucher) {
    const card = document.createElement('div');
    card.className = 'voucher-card';
    card.dataset.id = voucher.id;

    const statusClass = `status-${voucher.status}`;
    const statusText = voucher.status.charAt(0).toUpperCase() + voucher.status.slice(1);

    // Format expiry/added date
    const expiryDate = voucher.expiry
      ? new Date(voucher.expiry).toISOString().slice(0, 10)
      : 'N/A';
    const addedDate = voucher.addedDate
      ? new Date(voucher.addedDate).toISOString().slice(0, 10)
      : 'N/A';

    card.innerHTML = `
      <div class="voucher-header voucher-header-img" style="background-image: url('${voucher.imageURL || 'https://via.placeholder.com/300x200'}');">
        <span class="status-badge ${statusClass}">${statusText}</span>
      </div>
      <div class="voucher-content">
        <h3 class="voucher-title">${voucher.title}</h3>
        <div class="voucher-code">${voucher.code}</div>
        <p class="voucher-description">${voucher.description}</p>
        <div class="voucher-details">
          <div class="voucher-detail">
            <span class="detail-label">Points Value</span>
            <span class="detail-value">${voucher.points} pts</span>
          </div>
          <div class="voucher-detail">
            <span class="detail-label">Expires</span>
            <span class="detail-value">${expiryDate}</span>
          </div>
          <div class="voucher-detail">
            <span class="detail-label">Added</span>
            <span class="detail-value">${addedDate}</span>
          </div>
        </div>
        <button class="btn btn-secondary view-btn">View Details</button>
      </div>
    `;

    card.querySelector('.view-btn').addEventListener('click', () => openVoucherModal(voucher));
    return card;
  }

  // MODAL: No image in View Details modal
  function openVoucherModal(voucher) {
    modalBody.innerHTML = `
      <h2>${voucher.title}</h2>
      <p>${voucher.description}</p>
      <p><strong>Code:</strong> ${voucher.code}</p>
      <p><strong>Points:</strong> ${voucher.points} pts</p>
      <p><strong>Expires:</strong> ${voucher.expiry}</p>
      <p><strong>Status:</strong> ${voucher.status}</p>
    `;
    modal.style.display = 'flex';
  }

  function closeVoucherModal() {
    modal.style.display = 'none';
  }

  function checkEmptyState() {
    if (vouchers.length === 0) {
      emptyState.style.display = 'block';
      vouchersGrid.style.display = 'none';
    } else {
      emptyState.style.display = 'none';
      vouchersGrid.style.display = 'grid';
    }
  }

  function setupEventListeners() {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelector('.tab-btn.active').classList.remove('active');
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        renderVouchers(tab);
      });
    });

    closeModal.addEventListener('click', closeVoucherModal);

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeVoucherModal();
      }
    });
  }
});
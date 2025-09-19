// My Voucher Page JavaScript
document.addEventListener('DOMContentLoaded', function () {
  const vouchersGrid = document.getElementById('vouchersGrid');
  const emptyState = document.getElementById('emptyState');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const totalVouchers = document.getElementById('totalVouchers');
  const activeVouchers = document.getElementById('activeVouchers');
  const modal = document.getElementById('voucherModal');
  const closeModal = document.querySelector('.close-modal');
  const modalBody = document.querySelector('.modal-body');

  // Sample voucher data (replace with API/localStorage in real app)
  let vouchers = JSON.parse(localStorage.getItem('userVouchers')) || [
    {
      id: 1,
      title: "10% Off Starbucks",
      code: "STAR10",
      description: "Enjoy 10% off on your next Starbucks order.",
      points: 300,
      expiry: "2025-12-31",
      addedDate: "2025-09-10",
      status: "active"
    },
    {
      id: 2,
      title: "Free Movie Ticket",
      code: "MOVIE2025",
      description: "Get a free cinema ticket at selected outlets.",
      points: 500,
      expiry: "2025-11-30",
      addedDate: "2025-09-15",
      status: "used"
    }
  ];

  function init() {
    updateVoucherStats();
    renderVouchers('all');
    setupEventListeners();
    checkEmptyState();
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

  function createVoucherCard(voucher) {
    const card = document.createElement('div');
    card.className = 'voucher-card';
    card.dataset.id = voucher.id;

    const statusClass = `status-${voucher.status}`;
    const statusText = voucher.status.charAt(0).toUpperCase() + voucher.status.slice(1);

    card.innerHTML = `
      <div class="voucher-header">
        <div class="status-badge ${statusClass}">${statusText}</div>
        <div class="voucher-icon">
          <i class="fas fa-ticket-alt"></i>
        </div>
        <h3 class="voucher-title">${voucher.title}</h3>
        <div class="voucher-code">${voucher.code}</div>
      </div>
      <div class="voucher-content">
        <p class="voucher-description">${voucher.description}</p>
        <div class="voucher-details">
          <div class="voucher-detail">
            <span class="detail-label">Points Value</span>
            <span class="detail-value">${voucher.points} pts</span>
          </div>
          <div class="voucher-detail">
            <span class="detail-label">Expires</span>
            <span class="detail-value">${voucher.expiry}</span>
          </div>
          <div class="voucher-detail">
            <span class="detail-label">Added</span>
            <span class="detail-value">${voucher.addedDate}</span>
          </div>
        </div>
        <button class="btn btn-secondary view-btn">View Details</button>
      </div>
    `;

    card.querySelector('.view-btn').addEventListener('click', () => openVoucherModal(voucher));
    return card;
  }

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

  init();
});

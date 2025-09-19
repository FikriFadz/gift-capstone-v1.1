// Discover Page JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Sample offers data
  // offers.js (part 1 of 5)

  const offers = [
    {
      id: 1,
      title: "50% Off Coffee Delight",
      description:
        "Enjoy half-price on all beverages at Coffee Delight outlets. Valid for 30 days.",
      points: 500,
      category: "food",
      badge: "popular",
      expiry: "Valid until Dec 31, 2023",
      image:
        "https://placeholder-image-service.onrender.com/image/300x200?prompt=Coffee shop with people enjoying drinks&id=offer1",
    },
    {
      id: 2,
      title: "Free Movie Ticket",
      description:
        "Redeem your points for a complimentary movie ticket at any Cineplex location.",
      points: 800,
      category: "entertainment",
      badge: "new",
      expiry: "Valid until Jan 15, 2024",
      image:
        "https://placeholder-image-service.onrender.com/image/300x200?prompt=Modern cinema theater with popcorn&id=offer2",
    },
    {
      id: 3,
      title: "20% Shopping Spree",
      description:
        "Get 20% off on your entire purchase at Fashion Haven stores. Limited time offer.",
      points: 300,
      category: "shopping",
      badge: "limited",
      expiry: "Valid until Dec 25, 2023",
      image:
        "https://placeholder-image-service.onrender.com/image/300x200?prompt=Fashion retail store with clothing displays&id=offer3",
    },
    {
      id: 4,
      title: "Free Hotel Breakfast",
      description:
        "Complimentary breakfast for two at any Grand Hotel location with your stay.",
      points: 600,
      category: "travel",
      badge: "popular",
      expiry: "Valid until Mar 31, 2024",
      image:
        "https://placeholder-image-service.onrender.com/image/300x200?prompt=Luxury hotel breakfast buffet&id=offer4",
    },
    {
      id: 5,
      title: "Spa Day Package",
      description:
        "Relax with our premium spa package including massage and facial treatment.",
      points: 700,
      category: "services",
      badge: "new",
      expiry: "Valid until Feb 28, 2024",
      image:
        "https://placeholder-image-service.onrender.com/image/300x200?prompt=Luxury spa treatment room&id=offer5",
    },
    {
      id: 6,
      title: "Free Appetizer",
      description:
        "Get a free appetizer with any main course purchase at Bella Italia Restaurant.",
      points: 200,
      category: "food",
      badge: "limited",
      expiry: "Valid until Jan 10, 2024",
      image:
        "https://placeholder-image-service.onrender.com/image/300x200?prompt=Italian restaurant appetizers&id=offer6",
    },
    {
      id: 7,
      title: "Buy 1 Get 1 Pizza",
      description:
        "Order any large pizza and get another free at Pizza Palace.",
      points: 400,
      category: "food",
      badge: "popular",
      expiry: "Valid until Feb 20, 2024",
      image:
        "https://placeholder-image-service.onrender.com/image/300x200?prompt=Delicious pizza with toppings&id=offer7",
    },
    {
      id: 8,
      title: "Concert Pass Discount",
      description: "Save 30% on tickets for live music concerts nationwide.",
      points: 900,
      category: "entertainment",
      badge: "new",
      expiry: "Valid until Apr 5, 2024",
      image:
        "https://placeholder-image-service.onrender.com/image/300x200?prompt=Live concert crowd with lights&id=offer8",
    },
    {
      id: 9,
      title: "Electronics Deal",
      description: "Enjoy 15% off on all gadgets at TechWorld stores.",
      points: 1000,
      category: "shopping",
      badge: "limited",
      expiry: "Valid until May 1, 2024",
      image:
        "https://placeholder-image-service.onrender.com/image/300x200?prompt=Electronics store with gadgets&id=offer9",
    },
    {
      id: 10,
      title: "Flight Voucher",
      description: "Save RM200 on your next international flight booking.",
      points: 1500,
      category: "travel",
      badge: "popular",
      expiry: "Valid until Jun 30, 2024",
      image:
        "https://placeholder-image-service.onrender.com/image/300x200?prompt=Airplane taking off at sunset&id=offer10",
    },
    {
      id: 11,
      title: "Gym Membership Week",
      description: "Redeem a free one-week trial pass at FitLife Gym.",
      points: 250,
      category: "services",
      badge: "new",
      expiry: "Valid until Jan 30, 2024",
      image:
        "https://placeholder-image-service.onrender.com/image/300x200?prompt=Modern gym with workout equipment&id=offer11",
    },
    {
      id: 12,
      title: "Burger Combo Meal",
      description: "Redeem a free fries and drink with any burger purchase.",
      points: 350,
      category: "food",
      badge: "limited",
      expiry: "Valid until Feb 15, 2024",
      image:
        "https://placeholder-image-service.onrender.com/image/300x200?prompt=Juicy burger combo meal&id=offer12",
    },
    {
      id: 13,
      title: "Theater Night",
      description: "Enjoy a 2-for-1 deal on all theater performance tickets.",
      points: 700,
      category: "entertainment",
      badge: "popular",
      expiry: "Valid until Mar 10, 2024",
      image:
        "https://placeholder-image-service.onrender.com/image/300x200?prompt=Stage theater with audience&id=offer13",
    },
    {
      id: 14,
      title: "Clothing Store Voucher",
      description: "Get RM100 off when you spend RM500 at Style Corner.",
      points: 600,
      category: "shopping",
      badge: "new",
      expiry: "Valid until Apr 25, 2024",
      image:
        "https://placeholder-image-service.onrender.com/image/300x200?prompt=Clothing boutique with racks&id=offer14",
    },
    {
      id: 15,
      title: "Resort Stay Discount",
      description: "Save 25% on your next two-night resort stay booking.",
      points: 1200,
      category: "travel",
      badge: "limited",
      expiry: "Valid until Aug 15, 2024",
      image:
        "https://placeholder-image-service.onrender.com/image/300x200?prompt=Beach resort with pool&id=offer15",
    },
    {
      id: 16,
      title: "Car Wash Service",
      description: "Redeem a free premium car wash at Shine Auto Care.",
      points: 300,
      category: "services",
      badge: "popular",
      expiry: "Valid until Mar 1, 2024",
      image:
        "https://placeholder-image-service.onrender.com/image/300x200?prompt=Car wash service cleaning vehicle&id=offer16",
    },
    {
      id: 17,
      title: "Ice Cream Treat",
      description: "Get 2 scoops of ice cream free with any dessert purchase.",
      points: 200,
      category: "food",
      badge: "new",
      expiry: "Valid until Feb 28, 2024",
      image:
        "https://placeholder-image-service.onrender.com/image/300x200?prompt=Ice cream sundae cups&id=offer17",
    },
    {
      id: 18,
      title: "VR Gaming Session",
      description: "Enjoy a free 1-hour VR game experience at VR World.",
      points: 750,
      category: "entertainment",
      badge: "limited",
      expiry: "Valid until Apr 15, 2024",
      image:
        "https://placeholder-image-service.onrender.com/image/300x200?prompt=VR headset gaming center&id=offer18",
    },
    {
      id: 19,
      title: "Home Decor Voucher",
      description: "Save 20% on all furniture and home decor at Cozy Living.",
      points: 950,
      category: "shopping",
      badge: "popular",
      expiry: "Valid until May 20, 2024",
      image:
        "https://placeholder-image-service.onrender.com/image/300x200?prompt=Modern home decor store&id=offer19",
    },
    {
      id: 20,
      title: "Cruise Package Deal",
      description: "Get RM500 off your next luxury cruise package booking.",
      points: 2000,
      category: "travel",
      badge: "new",
      expiry: "Valid until Sep 30, 2024",
      image:
        "https://placeholder-image-service.onrender.com/image/300x200?prompt=Luxury cruise ship on ocean&id=offer20",
    },
  ];

  const offersGrid = document.getElementById("offersGrid");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  let displayedOffers = 6;
  let currentOffers = [...offers];

  // Initialize the page
  function init() {
    renderOffers(currentOffers.slice(0, displayedOffers));
    setupEventListeners();
  }

  // Render offers to the grid
  function renderOffers(offersToRender) {
    offersGrid.innerHTML = "";

    offersToRender.forEach((offer) => {
      const offerCard = createOfferCard(offer);
      offersGrid.appendChild(offerCard);
    });

    // Show/hide load more button
    loadMoreBtn.style.display =
      currentOffers.length > displayedOffers ? "block" : "none";
  }

  // Create offer card HTML
  function createOfferCard(offer) {
    const card = document.createElement("div");
    card.className = "offer-card";
    card.dataset.id = offer.id;
    card.dataset.category = offer.category;

    card.innerHTML = `
            <img src="${offer.image}" alt="${
      offer.title
    } promotional image" class="offer-image">
            <div class="offer-content">
                <span class="offer-category">${
                  offer.category.charAt(0).toUpperCase() +
                  offer.category.slice(1)
                }</span>
                <span class="offer-badge">${
                  offer.badge.charAt(0).toUpperCase() + offer.badge.slice(1)
                }</span>
                <h3 class="offer-title">${offer.title}</h3>
                <p class="offer-description">${offer.description}</p>
                <div class="offer-points">
                    <i class="fas fa-coins"></i> ${offer.points} Points
                </div>
                <small class="offer-expiry">${offer.expiry}</small>
            </div>
        `;
    return card;
  }

  // Event listeners
  function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener("input", function () {
      const query = searchInput.value.toLowerCase();
      currentOffers = offers.filter(
        (offer) =>
          offer.title.toLowerCase().includes(query) ||
          offer.description.toLowerCase().includes(query)
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
        currentOffers = offers.filter((offer) => offer.category === selected);
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

  // Run init
  init();
});

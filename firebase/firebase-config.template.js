// script/firebase-config.template.js
// ⚠️ RENAME THIS FILE TO firebase-config.js AND ADD YOUR ACTUAL FIREBASE CONFIGURATION

// Import Firebase modules
const firebase = window.firebase;

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase only if it hasn't been initialized yet
if (!firebase.apps || firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
} else {
    console.log("Firebase already initialized");
}

// Get Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Make services available globally for debugging and other scripts
window.firebaseApp = firebase;
window.firebaseAuth = auth;
window.firebaseDb = db;

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { auth, db };
}

console.log("Firebase services ready to use");
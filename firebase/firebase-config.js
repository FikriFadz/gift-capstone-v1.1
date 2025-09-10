// script/firebase-config.js
// ⚠️ RENAME THIS FILE TO firebase-config.js AND ADD YOUR ACTUAL FIREBASE CONFIGURATION

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBqCt26fY08cigECInNyDfKo89nrX8HkSM",
    authDomain: "gift-capstone.firebaseapp.com",
    projectId: "gift-capstone",
    storageBucket: "gift-capstone.firebasestorage.app",
    messagingSenderId: "833126888954",
    appId: "1:833126888954:web:da2898f058db621bb6e043"
};

// Initialize Firebase only if it hasn't been initialized yet
if (!firebase.apps || firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
} else {
    console.log("Firebase already initialized");
}

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Optional: Request additional scopes
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Make services available globally
window.firebaseApp = firebase;
window.firebaseAuth = auth;
window.firebaseDb = db;
window.googleProvider = googleProvider;

console.log("Firebase services ready to use");

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { auth, db, googleProvider };
}
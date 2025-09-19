// Add this at the very beginning of your index.js file
console.log('Debug: Firebase object:', window.firebase);
console.log('Debug: Firebase apps:', window.firebase?.apps);
console.log('Debug: Firebase auth function:', typeof window.firebase?.auth);

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Remove interactive background initialization
    // initInteractiveBackground();
    
    // Set up form switching functionality
    setupFormSwitching();
    
    // Initialize Firebase authentication
    initFirebaseAuth();
});

// Set up form switching with dissolve animations
function setupFormSwitching() {
    window.togglePassword = function(inputId, btn) {
        const field = document.getElementById(inputId);
        if (field.type === "password") {
            field.type = "text";
            btn.textContent = "HIDE";
        } else {
            field.type = "password";
            btn.textContent = "SHOW";
        }
    }

    window.showLogin = function() {
        const loginForm = document.getElementById("loginForm");
        const registerForm = document.getElementById("registerForm");
        
        // Remove dissolve animation, just switch forms instantly
        registerForm.classList.remove("active");
        loginForm.classList.add("active");
        loginForm.style.opacity = "1";
        registerForm.style.opacity = "0";
    }

    window.showRegister = function() {
        const loginForm = document.getElementById("loginForm");
        const registerForm = document.getElementById("registerForm");
        
        // Remove dissolve animation, just switch forms instantly
        loginForm.classList.remove("active");
        registerForm.classList.add("active");
        registerForm.style.opacity = "1";
        loginForm.style.opacity = "0";
    }
}

// Google Sign-In function
async function signInWithGoogle() {
    try {
        // Show loading state
        const googleButton = document.querySelector('.social-btn.google');
        const originalText = googleButton.innerHTML;
        googleButton.innerHTML = '<img src="assets/logo/google.png" alt="Google logo" class="google-icon"> Signing in...';
        googleButton.disabled = true;
        
        // Sign in with Google popup
        const result = await firebase.auth().signInWithPopup(window.googleProvider);
        const user = result.user;
        
        console.log('Google sign-in successful:', user);
        
        // Check if this is a new user
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        
        if (!userDoc.exists) {
            // New user - save their data
            await firebase.firestore().collection('users').doc(user.uid).set({
                name: user.displayName || user.email.split('@')[0],
                username: user.email.split('@')[0],
                email: user.email,
                photoURL: user.photoURL || '',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                provider: 'google'
            });
            
            console.log('New user data saved');
        } else {
            // Existing user - update last login
            await firebase.firestore().collection('users').doc(user.uid).update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Redirect to home page
        window.location.href = 'pages/homepage.html';
        
    } catch (error) {
        console.error('Google sign-in error:', error);
        
        let errorMessage = 'Google sign-in failed. Please try again.';
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                errorMessage = 'Sign-in popup was closed before completing';
                break;
            case 'auth/cancelled-popup-request':
                errorMessage = 'Another sign-in popup is already open';
                break;
            case 'auth/popup-blocked':
                errorMessage = 'Popup was blocked. Please allow popups for this site';
                break;
            default:
                errorMessage = error.message;
        }
        
        alert(errorMessage);
    } finally {
        // Reset button state
        const googleButton = document.querySelector('.social-btn.google');
        if (googleButton) {
            googleButton.innerHTML = '<img src="assets/logo/google.png" alt="Google logo" class="google-icon"> Google';
            googleButton.disabled = false;
        }
    }
}

// Initialize Firebase authentication
function initFirebaseAuth() {
    // Check if Firebase is available and initialized
    if (typeof firebase === 'undefined') {
        console.error('Firebase SDK not loaded');
        return;
    }
    
    // Check if Firebase app is initialized
    if (!firebase.apps || firebase.apps.length === 0) {
        console.error('Firebase app not initialized');
        return;
    }
    
    // Check if auth is available
    if (typeof firebase.auth !== 'function') {
        console.error('Firebase Auth not available');
        return;
    }
    
    console.log('Firebase is ready for authentication');

    // Add Google sign-in button event listener
    const googleButtons = document.querySelectorAll('.social-btn.google');
    googleButtons.forEach(button => {
        button.addEventListener('click', signInWithGoogle);
    });
    
    // Get form elements
    const loginFormElement = document.querySelector('#loginForm form');
    const registerFormElement = document.querySelector('#registerForm form');
    
    // Add event listeners for form submission
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', handleLogin);
    }
    
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', handleRegister);
    }
    
    // Listen for authentication state changes
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            console.log('User is signed in:', user);
            // Redirect to dashboard or home page
            // window.location.href = 'pages/homepage.html';
        } else {
            // User is signed out
            console.log('User is signed out');
        }
    });
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    // Get form values
    const emailInput = document.querySelector('#loginForm input[type="text"]');
    const passwordInput = document.getElementById('loginPassword');
    
    if (!emailInput || !passwordInput) {
        alert('Form elements not found');
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Validate inputs
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Show loading state
    const submitButton = e.target.querySelector('.login-btn');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Logging in...';
    submitButton.disabled = true;
    
    try {
        // Sign in with Firebase
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        console.log('Successfully signed in:', userCredential.user);
        
        // Redirect to home page
        window.location.href = 'pages/homepage.html';
    } catch (error) {
        console.error('Login error:', error);
        
        // Handle specific error codes
        let errorMessage = 'Login failed. Please try again.';
        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address';
                break;
            case 'auth/user-not-found':
                errorMessage = 'No user found with this email';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password';
                break;
            case 'auth/user-disabled':
                errorMessage = 'This account has been disabled';
                break;
            default:
                errorMessage = error.message;
        }
        
        alert(errorMessage);
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    // Safety check - ensure Firebase is initialized
    if (!firebase.apps || firebase.apps.length === 0) {
        alert('Application is not ready. Please refresh the page.');
        return;
    }
    
    // Get form values
    const emailInput = document.querySelector('#loginForm input[type="text"]');
    const passwordInput = document.getElementById('loginPassword');
    
    if (!emailInput || !passwordInput) {
        alert('Form elements not found');
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Validate inputs
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Show loading state
    const submitButton = e.target.querySelector('.login-btn');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Logging in...';
    submitButton.disabled = true;
    
    try {
        // Sign in with Firebase
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        console.log('Successfully signed in:', userCredential.user);
        
        // Redirect to home page
        window.location.href = 'pages/homepage.html';
    } catch (error) {
        console.error('Login error:', error);
        
        // Handle specific error codes
        let errorMessage = 'Login failed. Please try again.';
        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address';
                break;
            case 'auth/user-not-found':
                errorMessage = 'No user found with this email';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password';
                break;
            case 'auth/user-disabled':
                errorMessage = 'This account has been disabled';
                break;
            default:
                errorMessage = error.message;
        }
        
        alert(errorMessage);
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Handle registration form submission
async function handleRegister(e) {
    e.preventDefault();
    
    // Safety check - ensure Firebase is initialized
    if (!firebase.apps || firebase.apps.length === 0) {
        alert('Application is not ready. Please refresh the page.');
        return;
    }
    
    // Get form values
    const emailInput = document.querySelector('#registerForm input[placeholder="Email"]');
    const nameInput = document.querySelector('#registerForm input[placeholder="Fullname"]');
    const usernameInput = document.querySelector('#registerForm input[placeholder="Username"]');
    const passwordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (!emailInput || !nameInput || !usernameInput || !passwordInput || !confirmPasswordInput) {
        alert('Form elements not found');
        return;
    }
    
    const email = emailInput.value.trim();
    const name = nameInput.value.trim();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Validate inputs
    if (!email || !name || !username || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Validate password strength
    if (password.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    // Show loading state
    const submitButton = e.target.querySelector('.login-btn');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Creating account...';
    submitButton.disabled = true;
    
    try {
        // Create user with Firebase
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        
        // Save additional user data to Firestore
        if (firebase.firestore) {
            await firebase.firestore().collection('users').doc(userCredential.user.uid).set({
                name: name,
                username: username.toLowerCase(),
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        console.log('Successfully registered:', userCredential.user);
        
        // Redirect to home page
        window.location.href = 'pages/homepage.html';
    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle specific error codes
        let errorMessage = 'Registration failed. Please try again.';
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'An account with this email already exists';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'Registration is not allowed at this time';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password is too weak';
                break;
            default:
                errorMessage = error.message;
        }
        
        alert(errorMessage);
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}
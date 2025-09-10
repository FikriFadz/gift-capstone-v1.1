// Add this at the very beginning of your index.js file
console.log('Debug: Firebase object:', window.firebase);
console.log('Debug: Firebase apps:', window.firebase?.apps);
console.log('Debug: Firebase auth function:', typeof window.firebase?.auth);

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the interactive background
    initInteractiveBackground();
    
    // Set up form switching functionality
    setupFormSwitching();
    
    // Initialize Firebase authentication
    initFirebaseAuth();
});

// Initialize the interactive background with black and yellow theme
function initInteractiveBackground() {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    const background = document.getElementById('interactiveBackground');
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particles array
    const particles = [];
    const particleCount = 80;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            color: Math.random() > 0.7 ? '#FFD700' : '#222', // Mostly black with some yellow
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.2,
            connections: []
        });
    }
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let mouseRadius = 150;
    
    background.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animation loop
    function animate() {
        // Clear canvas with semi-transparent black for trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Move particles
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Bounce off edges
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
            
            // Mouse interaction
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouseRadius) {
                const angle = Math.atan2(dy, dx);
                const force = (mouseRadius - distance) / mouseRadius;
                p.speedX -= Math.cos(angle) * force * 0.1;
                p.speedY -= Math.sin(angle) * force * 0.1;
                
                // Change color when near mouse
                if (distance < mouseRadius * 0.5) {
                    p.color = '#FFD700';
                }
            } else {
                // Gradually return to original color
                if (Math.random() > 0.99) {
                    p.color = Math.random() > 0.7 ? '#FFD700' : '#222';
                }
            }
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
            
            // Draw connections between nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx2 = p.x - p2.x;
                const dy2 = p.y - p2.y;
                const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                
                if (distance2 < 100) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = p.color === '#FFD700' || p2.color === '#FFD700' ? 'rgba(255, 215, 0, 0.3)' : 'rgba(50, 50, 50, 0.2)';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

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
        
        // Start dissolve out animation for register form
        registerForm.style.transition = "opacity 0.4s ease-in-out";
        registerForm.style.opacity = "0";
        
        // After register form fades out, switch and fade in login form
        setTimeout(() => {
            // Hide register form
            registerForm.classList.remove("active");
            
            // Show and fade in login form
            loginForm.classList.add("active");
            loginForm.style.opacity = "0";
            loginForm.style.transition = "opacity 0.4s ease-in-out";
            
            // Trigger reflow to ensure transition works
            void loginForm.offsetWidth;
            
            // Fade in login form
            loginForm.style.opacity = "1";
        }, 400);
    }

    window.showRegister = function() {
        const loginForm = document.getElementById("loginForm");
        const registerForm = document.getElementById("registerForm");
        
        // Start dissolve out animation for login form
        loginForm.style.transition = "opacity 0.4s ease-in-out";
        loginForm.style.opacity = "0";
        
        // After login form fades out, switch and fade in register form
        setTimeout(() => {
            // Hide login form
            loginForm.classList.remove("active");
            
            // Show and fade in register form
            registerForm.classList.add("active");
            registerForm.style.opacity = "0";
            registerForm.style.transition = "opacity 0.4s ease-in-out";
            
            // Trigger reflow to ensure transition works
            void registerForm.offsetWidth;
            
            // Fade in register form
            registerForm.style.opacity = "1";
        }, 400);
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
// script/homepage.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initHomePage();
    
    // Set up logout button
    setupLogoutButton();
    
    // Listen for auth state changes
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            loadUserData(user);
        } else {
            // User is signed out
            handleSignOut();
        }
    });
});

// Initialize the homepage
function initHomePage() {
    console.log('Homepage initialized');
    
    // Show loading state while checking auth
    document.body.classList.add('loading');
}

// Set up logout button
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Handle logout
async function handleLogout() {
    try {
        // Show loading state
        const logoutBtn = document.getElementById('logoutBtn');
        const originalText = logoutBtn.textContent;
        logoutBtn.textContent = 'Signing out...';
        logoutBtn.disabled = true;
        
        // Sign out from Firebase
        await firebase.auth().signOut();
        
        console.log('User signed out successfully');
        
        // Redirect to login page
        window.location.href = '../index.html';
        
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error signing out: ' + error.message);
        
        // Reset button state
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.textContent = originalText;
            logoutBtn.disabled = false;
        }
    }
}

// Load user data from Firestore
async function loadUserData(user) {
    try {
        // Remove loading state
        document.body.classList.remove('loading');
        
        // Update UI with user info
        document.getElementById('userName').textContent = user.displayName || 'Welcome';
        document.getElementById('userEmail').textContent = user.email;
        
        // Set user avatar
        const avatarImg = document.getElementById('avatarImg');
        if (user.photoURL) {
            avatarImg.src = user.photoURL;
        } else {
            // Default avatar if no photo
            avatarImg.src = 'https://via.placeholder.com/150/333/FFD700?text=U';
        }
        
        // Get additional user data from Firestore
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            
            // Update account status
            document.getElementById('accountStatus').textContent = 'Active';
            
            // Format and display dates
            if (userData.createdAt) {
                const memberSince = formatDate(userData.createdAt);
                document.getElementById('memberSince').textContent = memberSince;
            }
            
            if (userData.lastLogin) {
                const lastLogin = formatDate(userData.lastLogin);
                document.getElementById('lastLogin').textContent = lastLogin;
            }
        } else {
            console.log('No additional user data found in Firestore');
        }
        
    } catch (error) {
        console.error('Error loading user data:', error);
        alert('Error loading user data: ' + error.message);
    }
}

// Format Firebase timestamp
function formatDate(timestamp) {
    if (!timestamp) return '-';
    
    // Handle different timestamp formats
    let date;
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
        date = timestamp;
    } else {
        return '-';
    }
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Handle sign out (redirect if not authenticated)
function handleSignOut() {
    console.log('No user is signed in');
    
    // Redirect to login page if not authenticated
    if (window.location.pathname !== '/index.html' && 
        !window.location.pathname.endsWith('/index.html')) {
        window.location.href = '../index.html';
    }
}

// Add utility function to format dates
function formatTimestamp(timestamp) {
    if (!timestamp) return 'N/A';
    
    try {
        let date;
        if (timestamp && timestamp.toDate) {
            date = timestamp.toDate();
        } else if (timestamp instanceof Date) {
            date = timestamp;
        } else {
            return 'N/A';
        }
        
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'N/A';
    }
}
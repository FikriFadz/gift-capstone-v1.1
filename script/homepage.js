// Mobile menu toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    const mobileMenu = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (mobileMenu.style.display === 'flex') {
        mobileMenu.style.display = 'none';
        authButtons.style.display = 'none';
    } else {
        mobileMenu.style.display = 'flex';
        mobileMenu.classList.add('mobile-menu');
        authButtons.style.display = 'flex';
        authButtons.classList.add('mobile-menu');
    }
});

// Simple animation for steps on scroll
function animateOnScroll() {
    const steps = document.querySelectorAll('.step');
    
    steps.forEach(step => {
        const position = step.getBoundingClientRect();
        
        // If step is in viewport
        if(position.top < window.innerHeight - 100) {
            step.style.opacity = 1;
            step.style.transform = 'translateY(0)';
        }
    });
}

// Initialize step animations
document.querySelectorAll('.step').forEach(step => {
    step.style.opacity = 0;
    step.style.transform = 'translateY(20px)';
    step.style.transition = 'opacity 0.5s, transform 0.5s';
});

// Listen for scroll events
window.addEventListener('scroll', animateOnScroll);

// Initial call in case elements are already in view
animateOnScroll();
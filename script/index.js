// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the interactive background
    initInteractiveBackground();
    
    // Set up form switching functionality
    setupFormSwitching();
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
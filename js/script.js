/* ==========================================================================
   Kruthika R Gowdar Portfolio - Dynamic Interactions (JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. CUSTOM CURSOR GLOW
    const cursorGlow = document.getElementById('cursorGlow');
    
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    });

    // 2. MOBILE NAVIGATION MENU
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinksContainer');
    const navLinks = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('open');
        const icon = navToggle.querySelector('i');
        if (navLinksContainer.classList.contains('open')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });

    // Close mobile nav when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('open');
            navToggle.querySelector('i').className = 'fa-solid fa-bars';
        });
    });

    // Add scroll class to Navbar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. SCROLL SPY - HIGHLIGHT ACTIVE NAVIGATION LINK
    const sections = document.querySelectorAll('section');
    
    const scrollSpy = () => {
        let currentSectionId = 'hero';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // offset for fixed nav
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', scrollSpy);
    window.addEventListener('resize', scrollSpy);

    // 4. TYPEWRITER EFFECT
    const typingElement = document.getElementById('typingText');
    const roles = [
        "Machine Learning Pipelines",
        "Deep Learning Models",
        "Computer Vision Systems",
        "Full-Stack AI Applications",
        "Explainable AI Interfaces"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    const typeEffect = () => {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 50; // faster deletion
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 150; // normal typing speed
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeDelay = 2000; // pause at completion
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeDelay = 500; // pause before typing next
        }

        setTimeout(typeEffect, typeDelay);
    };

    if (typingElement) {
        setTimeout(typeEffect, 1000);
    }

    // 5. 3D CARD TILT EFFECT (Vanilla CSS/JS)
    const tiltCards = document.querySelectorAll('[data-tilt]');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x coordinate inside the element.
            const y = e.clientY - rect.top;  // y coordinate inside the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotational angles (-10 to 10 deg)
            const rotateX = ((centerY - y) / centerY) * 12;
            const rotateY = ((x - centerX) / centerX) * 12;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        });
    });

    // 6. INTERACTIVE CONSTELLATION CANVAS PARTICLES
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    };

    window.addEventListener('resize', resizeCanvas);
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.speedY = Math.random() * 0.6 - 0.3;
            this.density = (Math.random() * 30) + 1;
        }

        draw() {
            ctx.fillStyle = 'rgba(0, 242, 254, 0.4)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            // Movement physics
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off boundaries
            if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
            if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

            // Repulsion from mouse cursor
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let maxDistance = mouse.radius;
                    let force = (maxDistance - distance) / maxDistance;
                    let directionX = forceDirectionX * force * this.density * 0.2;
                    let directionY = forceDirectionY * force * this.density * 0.2;
                    
                    this.x -= directionX;
                    this.y -= directionY;
                }
            }
        }
    }

    const initParticles = () => {
        particles = [];
        let numberOfParticles = (canvas.width * canvas.height) / 13000;
        numberOfParticles = Math.min(numberOfParticles, 120); // capped for performance
        
        for (let i = 0; i < numberOfParticles; i++) {
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            particles.push(new Particle(x, y));
        }
    };

    const drawConnections = () => {
        let opacity = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 110) {
                    opacity = 1 - (distance / 110);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.25})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    };

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawConnections();
        requestAnimationFrame(animateParticles);
    };

    // Initialize Canvas
    resizeCanvas();
    animateParticles();


    // 7. WEB3FORMS CONTACT FORM AJAX SUBMISSION
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitBtnText = submitBtn.querySelector('span');
    const submitBtnIcon = submitBtn.querySelector('i');
    
    const modalOverlay = document.getElementById('modalOverlay');
    const modalIconWrap = document.getElementById('modalIconWrap');
    const modalTitle = document.getElementById('modalTitle');
    const modalText = document.getElementById('modalText');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    const showModal = (type, title, message) => {
        // Clear previous classes
        modalIconWrap.className = 'modal-icon-wrap';
        
        if (type === 'success') {
            modalIconWrap.classList.add('success');
            modalIconWrap.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        } else {
            modalIconWrap.classList.add('error');
            modalIconWrap.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
        }
        
        modalTitle.textContent = title;
        modalText.textContent = message;
        modalOverlay.classList.add('active');
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
    };

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Verify if key has been modified
            const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
            if (accessKeyInput && accessKeyInput.value === 'YOUR_ACCESS_KEY_HERE') {
                showModal(
                    'error', 
                    'Key Setup Required', 
                    'The contact form is almost ready! Please generate a free access token from web3forms.com and paste it in the index.html template file.'
                );
                return;
            }

            // Set loading state
            submitBtn.disabled = true;
            submitBtnText.textContent = 'Sending Message...';
            submitBtnIcon.className = 'fa-solid fa-circle-notch fa-spin';

            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData
                });

                const result = await response.json();

                if (response.status === 200 && result.success) {
                    showModal(
                        'success',
                        'Message Sent!',
                        'Thank you for reaching out, Kruthika has received your message and will reply as soon as possible.'
                    );
                    contactForm.reset();
                } else {
                    showModal(
                        'error',
                        'Submission Failed',
                        result.message || 'There was a problem submitting your message. Please try again.'
                    );
                }
            } catch (error) {
                console.error(error);
                showModal(
                    'error',
                    'Connection Error',
                    'Could not connect to the form server. Please check your network connection and try again.'
                );
            } finally {
                // Restore submit button
                submitBtn.disabled = false;
                submitBtnText.textContent = 'Send Message';
                submitBtnIcon.className = 'fa-solid fa-paper-plane';
            }
        });
    }
});

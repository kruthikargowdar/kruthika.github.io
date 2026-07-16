/* ==========================================================================
   Kruthika R Gowdar Portfolio - Dynamic Interactions (Three.js & Liquid Nav)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. THREE.JS 3D BACKGROUND
    const canvas = document.getElementById('particleCanvas');
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Add soft lighting to highlight 3D forms
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
        scene.add(ambientLight);
        
        const keyLight = new THREE.DirectionalLight(0xfff5f7, 0.95);
        keyLight.position.set(5, 8, 5);
        scene.add(keyLight);
        
        const fillLight = new THREE.DirectionalLight(0xf0f3ff, 0.75);
        fillLight.position.set(-5, -3, 3);
        scene.add(fillLight);

        // Geometries
        const geometries = [
            new THREE.TorusGeometry(0.8, 0.28, 16, 100),
            new THREE.ConeGeometry(0.7, 1.4, 32),
            new THREE.SphereGeometry(0.7, 32, 32),
            new THREE.DodecahedronGeometry(0.8),
            new THREE.TorusKnotGeometry(0.5, 0.16, 100, 16)
        ];

        // Pastel Colors
        const pastelColors = [
            0xffccd5, // pastel pink
            0xd8e2dc, // sage green
            0xffcad4, // pastel rose
            0xb3c5ff, // pastel lavender blue
            0xffe5d9, // pastel peach
            0xdfccfb  // pastel lilac
        ];

        const shapes = [];
        const count = 18;

        for (let i = 0; i < count; i++) {
            const geom = geometries[Math.floor(Math.random() * geometries.length)];
            const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
            const mat = new THREE.MeshPhongMaterial({
                color: color,
                shininess: 90,
                specular: 0xffffff,
                flatShading: true
            });
            const mesh = new THREE.Mesh(geom, mat);
            
            // Randomly position inside viewport space
            mesh.position.x = (Math.random() - 0.5) * 15;
            mesh.position.y = (Math.random() - 0.5) * 11;
            mesh.position.z = -Math.random() * 8 - 1; // spread behind content
            
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            
            // Add custom animation parameters
            mesh.floatSpeed = Math.random() * 0.003 + 0.001;
            mesh.spinSpeedX = Math.random() * 0.008 - 0.004;
            mesh.spinSpeedY = Math.random() * 0.008 - 0.004;
            mesh.initialY = mesh.position.y;
            mesh.floatOffset = Math.random() * Math.PI * 2;
            
            scene.add(mesh);
            shapes.push(mesh);
        }

        camera.position.z = 7;

        // Mouse tracking for 3D parallax shifts
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
            mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        });

        const clock = new THREE.Clock();

        const animateScene = () => {
            requestAnimationFrame(animateScene);
            
            const elapsed = clock.getElapsedTime();
            
            // Smoothly interpolate camera position based on mouse position
            targetX = mouseX * 0.8;
            targetY = -mouseY * 0.8;
            
            camera.position.x += (targetX - camera.position.x) * 0.04;
            camera.position.y += (targetY - camera.position.y) * 0.04;
            camera.lookAt(scene.position);
            
            // Animate floating structures
            shapes.forEach(shape => {
                shape.rotation.x += shape.spinSpeedX;
                shape.rotation.y += shape.spinSpeedY;
                shape.position.y = shape.initialY + Math.sin(elapsed * 0.8 + shape.floatOffset) * 0.4;
            });
            
            renderer.render(scene, camera);
        };

        animateScene();

        // Handle viewport resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // 2. LIQUID ACTIVE NAVBAR SLIDER INDICATOR
    const navLinksContainer = document.getElementById('navLinksContainer');
    const navIndicator = document.getElementById('navIndicator');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateIndicator = (activeLink) => {
        if (!activeLink || window.innerWidth <= 900) {
            navIndicator.style.width = '0px';
            return;
        }
        const rect = activeLink.getBoundingClientRect();
        const parentRect = navLinksContainer.getBoundingClientRect();
        
        navIndicator.style.width = `${rect.width}px`;
        navIndicator.style.left = `${rect.left - parentRect.left}px`;
    };

    // Initialize indicator position
    setTimeout(() => {
        const activeLink = document.querySelector('.nav-link.active');
        updateIndicator(activeLink);
    }, 200);

    // Update indicator when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            updateIndicator(link);
        });
    });

    // Re-align indicator on screen resizing
    window.addEventListener('resize', () => {
        const activeLink = document.querySelector('.nav-link.active');
        updateIndicator(activeLink);
    });

    // 3. SCROLL SPY - HIGHLIGHT ACTIVE NAVIGATION LINK
    const sections = document.querySelectorAll('section');
    
    const scrollSpy = () => {
        let currentSectionId = 'hero';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150; // offset for floating nav
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                if (!link.classList.contains('active')) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    updateIndicator(link);
                }
            }
        });
    };

    window.addEventListener('scroll', scrollSpy);

    // 4. CUSTOM CURSOR GLOW
    const cursorGlow = document.getElementById('cursorGlow');
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    });

    // 5. MOBILE NAVIGATION DOCK TOGGLE
    const navToggle = document.getElementById('navToggle');
    navToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('open');
        const icon = navToggle.querySelector('i');
        if (navLinksContainer.classList.contains('open')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('open');
            navToggle.querySelector('i').className = 'fa-solid fa-bars';
        });
    });

    // 6. TYPEWRITER EFFECT
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
            typeDelay = 55;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 130;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeDelay = 2200;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeDelay = 400;
        }

        setTimeout(typeEffect, typeDelay);
    };

    if (typingElement) {
        setTimeout(typeEffect, 800);
    }

    // 7. 3D CARD TILT WITH PERSPECTIVE DEPTH
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((centerY - y) / centerY) * 15;
            const rotateY = ((x - centerX) / centerX) * 15;
            
            card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        });
    });

    // 8. WEB3FORMS CONTACT FORM SUBMISSION
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

            const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
            if (accessKeyInput && accessKeyInput.value === 'YOUR_ACCESS_KEY_HERE') {
                showModal(
                    'error', 
                    'Key Setup Required', 
                    'The contact form is almost ready! Please generate a free access token from web3forms.com and paste it in the index.html template file.'
                );
                return;
            }

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
                submitBtn.disabled = false;
                submitBtnText.textContent = 'Send Message';
                submitBtnIcon.className = 'fa-solid fa-paper-plane';
            }
        });
    }
});

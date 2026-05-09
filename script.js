// ==========================================
// 3D Background with Three.js
// ==========================================
let scene, camera, renderer, particles;

function init3DBackground() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    // Renderer
    const canvas = document.getElementById('bg-canvas');
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Particle geometry
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Particle material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x6366f1,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    // Particle mesh
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Add geometric shapes
    addGeometricShapes();

    // Animation
    animate3D();
}

function addGeometricShapes() {
    // Add floating geometric shapes
    const shapes = [];
    
    // Torus
    const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(-30, 20, -20);
    scene.add(torus);
    shapes.push(torus);

    // Icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(8, 0);
    const icoMaterial = new THREE.MeshBasicMaterial({
        color: 0xec4899,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    icosahedron.position.set(30, -20, -30);
    scene.add(icosahedron);
    shapes.push(icosahedron);

    // Octahedron
    const octaGeometry = new THREE.OctahedronGeometry(6);
    const octaMaterial = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
    octahedron.position.set(0, 30, -40);
    scene.add(octahedron);
    shapes.push(octahedron);

    return shapes;
}

function animate3D() {
    requestAnimationFrame(animate3D);

    // Rotate particles
    particles.rotation.x += 0.0003;
    particles.rotation.y += 0.0005;

    // Rotate shapes
    scene.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
            child.rotation.x += 0.002;
            child.rotation.y += 0.003;
            child.rotation.z += 0.001;
        }
    });

    // Mouse parallax effect
    if (window.mouseX !== undefined && window.mouseY !== undefined) {
        camera.position.x += (window.mouseX * 0.05 - camera.position.x) * 0.05;
        camera.position.y += (window.mouseY * -0.05 - camera.position.y) * 0.05;
    }

    renderer.render(scene, camera);
}

// ==========================================
// 2D Particle System
// ==========================================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.opacity = Math.random() * 0.5 + 0.3;
        particlesContainer.appendChild(particle);
    }
}

// ==========================================
// Header & Navigation
// ==========================================
function initHeader() {
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Update active nav link
        updateActiveNav();

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        const icon = mobileToggle.querySelector('i');
        if (navMenu.classList.contains('show')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
            const icon = mobileToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ==========================================
// Mouse Parallax Effect
// ==========================================
function initParallax() {
    document.addEventListener('mousemove', (e) => {
        window.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        window.mouseY = (e.clientY / window.innerHeight) * 2 - 1;

        // Parallax for hero elements
        const heroText = document.querySelector('.hero-text');
        const heroImage = document.querySelector('.hero-image');

        if (heroText && heroImage) {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

            heroText.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
            heroImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }

        // Parallax for floating icons
        const techOrbs = document.querySelectorAll('.tech-orb');
        techOrbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.02;
            const moveX = (e.clientX - window.innerWidth / 2) * speed;
            const moveY = (e.clientY - window.innerHeight / 2) * speed;
            orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

// ==========================================
// Counter Animation
// ==========================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        // Start animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
}

// ==========================================
// Scroll Animations
// ==========================================
function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('[data-scroll]');

    const elementInView = (el, offset = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        return elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset;
    };

    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el)) {
                displayScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation(); // Initial check
}

// ==========================================
// Projects
// ==========================================
const projects = [
    {
        title: "OncoAI – Breast Cancer Detection System",
        description: "Engineered a deep learning solution using Vision Transformers and transfer learning to classify histopathological images. Improved model accuracy to 91% through data preprocessing, augmentation, and fine-tuning techniques.",
        tags: ["Python", "Vision Transformers", "Deep Learning", "PyTorch"],
        category: "ml",
        icon: "fas fa-brain"
    },
    {
        title: "EchoSphere – Deepfake Audio Detection System",
        description: "Built a real-time deepfake detection system using ECAPA-TDNN embeddings and MLP classifier. Integrated SHAP explainability to provide interpretable predictions. Designed and deployed backend using FastAPI.",
        tags: ["Python", "FastAPI", "SHAP", "Machine Learning"],
        category: "ml",
        icon: "fas fa-microphone"
    },
    {
        title: "Student Placement Predictor",
        description: "Developed a machine learning model using logistic regression to predict placement outcomes. Implemented SHAP-based explainability for feature importance analysis. Designed an interactive Streamlit-based UI.",
        tags: ["Python", "Streamlit", "Scikit-learn", "SHAP"],
        category: "ml",
        icon: "fas fa-chart-line"
    },
    {
        title: "Personal Portfolio Website",
        description: "Designed and developed a responsive personal portfolio using HTML, CSS, and JavaScript. Features smooth animations, 3D effects, glassmorphism design, and responsive layout. Deployed using GitHub Pages.",
        tags: ["HTML", "CSS", "JavaScript", "Three.js"],
        category: "web",
        icon: "fas fa-laptop-code"
    }
];

function displayProjects(filter = 'all') {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '';

    const filteredProjects = filter === 'all' 
        ? projects 
        : projects.filter(project => project.category === filter);

    filteredProjects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card glass-card';
        projectCard.setAttribute('data-scroll', '');
        projectCard.style.setProperty('--delay', `${index * 0.1}s`);

        projectCard.innerHTML = `
            <div class="project-info">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, var(--primary), var(--accent)); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: white;">
                        <i class="${project.icon}"></i>
                    </div>
                    <h3>${project.title}</h3>
                </div>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;

        projectsGrid.appendChild(projectCard);
    });

    // Reinitialize scroll animations for new elements
    initScrollAnimations();
}

function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Filter projects
            const filter = button.getAttribute('data-filter');
            displayProjects(filter);
        });
    });
}

// ==========================================
// 3D Card Tilt Effect
// ==========================================
function init3DCardEffect() {
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// ==========================================
// EmailJS Integration
// ==========================================
function sendEmail(event) {
    event.preventDefault();

    const form = document.getElementById("contact-form");
    const messageBox = document.getElementById("form-message");
    const submitBtn = form.querySelector('button[type="submit"]');

    // Disable button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';

    emailjs.sendForm(
        "service_7784e76",
        "template_1nkw3gf",
        form
    )
    .then(() => {
        messageBox.innerHTML = "✅ Message sent successfully!";
        messageBox.style.color = "#10b981";
        form.reset();
        
        // Re-enable button
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i><div class="btn-glow"></div>';
            messageBox.innerHTML = '';
        }, 3000);
    })
    .catch((error) => {
        console.error(error);
        messageBox.innerHTML = "❌ Failed to send message. Please try again.";
        messageBox.style.color = "#ef4444";
        
        // Re-enable button
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i><div class="btn-glow"></div>';
        }, 3000);
    });
}

// ==========================================
// Typing Effect
// ==========================================
function initTypingEffect() {
    const roles = [
        "AI/ML Engineer",
        "Full Stack Developer",
        "Computer Science Student",
        "Problem Solver"
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDuration = 2000;

    const roleElements = document.querySelectorAll('.role-item');
    
    function type() {
        if (roleIndex >= roles.length) {
            roleIndex = 0;
        }

        const currentRole = roles[roleIndex];
        const currentElement = roleElements[roleIndex % roleElements.length];

        if (!isDeleting && charIndex <= currentRole.length) {
            currentElement.textContent = currentRole.substring(0, charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else if (isDeleting && charIndex >= 0) {
            currentElement.textContent = currentRole.substring(0, charIndex);
            charIndex--;
            setTimeout(type, deletingSpeed);
        } else if (!isDeleting && charIndex === currentRole.length + 1) {
            isDeleting = true;
            setTimeout(type, pauseDuration);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex++;
            setTimeout(type, 500);
        }
    }

    // Start typing effect after a delay
    setTimeout(type, 1000);
}

// ==========================================
// Cursor Trail Effect
// ==========================================
function initCursorTrail() {
    const coords = { x: 0, y: 0 };
    const circles = [];
    const colors = ['#6366f1', '#8b5cf6', '#ec4899'];

    // Create circles
    for (let i = 0; i < 20; i++) {
        const circle = document.createElement('div');
        circle.style.position = 'fixed';
        circle.style.width = '10px';
        circle.style.height = '10px';
        circle.style.borderRadius = '50%';
        circle.style.pointerEvents = 'none';
        circle.style.zIndex = '9999';
        circle.style.backgroundColor = colors[i % colors.length];
        circle.style.opacity = '0';
        circle.style.transition = 'opacity 0.3s';
        document.body.appendChild(circle);
        circles.push(circle);
    }

    document.addEventListener('mousemove', (e) => {
        coords.x = e.clientX;
        coords.y = e.clientY;
    });

    function animateCircles() {
        let x = coords.x;
        let y = coords.y;

        circles.forEach((circle, index) => {
            circle.style.left = x - 5 + 'px';
            circle.style.top = y - 5 + 'px';
            circle.style.opacity = (20 - index) / 20;
            circle.style.transform = `scale(${(20 - index) / 20})`;

            const nextCircle = circles[index + 1] || circles[0];
            x += (parseInt(nextCircle.style.left || 0) - x) * 0.3;
            y += (parseInt(nextCircle.style.top || 0) - y) * 0.3;
        });

        requestAnimationFrame(animateCircles);
    }

    animateCircles();
}

// ==========================================
// Window Resize Handler
// ==========================================
function handleResize() {
    if (renderer && camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// ==========================================
// Page Load Animation
// ==========================================
function initPageLoad() {
    document.body.style.opacity = '0';
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.style.transition = 'opacity 1s ease';
            document.body.style.opacity = '1';
        }, 100);
    });
}

// ==========================================
// Initialize Everything
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfolio Initialized');

    // Set current year
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Initialize all features
    init3DBackground();
    createParticles();
    initHeader();
    initParallax();
    animateCounters();
    initScrollAnimations();
    displayProjects();
    initProjectFilters();
    init3DCardEffect();
    // initCursorTrail(); // Optional - can be enabled for extra effect
    initPageLoad();

    // Window resize
    window.addEventListener('resize', handleResize);

    console.log('✨ All animations loaded successfully!');
});

// ==========================================
// Performance Optimization
// ==========================================
// Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
const throttledScroll = throttle(() => {
    initScrollAnimations();
}, 100);

window.addEventListener('scroll', throttledScroll);

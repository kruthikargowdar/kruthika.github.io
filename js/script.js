/* ==========================================================================
   KruthikaOS - Desktop Interactions (Three.js 3D Core, Dragging, Terminal)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SYSTEM CLOCK
    const systemTime = document.getElementById('systemTime');
    const updateClock = () => {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        systemTime.textContent = `${hours}:${minutes} ${ampm}`;
    };
    updateClock();
    setInterval(updateClock, 60000);

    // 2. THREE.JS 3D BACKGROUND AND PARTICLE CORE
    const canvas = document.getElementById('particleCanvas');
    let particleMesh, shapes = [];
    let coreScale = 1.0;
    let targetCoreScale = 1.0;

    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Add soft lighting to highlight 3D forms
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        
        const keyLight = new THREE.DirectionalLight(0xfff5f7, 0.9);
        keyLight.position.set(5, 8, 5);
        scene.add(keyLight);
        
        const fillLight = new THREE.DirectionalLight(0xf0f3ff, 0.7);
        fillLight.position.set(-5, -3, 3);
        scene.add(fillLight);

        // Geometries
        const geometries = [
            new THREE.TorusGeometry(0.7, 0.25, 16, 100),
            new THREE.ConeGeometry(0.6, 1.2, 32),
            new THREE.SphereGeometry(0.6, 32, 32),
            new THREE.DodecahedronGeometry(0.75),
            new THREE.TorusKnotGeometry(0.45, 0.14, 100, 16)
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

        // Floating Shapes
        const count = 15;
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
            
            mesh.position.x = (Math.random() - 0.5) * 16;
            mesh.position.y = (Math.random() - 0.5) * 12;
            mesh.position.z = -Math.random() * 8 - 2;
            
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            
            mesh.floatSpeed = Math.random() * 0.003 + 0.001;
            mesh.spinSpeedX = Math.random() * 0.006 - 0.003;
            mesh.spinSpeedY = Math.random() * 0.006 - 0.003;
            mesh.initialY = mesh.position.y;
            mesh.floatOffset = Math.random() * Math.PI * 2;
            
            scene.add(mesh);
            shapes.push(mesh);
        }

        // Particle Core
        const particleGeo = new THREE.BufferGeometry();
        const particleCount = 1200;
        const posArray = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            // Generate a spherical shell distribution
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const r = 2.4; // radius
            
            posArray[i] = r * Math.sin(phi) * Math.cos(theta); // x
            posArray[i+1] = r * Math.sin(phi) * Math.sin(theta); // y
            posArray[i+2] = r * Math.cos(phi); // z
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particleMat = new THREE.PointsMaterial({
            size: 0.05,
            color: 0x6c5ce7, // lavender
            transparent: true,
            opacity: 0.8
        });

        particleMesh = new THREE.Points(particleGeo, particleMat);
        scene.add(particleMesh);

        camera.position.z = 7.5;

        // Mouse tracking for parallax
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
            mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        });

        // Trigger Explosion Pulse on Desktop Double/Single Clicks
        document.getElementById('desktop').addEventListener('click', (e) => {
            if (e.target === document.getElementById('desktop') || e.target.classList.contains('core-dashboard')) {
                targetCoreScale = 1.8; // explode scale
            }
        });

        const clock = new THREE.Clock();

        const animateScene = () => {
            requestAnimationFrame(animateScene);
            
            const elapsed = clock.getElapsedTime();
            
            // Smoothly shift camera
            targetX = mouseX * 0.7;
            targetY = -mouseY * 0.7;
            camera.position.x += (targetX - camera.position.x) * 0.04;
            camera.position.y += (targetY - camera.position.y) * 0.04;
            camera.lookAt(scene.position);
            
            // Floating shapes
            shapes.forEach(shape => {
                shape.rotation.x += shape.spinSpeedX;
                shape.rotation.y += shape.spinSpeedY;
                shape.position.y = shape.initialY + Math.sin(elapsed * 0.8 + shape.floatOffset) * 0.45;
            });

            // Core particle spin & scale spring effect
            if (particleMesh) {
                particleMesh.rotation.y += 0.005;
                particleMesh.rotation.x += 0.002;
                
                // Spring physics
                coreScale += (targetCoreScale - coreScale) * 0.08;
                if (coreScale > 1.7) {
                    targetCoreScale = 1.0; // collapse back
                }
                particleMesh.scale.set(coreScale, coreScale, coreScale);
            }
            
            renderer.render(scene, camera);
        };
        animateScene();

        // Viewport resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // 3. WINDOW MANAGEMENT SYSTEM
    let highestZIndex = 100;
    const windows = document.querySelectorAll('.window');

    const openApp = (appName) => {
        const win = document.getElementById(`window-${appName}`);
        if (win) {
            highestZIndex++;
            win.style.zIndex = highestZIndex;
            win.classList.add('active');
            
            // Focus on terminal input if terminal is opened
            if (appName === 'terminal') {
                setTimeout(() => document.getElementById('terminalInputField').focus(), 150);
            }
        }
    };

    const closeApp = (appName) => {
        const win = document.getElementById(`window-${appName}`);
        if (win) {
            win.classList.remove('active');
        }
    };

    // Desktop Icon Listeners
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const app = icon.getAttribute('data-app');
            if (app) {
                e.preventDefault();
                openApp(app);
            }
        });
    });

    // Launch Dock Item Listeners
    document.querySelectorAll('.dock-item').forEach(item => {
        item.addEventListener('click', () => {
            const app = item.getAttribute('data-app');
            if (app) openApp(app);
        });
    });

    // Window controls (close, minimize, maximize)
    document.querySelectorAll('.control-btn.close').forEach(btn => {
        btn.addEventListener('click', () => {
            const app = btn.getAttribute('data-app');
            closeApp(app);
        });
    });

    document.querySelectorAll('.control-btn.minimize').forEach(btn => {
        btn.addEventListener('click', () => {
            const app = btn.getAttribute('data-app');
            closeApp(app);
        });
    });

    document.querySelectorAll('.control-btn.maximize').forEach(btn => {
        btn.addEventListener('click', () => {
            const win = btn.closest('.window');
            win.classList.toggle('maximized');
            if (win.classList.contains('maximized')) {
                win.style.width = '100vw';
                win.style.height = 'calc(100vh - 30px)';
                win.style.top = '0';
                win.style.left = '0';
            } else {
                win.style.width = '';
                win.style.height = '';
                win.style.top = '';
                win.style.left = '';
            }
        });
    });

    // Clicking a window brings it to front
    windows.forEach(win => {
        win.addEventListener('mousedown', () => {
            highestZIndex++;
            win.style.zIndex = highestZIndex;
        });
    });

    // 4. WINDOW DRAG PHYSICS (WITH INERTIAL 3D TILT)
    const makeWindowDraggable = (win) => {
        const header = win.querySelector('.window-header');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        header.addEventListener('mousedown', (e) => {
            // Check if user clicked a button
            if (e.target.classList.contains('control-btn')) return;
            
            highestZIndex++;
            win.style.zIndex = highestZIndex;
            win.classList.add('dragging');
            
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            document.addEventListener('mouseup', closeDragElement);
            document.addEventListener('mousemove', elementDrag);
        });

        const elementDrag = (e) => {
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            // Calculate drag velocity for 3D tilt
            const tiltX = Math.min(Math.max(pos2 * 1.5, -15), 15);
            const tiltY = Math.min(Math.max(-pos1 * 1.5, -15), 15);
            win.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            
            win.style.top = `${win.offsetTop - pos2}px`;
            win.style.left = `${win.offsetLeft - pos1}px`;
        };

        const closeDragElement = () => {
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('mousemove', elementDrag);
            win.classList.remove('dragging');
            win.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)'; // reset
        };
    };

    windows.forEach(win => makeWindowDraggable(win));

    // 5. TERMINAL ENGINE
    const terminalHistory = document.getElementById('terminalHistory');
    const terminalInputField = document.getElementById('terminalInputField');
    
    // Command Parser
    const parseCommand = (input) => {
        const cmd = input.trim().toLowerCase();
        let output = '';
        
        switch(cmd) {
            case 'help':
                output = `Available System Commands:<br>
                - <span class="term-highlight">about</span> : Show professional summary<br>
                - <span class="term-highlight">skills</span> : List technical capabilities<br>
                - <span class="term-highlight">projects</span> : View engineered applications<br>
                - <span class="term-highlight">contact</span> : Show mailing & social pathways<br>
                - <span class="term-highlight">clear</span> : Reset screen logs<br>
                - <span class="term-highlight">sudo hack</span> : Initiate core override`;
                break;
            case 'about':
                output = `Kruthika R Gowdar - Computer Science graduate (B.E., CGPA 8.5) specializing in Python development, Machine Learning/AI, and DevOps fundamentals. Experienced in building and deploying end-to-end ML pipelines, REST APIs, and containerized web applications using Python, PyTorch, and FastAPI. Seeking entry-level opportunities as a Software Engineer, Python Developer, or AI/ML Engineer.`;
                break;
            case 'skills':
                output = `LANGUAGES : Python, SQL<br>
                WEB & API : HTML, CSS, REST API, FastAPI, Flask, Streamlit<br>
                ML / AI   : Machine Learning, Deep Learning, Computer Vision, NLP, Transfer Learning, Model Deployment<br>
                LIBRARIES : PyTorch, Scikit-learn, Pandas, NumPy, SHAP<br>
                DEVOPS    : Docker, Jenkins, CI/CD, Kubernetes, Prometheus, Grafana, Git, GitHub, Agile`;
                break;
            case 'projects':
                output = `1. <span class="term-highlight">OncoAI</span> : Breast Cancer Detection using Vision Transformers (ViTs) and PyTorch (91% Accuracy).<br>
                2. <span class="term-highlight">EchoSphere</span> : Real-time Deepfake Audio Detection system with FastAPI, ECAPA-TDNN, and Docker.<br>
                3. <span class="term-highlight">AI Resume Analyzer</span> : Containerized Flask app with Jenkins CI/CD, Kubernetes deployment, and Prometheus/Grafana monitoring.<br>
                4. <span class="term-highlight">KruthikaOS</span> : Glassmorphic 3D Desktop portfolio system written in HTML/CSS/JS with Three.js.`;
                break;
            case 'contact':
                output = `Email    : kruthikargowdar12@gmail.com<br>
                Phone    : +91 7892345542<br>
                LinkedIn : linkedin.com/in/kruthikar-gowdar-4a4175325<br>
                GitHub   : github.com/kruthikargowdar`;
                break;
            case 'clear':
                terminalHistory.innerHTML = '';
                return;
            case 'sudo hack':
                startHackerSimulation();
                return;
            default:
                output = `bash: command not found: ${cmd}. Type <span class="term-highlight">help</span> for commands.`;
        }
        
        appendLine(output);
    };

    const appendLine = (text, type = 'output') => {
        const line = document.createElement('p');
        line.className = `terminal-line ${type}`;
        line.innerHTML = text;
        terminalHistory.appendChild(line);
        terminalHistory.scrollTop = terminalHistory.scrollHeight;
    };

    // Hacker simulation easter egg
    const startHackerSimulation = () => {
        appendLine("Accessing system core...", "error");
        setTimeout(() => appendLine("Bypassing firewalls...", "error"), 500);
        setTimeout(() => appendLine("Injecting custom node payloads...", "error"), 1000);
        
        setTimeout(() => {
            let count = 0;
            const hackInterval = setInterval(() => {
                const randomBinary = Array.from({length: 45}, () => Math.floor(Math.random()*2)).join('');
                appendLine(randomBinary, "output");
                count++;
                if (count > 25) {
                    clearInterval(hackInterval);
                    appendLine("HACK COMPLETE. CORE TEMPERATURE OVERHEATING. REBOOTING SYSTEM...", "error");
                    targetCoreScale = 3.0; // HUGE explosion scale
                    setTimeout(() => {
                        targetCoreScale = 1.0;
                        terminalHistory.innerHTML = '';
                        appendLine("Welcome to KruthikaOS Terminal v2.0", "welcome");
                        appendLine("Type <span class=\"term-highlight\">help</span> to list system commands.", "welcome");
                    }, 2000);
                }
            }, 80);
        }, 1500);
    };

    if (terminalInputField) {
        terminalInputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = terminalInputField.value;
                appendLine(`kruthika@gm-tech:~$ ${val}`, "welcome");
                parseCommand(val);
                terminalInputField.value = '';
            }
        });
    }

    // 6. macOS DOCK FISHEYE ZOOM EFFECT
    const dockItems = document.querySelectorAll('.dock-item');
    dockItems.forEach((item, index) => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            // Scale hovered item
            item.style.transform = `scale(1.4) translateY(-12px)`;
            
            // Scale adjacent items
            if (dockItems[index - 1]) {
                dockItems[index - 1].style.transform = `scale(1.18) translateY(-6px)`;
            }
            if (dockItems[index + 1]) {
                dockItems[index + 1].style.transform = `scale(1.18) translateY(-6px)`;
            }
        });
        
        item.addEventListener('mouseleave', () => {
            dockItems.forEach(i => i.style.transform = 'scale(1) translateY(0)');
        });
    });

    // 7. 3D PROJECT CARD TILT PARALLAX
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((centerY - y) / centerY) * 14;
            const rotateY = ((x - centerX) / centerX) * 14;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        });
    });

    // 8. CUSTOM CURSOR GLOW
    const cursorGlow = document.getElementById('cursorGlow');
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    });

    // 9. WEB3FORMS CONTACT FORM AJAX SUBMISSION
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
            submitBtnText.textContent = 'Sending...';
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
                submitBtnText.textContent = 'Send Mail';
                submitBtnIcon.className = 'fa-solid fa-paper-plane';
            }
        });
    }

    // Auto open "About" window at load to greet visitors
    setTimeout(() => openApp('about'), 1200);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Parallax effect for hero background
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    document.querySelector('.hero-bg').style.transform = 'translateY(' + rate + 'px)';
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-card').forEach(card => {
    observer.observe(card);
});

// Particle effect for background
function createParticles() {
    const hero = document.querySelector('.hero');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        hero.appendChild(particle);
    }
}

createParticles();

// Mouse follow effect
document.addEventListener('mousemove', (e) => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    document.body.appendChild(cursor);
    
    setTimeout(() => {
        cursor.remove();
    }, 100);
});

// Typing effect for hero text
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

const heroText = document.querySelector('.hero-content h2');
setTimeout(() => {
    typeWriter(heroText, 'Connecting the Future');
}, 1000);

// Service cards hover effect
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05) rotateY(5deg)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1) rotateY(0deg)';
    });
});

// Floating elements animation
function animateFloatingElements() {
    const elements = document.querySelectorAll('.element');
    elements.forEach((element, index) => {
        element.style.animation = `float 4s ease-in-out infinite ${index * 0.5}s`;
    });
}

animateFloatingElements();

// Network nodes connection animation
function connectNodes() {
    const nodes = document.querySelectorAll('.node');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    
    document.querySelector('.network-nodes').appendChild(svg);
    
    // Create connections between nodes
    for (let i = 0; i < nodes.length - 1; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', nodes[i].offsetLeft + 10);
        line.setAttribute('y1', nodes[i].offsetTop + 10);
        line.setAttribute('x2', nodes[i + 1].offsetLeft + 10);
        line.setAttribute('y2', nodes[i + 1].offsetTop + 10);
        line.setAttribute('stroke', '#00ff88');
        line.setAttribute('stroke-width', '2');
        line.style.opacity = '0.5';
        line.style.animation = 'pulse 2s infinite';
        svg.appendChild(line);
    }
}

setTimeout(connectNodes, 2000);

// Pulse animation for connections
const style = document.createElement('style');
style.textContent = `
@keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
}
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
}
.particle {
    position: absolute;
    width: 2px;
    height: 2px;
    background: #00ff88;
    border-radius: 50%;
    animation: particleFloat 10s linear infinite;
}
@keyframes particleFloat {
    0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
}
.cursor-glow {
    position: fixed;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, rgba(0, 255, 136, 0.5) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    animation: cursorFade 0.1s ease-out;
}
@keyframes cursorFade {
    to { opacity: 0; transform: scale(2); }
}
`;
document.head.appendChild(style);

// Fetch services from backend and populate service cards
async function fetchServices() {
    try {
        const response = await fetch('http://localhost:3001/api/services');
        const services = await response.json();
        const serviceCardsContainer = document.querySelector('.service-cards');
        serviceCardsContainer.innerHTML = ''; // Clear existing static cards

        services.forEach(service => {
            const card = document.createElement('div');
            card.className = 'card animate-card';
            card.innerHTML = `
                <h3>${service.name}</h3>
                <p>${service.description}</p>
            `;
            serviceCardsContainer.appendChild(card);
        });

        // Re-apply animations to new cards
        document.querySelectorAll('.animate-card').forEach(card => {
            observer.observe(card);
        });
    } catch (error) {
        console.error('Error fetching services:', error);
    }
}

// Handle contact form submission
async function submitContactForm(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('http://localhost:3001/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        const messageElement = document.getElementById('form-message');
        if (response.ok) {
            messageElement.textContent = 'Message sent successfully!';
            messageElement.style.color = 'green';
            form.reset();
        } else {
            messageElement.textContent = result.error || 'Failed to send message.';
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Error submitting contact form:', error);
        document.getElementById('form-message').textContent = 'An error occurred. Please try again.';
        document.getElementById('form-message').style.color = 'red';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchServices();
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', submitContactForm);
    }
});

// Dark/Light Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
let isLightMode = false;

themeToggle.addEventListener('click', () => {
    isLightMode = !isLightMode;
    document.body.classList.toggle('light-mode');
    themeToggle.textContent = isLightMode ? '🌙' : '☀️';

    // Insane transition effect
    document.body.style.transition = 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 1000);

    // Create exploding particles on toggle
    createExplosion(themeToggle.offsetLeft + 25, themeToggle.offsetTop + 25);
});

// Portfolio Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');

        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter items
        portfolioItems.forEach(item => {
            if (filter === 'all' || item.classList.contains(filter)) {
                item.style.display = 'block';
                item.style.animation = 'slideUp 0.5s ease-out forwards';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Contract Form Submission
async function submitContractForm(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('http://localhost:3001/api/contracts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        const messageElement = document.getElementById('contract-message');
        if (response.ok) {
            messageElement.textContent = 'Contract inquiry submitted successfully!';
            messageElement.style.color = '#00ff88';
            form.reset();

            // Insane success animation
            createExplosion(form.offsetLeft + form.offsetWidth / 2, form.offsetTop + form.offsetHeight / 2);
        } else {
            messageElement.textContent = result.error || 'Failed to submit inquiry.';
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Error submitting contract form:', error);
        document.getElementById('contract-message').textContent = 'An error occurred. Please try again.';
        document.getElementById('contract-message').style.color = 'red';
    }
}

// Draggable Network Map (simplified)
function createDraggableMap() {
    const heroBg = document.querySelector('.hero-bg');
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;

    heroBg.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - heroBg.offsetLeft;
        startY = e.pageY - heroBg.offsetTop;
        scrollLeft = heroBg.scrollLeft;
        scrollTop = heroBg.scrollTop;
    });

    heroBg.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    heroBg.addEventListener('mouseup', () => {
        isDragging = false;
    });

    heroBg.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - heroBg.offsetLeft;
        const y = e.pageY - heroBg.offsetTop;
        const walkX = (x - startX) * 2;
        const walkY = (y - startY) * 2;
        heroBg.scrollLeft = scrollLeft - walkX;
        heroBg.scrollTop = scrollTop - walkY;
    });
}

// Voice-Activated Search (basic implementation)
function initVoiceSearch() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        const voiceBtn = document.createElement('button');
        voiceBtn.textContent = '🎤';
        voiceBtn.className = 'voice-btn';
        voiceBtn.style.position = 'fixed';
        voiceBtn.style.bottom = '20px';
        voiceBtn.style.right = '20px';
        voiceBtn.style.zIndex = '1000';
        document.body.appendChild(voiceBtn);

        voiceBtn.addEventListener('click', () => {
            recognition.start();
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            if (transcript.includes('home')) {
                document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
            } else if (transcript.includes('services')) {
                document.querySelector('#services').scrollIntoView({ behavior: 'smooth' });
            } else if (transcript.includes('about')) {
                document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
            } else if (transcript.includes('contracts')) {
                document.querySelector('#contracts').scrollIntoView({ behavior: 'smooth' });
            } else if (transcript.includes('portfolio')) {
                document.querySelector('#portfolio').scrollIntoView({ behavior: 'smooth' });
            } else if (transcript.includes('contact')) {
                document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
            }
        };
    }
}

// AR-like Previews (simplified with 3D transforms)
function addARPreviews() {
    const cards = document.querySelectorAll('.card, .plan, .portfolio-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'perspective(1000px) rotateY(10deg) rotateX(10deg) scale(1.1)';
            card.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
        });
    });
}

// Enhanced Particle System
function createExplosion(x, y) {
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.setProperty('--x', (Math.random() - 0.5) * 200 + 'px');
        particle.style.setProperty('--y', (Math.random() - 0.5) * 200 + 'px');
        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// Liquid Blob Backgrounds
function addLiquidBlobs() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        for (let i = 0; i < 3; i++) {
            const blob = document.createElement('div');
            blob.className = 'blob animate-morph';
            blob.style.left = Math.random() * 100 + '%';
            blob.style.top = Math.random() * 100 + '%';
            blob.style.animationDelay = Math.random() * 5 + 's';
            section.appendChild(blob);
        }
    });
}

// Enhanced Mouse Follow Effect
document.addEventListener('mousemove', (e) => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    document.body.appendChild(cursor);

    // Add multiple trailing effects
    for (let i = 1; i <= 3; i++) {
        setTimeout(() => {
            const trail = document.createElement('div');
            trail.className = 'cursor-glow';
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            trail.style.opacity = '0.' + i;
            trail.style.transform = 'scale(' + (1 - i * 0.2) + ')';
            document.body.appendChild(trail);
            setTimeout(() => trail.remove(), 100);
        }, i * 50);
    }

    setTimeout(() => {
        cursor.remove();
    }, 100);
});

// Responsive adjustments
function handleResize() {
    const hero = document.querySelector('.hero');
    if (window.innerWidth < 768) {
        hero.style.height = '80vh';
    } else {
        hero.style.height = '100vh';
    }
}

window.addEventListener('resize', handleResize);
handleResize();

// Testimonials Slider
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');

function showTestimonial(index) {
    testimonials.forEach(testimonial => testimonial.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    currentTestimonial = index;
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}

function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentTestimonial);
}

document.querySelector('.slider-btn.next').addEventListener('click', nextTestimonial);
document.querySelector('.slider-btn.prev').addEventListener('click', prevTestimonial);

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showTestimonial(index));
});

// Auto-slide testimonials
setInterval(nextTestimonial, 5000);

// Morphing Service Icons
function morphIcons() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('h3');
            icon.style.animation = 'morphText 0.5s ease-in-out';
        });
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('h3');
            icon.style.animation = '';
        });
    });
}

// Interactive Data Flow
function createDataFlow() {
    const nodes = document.querySelectorAll('.node');
    const svg = document.querySelector('.network-nodes svg') || document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';

    if (!document.querySelector('.network-nodes svg')) {
        document.querySelector('.network-nodes').appendChild(svg);
    }

    // Create animated data packets
    function createDataPacket(fromNode, toNode) {
        const packet = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        packet.setAttribute('r', '3');
        packet.setAttribute('fill', '#00ff88');
        packet.style.opacity = '0.8';
        svg.appendChild(packet);

        const fromRect = fromNode.getBoundingClientRect();
        const toRect = toNode.getBoundingClientRect();
        const containerRect = svg.getBoundingClientRect();

        const startX = fromRect.left + fromRect.width / 2 - containerRect.left;
        const startY = fromRect.top + fromRect.height / 2 - containerRect.top;
        const endX = toRect.left + toRect.width / 2 - containerRect.left;
        const endY = toRect.top + toRect.height / 2 - containerRect.top;

        packet.setAttribute('cx', startX);
        packet.setAttribute('cy', startY);

        const animation = packet.animate([
            { cx: startX, cy: startY, opacity: 0.8 },
            { cx: endX, cy: endY, opacity: 0 }
        ], {
            duration: 2000,
            easing: 'ease-in-out'
        });

        animation.onfinish = () => {
            if (packet.parentNode) {
                packet.parentNode.removeChild(packet);
            }
        };
    }

    // Create data flows between random nodes
    setInterval(() => {
        const fromIndex = Math.floor(Math.random() * nodes.length);
        let toIndex;
        do {
            toIndex = Math.floor(Math.random() * nodes.length);
        } while (toIndex === fromIndex);

        createDataPacket(nodes[fromIndex], nodes[toIndex]);
    }, 1000);
}

// Live Network Status
function updateNetworkStatus() {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.live-status span');

    // Simulate status changes
    setInterval(() => {
        const isOnline = Math.random() > 0.1; // 90% uptime
        if (isOnline) {
            statusIndicator.classList.remove('offline');
            statusIndicator.classList.add('online');
            statusText.textContent = 'Network Status: Online';
        } else {
            statusIndicator.classList.remove('online');
            statusIndicator.classList.add('offline');
            statusText.textContent = 'Network Status: Maintenance';
        }
    }, 30000); // Update every 30 seconds
}

// Fetch News from Backend
async function fetchNews() {
    try {
        const response = await fetch('http://localhost:3001/api/news');
        const news = await response.json();
        const newsGrid = document.querySelector('.news-grid');
        newsGrid.innerHTML = '';

        news.forEach(item => {
            const newsItem = document.createElement('article');
            newsItem.className = 'news-item';
            newsItem.innerHTML = `
                <div class="news-image"></div>
                <div class="news-content">
                    <h3>${item.title}</h3>
                    <p>${item.excerpt}</p>
                    <span class="news-date">${item.date}</span>
                    <a href="#" class="read-more">Read More</a>
                </div>
            `;
            newsGrid.appendChild(newsItem);
        });

        // Re-apply animations
        document.querySelectorAll('.news-item').forEach((item, index) => {
            item.style.animationDelay = `${index * 0.2}s`;
        });
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

// Initialize new features
document.addEventListener('DOMContentLoaded', () => {
    fetchServices();
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', submitContactForm);
    }
    const contractForm = document.getElementById('contract-form');
    if (contractForm) {
        contractForm.addEventListener('submit', submitContractForm);
    }

    // New features
    showTestimonial(0);
    morphIcons();
    createDataFlow();
    updateNetworkStatus();
    fetchNews();

    createDraggableMap();
    initVoiceSearch();
    addARPreviews();
    addLiquidBlobs();
});

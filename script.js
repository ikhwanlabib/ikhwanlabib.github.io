/* ============================================================
   IKHWAN LABIB PORTFOLIO — script.js
   Particle Canvas · Typewriter · Counters · Scroll-Reveal
   Dark/Light Toggle · Hamburger · Skill Bars · Active Nav
   ============================================================ */

(function () {
    'use strict';

    // ============================================================
    // DARK / LIGHT MODE TOGGLE
    // ============================================================
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            localStorage.setItem('portfolio-theme', next);
        });
    }

    // ============================================================
    // PARTICLE CANVAS
    // ============================================================
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const isMobile = window.innerWidth < 768;
        const PARTICLE_COUNT = isMobile ? 40 : 80;
        const MAX_DIST = isMobile ? 100 : 140;

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        function createParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const isDark = html.getAttribute('data-theme') !== 'light';
            const dotColor = isDark ? '167, 139, 250' : '99, 102, 241';

            particles.forEach((p, i) => {
                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Wrap edges
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                // Draw dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${dotColor}, ${p.opacity})`;
                ctx.fill();

                // Draw lines to nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MAX_DIST) {
                        const alpha = (1 - dist / MAX_DIST) * 0.18;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(${dotColor}, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(drawParticles);
        }

        resizeCanvas();
        createParticles();
        drawParticles();

        window.addEventListener('resize', function () {
            resizeCanvas();
            createParticles();
        });
    }

    // ============================================================
    // TYPEWRITER ANIMATION
    // ============================================================
    const typewriterEl = document.getElementById('typewriter-text');
    if (typewriterEl) {
        const phrases = [
            'Electrical Engineer',
            'IoT & Embedded Systems',
            'RF/Microwave Designer',
            'Network Automation',
            'Content Creator · 1.4M+ Views'
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let deleting = false;
        let pause = false;

        function type() {
            const current = phrases[phraseIdx];
            if (!deleting) {
                typewriterEl.textContent = current.slice(0, charIdx + 1);
                charIdx++;
                if (charIdx === current.length) {
                    pause = true;
                    setTimeout(function () {
                        pause = false;
                        deleting = true;
                        type();
                    }, 2200);
                    return;
                }
            } else {
                typewriterEl.textContent = current.slice(0, charIdx - 1);
                charIdx--;
                if (charIdx === 0) {
                    deleting = false;
                    phraseIdx = (phraseIdx + 1) % phrases.length;
                }
            }
            if (!pause) {
                setTimeout(type, deleting ? 45 : 75);
            }
        }
        type();
    }

    // ============================================================
    // ANIMATED STAT COUNTERS
    // ============================================================
    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const isDecimal = el.getAttribute('data-decimal') === 'true';
        const duration = 1800;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;
            el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    const statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(function (el) {
        statsObserver.observe(el);
    });

    // ============================================================
    // SKILL PROGRESS BARS
    // ============================================================
    const barsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const fill = entry.target;
                fill.style.width = fill.getAttribute('data-width') + '%';
                barsObserver.unobserve(fill);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-bar-fill').forEach(function (el) {
        barsObserver.observe(el);
    });

    // ============================================================
    // SCROLL REVEAL
    // ============================================================
    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(function (el) {
        revealObserver.observe(el);
    });

    // ============================================================
    // STICKY NAVBAR FROSTED GLASS
    // ============================================================
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // ============================================================
    // ACTIVE NAV LINK ON SCROLL
    // ============================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(function (s) { sectionObserver.observe(s); });

    // ============================================================
    // MOBILE HAMBURGER MENU
    // ============================================================
    const hamburger = document.getElementById('hamburger');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    function closeMobileMenu() {
        hamburger.classList.remove('open');
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (hamburger && mobileOverlay) {
        hamburger.addEventListener('click', function () {
            const isOpen = hamburger.classList.toggle('open');
            mobileOverlay.classList.toggle('open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        mobileLinks.forEach(function (link) {
            link.addEventListener('click', closeMobileMenu);
        });

        mobileOverlay.addEventListener('click', function (e) {
            if (e.target === mobileOverlay) closeMobileMenu();
        });
    }

    // ============================================================
    // SMOOTH SCROLL FOR ALL ANCHOR LINKS
    // ============================================================
    document.addEventListener('click', function (e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const navH = navbar ? navbar.offsetHeight : 70;
            const top = target.getBoundingClientRect().top + window.scrollY - navH;
            window.scrollTo({ top: top, behavior: 'smooth' });
            closeMobileMenu();
        }
    });

    // ============================================================
    // FLIP CARDS (Experience Section)
    // ============================================================
    document.querySelectorAll('.flip-card').forEach(function (card) {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-pressed', 'false');
        card.addEventListener('click', function () {
            var flipped = card.classList.toggle('flipped');
            card.setAttribute('aria-pressed', flipped ? 'true' : 'false');
        });
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                var flipped = card.classList.toggle('flipped');
                card.setAttribute('aria-pressed', flipped ? 'true' : 'false');
            }
        });
    });

    // ============================================================
    // CONTACT FORM
    // ============================================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
        const btnSending = submitBtn ? submitBtn.querySelector('.btn-sending') : null;
        const btnSent = submitBtn ? submitBtn.querySelector('.btn-sent') : null;

        contactForm.addEventListener('submit', function (e) {
            // Allow Formspree to handle the actual submission if action is set
            // For demo/placeholder: intercept and show feedback
            const action = contactForm.getAttribute('action') || '';
            if (action.includes('YOUR_FORM_ID')) {
                e.preventDefault();
                if (!submitBtn) return;
                btnText && (btnText.style.display = 'none');
                btnSending && (btnSending.style.display = 'inline-flex');
                submitBtn.disabled = true;
                setTimeout(function () {
                    btnSending && (btnSending.style.display = 'none');
                    btnSent && (btnSent.style.display = 'inline-flex');
                    submitBtn.classList.add('success');
                    contactForm.reset();
                    setTimeout(function () {
                        btnSent && (btnSent.style.display = 'none');
                        btnText && (btnText.style.display = 'inline-flex');
                        submitBtn.classList.remove('success');
                        submitBtn.disabled = false;
                    }, 3000);
                }, 1000);
            }
        });
    }

})();

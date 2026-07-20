/* =========================================================
   LedgerLink Consultation — Shared Site JavaScript
   Used by every page (index.html, about.html, services.html, etc.)
   ========================================================= */

// The CURRENT_PAGE constant is set per-page via a data attribute on <body>,
            // e.g. <body data-page="about">. This lets shared script.js know which
            // page is currently loaded without needing a single-page app structure.
            const CURRENT_PAGE = document.body.dataset.page || 'home';

            // Maps each logical page id (used throughout the markup, e.g. showPage('about'))
            // to its real, standalone HTML file.
            const PAGE_MAP = {
                'home': '/',
                'about': '/about',
                'services': '/services',
                'finance-core': '/finance-core',
                'tax-strategy': '/tax-strategy',
                'tax-defense': '/tax-defense',
                'gallery': '/gallery',
                'faq': '/faq',
                'contact': '/contact'
            };

            function showPage(id) {
                // If we're already on this page, just scroll to top instead of reloading.
                if (id === CURRENT_PAGE) {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    return;
                }
                const target = PAGE_MAP[id] || ('/' + id);
                window.location.href = target;
            }

            function openPlanModal(cardEl) {
                var head = cardEl.querySelector('.plan-card-head');
                var icon = head.querySelector('.plan-icon') ? head.querySelector('.plan-icon').textContent : '';
                var title = head.querySelector('h3') ? head.querySelector('h3').textContent : '';
                var body = cardEl.querySelector('.plan-card-body');
                var isFeatured = cardEl.classList.contains('featured');

                // Set modal head gradient to match page/card style
                var pageEl = cardEl.closest('.page');
                var headEl = document.getElementById('pdm-head');
                if (isFeatured) {
                    headEl.style.background = 'linear-gradient(135deg,var(--gold),var(--gold2))';
                    document.getElementById('pdm-title').style.color = 'var(--navy)';
                    document.querySelector('#plan-detail-modal .pdm-close').style.color = 'var(--navy)';
                    document.querySelector('#plan-detail-modal .pdm-close').style.borderColor = 'rgba(6,21,48,0.2)';
                    document.querySelector('#plan-detail-modal .pdm-close').style.background = 'rgba(6,21,48,0.1)';
                } else {
                    var headBg = 'linear-gradient(135deg,var(--navy),var(--navy2))';
                    if (pageEl && pageEl.id === 'page-tax-strategy')
                        headBg = 'linear-gradient(135deg,#0f2d1f,#1a4a30)';
                    if (pageEl && pageEl.id === 'page-tax-defense')
                        headBg = 'linear-gradient(135deg,#3a1a1a,#5a2020)';
                    headEl.style.background = headBg;
                    document.getElementById('pdm-title').style.color = 'var(--white)';
                    document.querySelector('#plan-detail-modal .pdm-close').style.color = 'var(--white)';
                    document.querySelector('#plan-detail-modal .pdm-close').style.borderColor = 'rgba(255,255,255,0.22)';
                    document.querySelector('#plan-detail-modal .pdm-close').style.background = 'rgba(255,255,255,0.14)';
                }

                document.getElementById('pdm-icon').textContent = icon;
                document.getElementById('pdm-title').textContent = title;
                document.getElementById('pdm-body').innerHTML = body ? body.innerHTML : '';
                document.getElementById('plan-detail-modal').classList.add('open');
                document.body.style.overflow = 'hidden';
            }

            function closePlanModal() {
                document.getElementById('plan-detail-modal').classList.remove('open');
                document.body.style.overflow = '';
            }

            // Close plan modal on backdrop click or ESC
            document.addEventListener('DOMContentLoaded', function() {
                document.getElementById('plan-detail-modal').addEventListener('click', function(e) {
                    if (e.target === this)
                        closePlanModal();
                });
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape')
                        closePlanModal();
                });
            });

            function closeMobileMenu() {
                document.getElementById('mobileMenu').classList.remove('open');
            }

            function toggleMenu() {
                document.getElementById('mobileMenu').classList.toggle('open');
            }

            function toggleFaq(el) {
                const item = el.closest('.faq-item');
                const isOpen = item.classList.contains('open');
                document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
                if (!isOpen)
                    item.classList.add('open');
            }

            function openModal(id) {
                document.getElementById(id).classList.add('open');
                document.body.style.overflow = 'hidden';
            }

            function closeModal(id) {
                document.getElementById(id).classList.remove('open');
                document.body.style.overflow = '';
            }

            // Close modal on overlay click
            document.querySelectorAll('.modal-overlay').forEach(overlay => {
                overlay.addEventListener('click', function(e) {
                    if (e.target === this) {
                        this.classList.remove('open');
                        document.body.style.overflow = '';
                    }
                });
            }
            );

            // Close modal on Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    document.querySelectorAll('.modal-overlay.open').forEach(m => {
                        m.classList.remove('open');
                        document.body.style.overflow = '';
                    }
                    );
                }
            });

            function showNotification(msg) {
                const n = document.getElementById('notification');
                n.textContent = msg;
                n.classList.add('show');
                setTimeout( () => n.classList.remove('show'), 4500);
            }

            function initAnimations() {
                const selector = '#page-' + CURRENT_PAGE + ' .fade-up, #page-' + CURRENT_PAGE + ' .slide-left, #page-' + CURRENT_PAGE + ' .slide-right, #page-' + CURRENT_PAGE + ' .stagger';
                const observer = new IntersectionObserver( (entries) => {
                    entries.forEach(e => {
                        if (e.isIntersecting) {
                            e.target.classList.add('visible');
                            observer.unobserve(e.target);
                        }
                    }
                    );
                }
                ,{
                    threshold: 0.08,
                    rootMargin: '0px 0px -40px 0px'
                });
                document.querySelectorAll(selector).forEach(el => observer.observe(el));
            }

            window.addEventListener('scroll', () => {
                document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
            }
            );

            document.addEventListener('click', (e) => {
                const menu = document.getElementById('mobileMenu');
                const hamburger = document.getElementById('hamburger');
                if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
                    menu.classList.remove('open');
                }
            }
            );

            // ── PREMIUM COUNTER ANIMATION ──
            let statsAnimated = false;

            function easeOutCubic(t) {
                return 1 - Math.pow(1 - t, 3)
            }

            function animateCounter(el, target, duration) {
                const start = performance.now();
                const startVal = 0;
                function step(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = easeOutCubic(progress);
                    const current = Math.round(startVal + (target - startVal) * eased);
                    el.textContent = current.toLocaleString('en-IN');
                    el.classList.add('counting');
                    if (progress < 1)
                        requestAnimationFrame(step);
                    else {
                        el.textContent = target.toLocaleString('en-IN');
                        // tiny bounce at end
                        el.style.transform = 'scale(1.12)';
                        setTimeout( () => {
                            el.style.transform = '';
                            el.style.transition = 'transform .3s cubic-bezier(.34,1.56,.64,1)';
                        }
                        , 10);
                        setTimeout( () => {
                            el.style.transition = '';
                        }
                        , 400);
                    }
                }
                requestAnimationFrame(step);
            }

            function startStatsAnimation() {
                if (statsAnimated)
                    return;
                const section = document.getElementById('statsSection');
                if (!section)
                    return;
                statsAnimated = true;

                // stagger each card
                const cards = section.querySelectorAll('.stat-card');
                cards.forEach( (card, i) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    setTimeout( () => {
                        card.style.transition = 'opacity .6s ease, transform .6s cubic-bezier(.25,.46,.45,.94)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }
                    , i * 150);
                }
                );

                // counter configs: [id, target, duration]
                const counters = [['stat-clients', 500, 2000], ['stat-years', 10000, 1400], ['stat-tax', 425, 1800], ['stat-success', 98, 1600], ];
                counters.forEach( ([id,target,dur], i) => {
                    setTimeout( () => {
                        const el = document.getElementById(id);
                        if (el)
                            animateCounter(el, target, dur);
                    }
                    , i * 180 + 200);
                }
                );
            }

            // IntersectionObserver for stats section
            const statsObs = new IntersectionObserver( (entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        startStatsAnimation();
                        statsObs.disconnect();
                    }
                }
                );
            }
            ,{
                threshold: 0.25
            });

            function initStatsObserver() {
                const s = document.getElementById('statsSection');
                if (s) {
                    statsAnimated = false;
                    statsObs.observe(s);
                }
            }

            window.addEventListener('load', () => {
                setTimeout(initAnimations, 200);
                setTimeout(initStatsObserver, 300);
            }
            );

            // ── CUSTOM CURSOR ──
            const cursor = document.getElementById('custom-cursor');
            const cursorRing = document.getElementById('cursor-ring');
            if (cursor && cursorRing) {
                let mx = 0
                  , my = 0
                  , rx = 0
                  , ry = 0;
                document.addEventListener('mousemove', e => {
                    mx = e.clientX;
                    my = e.clientY;
                    cursor.style.left = mx + 'px';
                    cursor.style.top = my + 'px';
                }
                );
                function animRing() {
                    rx += (mx - rx) * 0.12;
                    ry += (my - ry) * .12;
                    cursorRing.style.left = rx + 'px';
                    cursorRing.style.top = ry + 'px';
                    requestAnimationFrame(animRing);
                }
                animRing();
                document.querySelectorAll('a,button,[onclick]').forEach(el => {
                    el.addEventListener('mouseenter', () => {
                        cursor.style.width = '20px';
                        cursor.style.height = '20px';
                        cursorRing.style.width = '50px';
                        cursorRing.style.height = '50px';
                        cursorRing.style.opacity = '0.8';
                    }
                    );
                    el.addEventListener('mouseleave', () => {
                        cursor.style.width = '12px';
                        cursor.style.height = '12px';
                        cursorRing.style.width = '36px';
                        cursorRing.style.height = '36px';
                        cursorRing.style.opacity = '0.5';
                    }
                    );
                }
                );
            }

            // ── 3D TILT EFFECT ──
            function initTilt() {
                document.querySelectorAll('.service-card, .why-card, .test-card, .value-card').forEach(card => {
                    card.addEventListener('mousemove', e => {
                        const rect = card.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;
                        const rotateX = (y - centerY) / centerY * -8;
                        const rotateY = (x - centerX) / centerX * 8;
                        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
                    }
                    );
                    card.addEventListener('mouseleave', () => {
                        card.style.transform = '';
                        card.style.transition = 'transform 0.5s cubic-bezier(.25,.46,.45,.94)';
                        setTimeout( () => {
                            card.style.transition = '';
                        }
                        , 500);
                    }
                    );
                }
                );
            }
            window.addEventListener('load', () => setTimeout(initTilt, 300));

            // ── PARALLAX SCROLL ──
            function initParallax() {
                const heroBg = document.querySelector('.hero-bg');
                if (!heroBg)
                    return;
                window.addEventListener('scroll', () => {
                    const scrollY = window.scrollY;
                    const hero = document.querySelector('.hero');
                    if (!hero)
                        return;
                    const heroH = hero.offsetHeight;
                    if (scrollY < heroH) {
                        heroBg.style.transform = `translateY(${scrollY * 0.4}px) scale(1.1)`;
                    }
                }
                , {
                    passive: true
                });
            }
            initParallax();

            // ── STOP-MOTION LETTER SHAKE ──
            function stopMotionHoverEffect() {
                document.querySelectorAll('.section-title em').forEach(el => {
                    el.addEventListener('mouseenter', () => {
                        el.style.animation = 'stopMotionShake 0.6s steps(6, end)';
                        setTimeout( () => {
                            el.style.animation = '';
                        }
                        , 600);
                    }
                    );
                }
                );
            }
            window.addEventListener('load', stopMotionHoverEffect);

/* ════════════════════════════════════════════════════
   🌟 WORLD-CLASS ANIMATIONS — 20 Premium Effects
════════════════════════════════════════════════════ */

            // ── 1. SCROLL PROGRESS INDICATOR ──
            (function() {
                const bar = document.getElementById('scroll-progress');
                if (!bar)
                    return;
                window.addEventListener('scroll', () => {
                    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
                    bar.style.width = Math.min(pct, 100) + '%';
                }
                , {
                    passive: true
                });
            }
            )();

            // ── 2. MOUSE-FOLLOW GLOW EFFECT ──
            (function() {
                const glow = document.getElementById('cursor-glow');
                if (!glow)
                    return;
                let tx = window.innerWidth / 2
                  , ty = window.innerHeight / 2;
                let cx = tx
                  , cy = ty;
                document.addEventListener('mousemove', e => {
                    tx = e.clientX;
                    ty = e.clientY;
                }
                );
                function animGlow() {
                    cx += (tx - cx) * 0.08;
                    cy += (ty - cy) * 0.08;
                    glow.style.left = cx + 'px';
                    glow.style.top = cy + 'px';
                    requestAnimationFrame(animGlow);
                }
                animGlow();
            }
            )();

            // ── 3. CURSOR TRAIL EFFECT ──
            (function() {
                const canvas = document.getElementById('cursor-trail-canvas');
                if (!canvas)
                    return;
                const ctx = canvas.getContext('2d');
                let W = window.innerWidth
                  , H = window.innerHeight;
                canvas.width = W;
                canvas.height = H;
                window.addEventListener('resize', () => {
                    W = canvas.width = window.innerWidth;
                    H = canvas.height = window.innerHeight;
                }
                );
                const trail = [];
                const MAX = 20;
                document.addEventListener('mousemove', e => {
                    trail.push({
                        x: e.clientX,
                        y: e.clientY,
                        life: 1
                    });
                    if (trail.length > MAX)
                        trail.shift();
                }
                );
                function drawTrail() {
                    ctx.clearRect(0, 0, W, H);
                    for (let i = 0; i < trail.length; i++) {
                        const p = trail[i];
                        const alpha = (i / trail.length) * p.life * 0.4;
                        const r = (i / trail.length) * 6;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(201,168,76,${alpha})`;
                        ctx.fill();
                        p.life -= 0.04;
                    }
                    trail.forEach( (p, i) => {
                        if (p.life <= 0)
                            trail.splice(i, 1);
                    }
                    );
                    requestAnimationFrame(drawTrail);
                }
                drawTrail();
            }
            )();

            // ── 4. BACKGROUND PARTICLE ANIMATION ──
            (function() {
                const canvas = document.getElementById('particle-canvas');
                if (!canvas)
                    return;
                const ctx = canvas.getContext('2d');
                let W = window.innerWidth
                  , H = window.innerHeight;
                canvas.width = W;
                canvas.height = H;
                window.addEventListener('resize', () => {
                    W = canvas.width = window.innerWidth;
                    H = canvas.height = window.innerHeight;
                    createParticles();
                }
                );
                let particles = [];
                function createParticles() {
                    particles = [];
                    const count = Math.floor((W * H) / 25000);
                    for (let i = 0; i < count; i++) {
                        particles.push({
                            x: Math.random() * W,
                            y: Math.random() * H,
                            r: Math.random() * 2 + 0.5,
                            vx: (Math.random() - 0.5) * 0.3,
                            vy: (Math.random() - 0.5) * 0.3,
                            alpha: Math.random() * 0.5 + 0.1
                        });
                    }
                }
                createParticles();
                let mx = W / 2
                  , my = H / 2;
                document.addEventListener('mousemove', e => {
                    mx = e.clientX;
                    my = e.clientY;
                }
                , {
                    passive: true
                });
                function animParticles() {
                    ctx.clearRect(0, 0, W, H);
                    particles.forEach(p => {
                        const dx = mx - p.x
                          , dy = my - p.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 150) {
                            p.vx += dx * 0.00008;
                            p.vy += dy * 0.00008;
                        }
                        p.vx *= 0.99;
                        p.vy *= 0.99;
                        p.x += p.vx;
                        p.y += p.vy;
                        if (p.x < 0)
                            p.x = W;
                        if (p.x > W)
                            p.x = 0;
                        if (p.y < 0)
                            p.y = H;
                        if (p.y > H)
                            p.y = 0;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(201,168,76,${p.alpha})`;
                        ctx.fill();
                    }
                    );
                    // Draw connections
                    for (let i = 0; i < particles.length; i++) {
                        for (let j = i + 1; j < particles.length; j++) {
                            const dx = particles[i].x - particles[j].x;
                            const dy = particles[i].y - particles[j].y;
                            const d = Math.sqrt(dx * dx + dy * dy);
                            if (d < 100) {
                                ctx.beginPath();
                                ctx.moveTo(particles[i].x, particles[i].y);
                                ctx.lineTo(particles[j].x, particles[j].y);
                                ctx.strokeStyle = `rgba(201,168,76,${(1 - d / 100) * 0.08})`;
                                ctx.lineWidth = 0.5;
                                ctx.stroke();
                            }
                        }
                    }
                    requestAnimationFrame(animParticles);
                }
                animParticles();
            }
            )();

            // ── 5. SPOTLIGHT HOVER on cards ──
            document.querySelectorAll('.spotlight-card').forEach(card => {
                card.addEventListener('mousemove', e => {
                    const rect = card.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%';
                    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%';
                    card.style.setProperty('--mx', x);
                    card.style.setProperty('--my', y);
                }
                );
            }
            );

            // ── 6. MAGNETIC BUTTONS ──
            document.querySelectorAll('.btn-magnetic').forEach(btn => {
                btn.addEventListener('mousemove', e => {
                    const rect = btn.getBoundingClientRect();
                    const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
                    const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
                    btn.style.transform = `translate(${x}px, ${y}px)`;
                }
                );
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = '';
                }
                );
            }
            );

            // ── 7. 3D TILT on cards (enhanced) ──
            function initEnhancedTilt() {
                document.querySelectorAll('.service-card, .why-card, .value-card').forEach(card => {
                    card.addEventListener('mousemove', e => {
                        const rect = card.getBoundingClientRect();
                        const x = (e.clientX - rect.left) / rect.width - 0.5;
                        const y = (e.clientY - rect.top) / rect.height - 0.5;
                        card.style.transform = `perspective(800px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateZ(12px)`;
                    }
                    );
                    card.addEventListener('mouseleave', () => {
                        card.style.transform = '';
                    }
                    );
                }
                );
            }
            window.addEventListener('load', initEnhancedTilt);

            // ── 8. SCROLL-TRIGGERED REVEAL (IntersectionObserver) ──
            (function() {
                const io = new IntersectionObserver( (entries) => {
                    entries.forEach(e => {
                        if (e.isIntersecting) {
                            e.target.classList.add('in-view');
                            io.unobserve(e.target);
                        }
                    }
                    );
                }
                ,{
                    threshold: 0.1,
                    rootMargin: '0px 0px -60px 0px'
                });
                document.querySelectorAll('section, .about-strip, .stats-section, .marquee-wrapper').forEach(el => {
                    el.classList.add('section-animate');
                    io.observe(el);
                }
                );
            }
            )();

            // ── 9. NAV SCROLL ENHANCEMENT ──
            (function() {
                const nav = document.getElementById('navbar');
                if (!nav)
                    return;
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 80) {
                        nav.classList.add('scrolled-enhanced');
                    } else {
                        nav.classList.remove('scrolled-enhanced');
                    }
                }
                , {
                    passive: true
                });
            }
            )();

            // ── 10. SHIMMER ON CARD HOVER (inject shimmer divs) ──
            document.querySelectorAll('.service-card').forEach(card => {
                if (!card.querySelector('.service-card-shimmer')) {
                    const shimmer = document.createElement('div');
                    shimmer.className = 'service-card-shimmer';
                    card.appendChild(shimmer);
                }
            }
            );

            // ── 11. ANIMATED TEXT REVEAL (section titles) ──
            (function() {
                const io = new IntersectionObserver( (entries) => {
                    entries.forEach(e => {
                        if (e.isIntersecting) {
                            e.target.classList.add('revealed');
                            io.unobserve(e.target);
                        }
                    }
                    );
                }
                ,{
                    threshold: 0.5
                });
                document.querySelectorAll('.section-title').forEach( (el, i) => {
                    const text = el.innerHTML;
                    el.classList.add('text-reveal');
                    el.innerHTML = `<span style="--delay:${i * 0.05}s">${text}</span>`;
                    io.observe(el);
                }
                );
            }
            )();

            // ── 12. HERO BACKGROUND IMAGE CROSSFADE ──
            (function() {
                const heroBg = document.querySelector('.hero-bg');
                if (!heroBg)
                    return;
                const images = ['https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1800&q=90', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1800&q=90', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1800&q=90', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1800&q=90'];
                let idx = 0;
                heroBg.style.backgroundImage = `url('${images[0]}')`;
                heroBg.style.transition = 'background-image 2s ease-in-out';
                setInterval( () => {
                    idx = (idx + 1) % images.length;
                    // Crossfade via opacity layering
                    const next = document.createElement('div');
                    next.style.cssText = `position:absolute;inset:0;background:url('${images[idx]}') center/cover no-repeat;opacity:0;transition:opacity 2s ease-in-out;`;
                    heroBg.parentElement.insertBefore(next, heroBg);
                    setTimeout( () => {
                        next.style.opacity = '1';
                    }
                    , 50);
                    setTimeout( () => {
                        heroBg.style.backgroundImage = `url('${images[idx]}')`;
                        next.remove();
                    }
                    , 2200);
                }
                , 7000);
            }
            )();

            // ── 13. NEON GLOW on stat numbers ──
            document.querySelectorAll('.stat-num, .stat-suffix').forEach( (el, i) => {
                el.style.animationDelay = (i * 0.3) + 's';
            }
            );

            // ── 14. SMOOTH SECTION DIVIDERS (inject wave) ──
            document.querySelectorAll('.section-divider').forEach(div => {
                div.outerHTML = `<div class="wave-divider">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60" preserveAspectRatio="none">
      <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="rgba(201,168,76,0.12)"/>
      <path d="M0,40 C360,10 720,60 1080,20 C1260,0 1380,40 1440,30 L1440,60 L0,60 Z" fill="rgba(201,168,76,0.06)"/>
    </svg>
  </div>`;
            }
            );

            // ── 15. ANIMATED GRADIENT BORDER on nav CTA ──
            const navCta = document.querySelector('.nav-cta');
            if (navCta) {
                navCta.classList.add('animated-border');
            }

            // ── 16. INTERACTIVE COUNTER with easing ──
            // (Already handled by existing code, enhanced via CSS reveal)

            // ── 17. INTERACTIVE SERVICE CARDS — ripple on click ──
            document.querySelectorAll('.service-card').forEach(card => {
                card.addEventListener('click', function(e) {
                    const ripple = document.createElement('span');
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:0; height:0;
      background:rgba(201,168,76,0.2);
      transform:translate(-50%,-50%);
      left:${x}px; top:${y}px;
      animation:rippleAnim 0.6s ease-out forwards;
      pointer-events:none; z-index:10;
    `;
                    card.style.position = 'relative';
                    card.appendChild(ripple);
                    setTimeout( () => ripple.remove(), 700);
                });
            }
            );
            // Add ripple keyframe
            const rippleStyle = document.createElement('style');
            rippleStyle.textContent = `
  @keyframes rippleAnim {
    to { width:300px; height:300px; opacity:0; }
  }
`;
            document.head.appendChild(rippleStyle);

            // ── 18. SMOOTH IMAGE HOVER ZOOM (gallery + hero strips) ──
            document.querySelectorAll('.about-strip-img img').forEach(img => {
                img.style.transition = 'transform 0.6s cubic-bezier(.25,.46,.45,.94)';
                img.parentElement.addEventListener('mouseenter', () => {
                    img.style.transform = 'scale(1.05) rotateY(-2deg)';
                }
                );
                img.parentElement.addEventListener('mouseleave', () => {
                    img.style.transform = '';
                }
                );
            }
            );

            // ── 19. DARK/LIGHT TRANSITION on scroll depth ──
            (function() {
                const body = document.body;
                let lastToggle = 0;
                window.addEventListener('scroll', () => {
                    const depth = window.scrollY / document.body.scrollHeight;
                    const now = Date.now();
                    if (now - lastToggle < 500)
                        return;
                    lastToggle = now;
                    // subtle ambient warmth shift based on scroll depth
                    body.style.setProperty('--ambient-shift', `${depth * 5}deg`);
                }
                , {
                    passive: true
                });
            }
            )();

// ── SPLASH SCREEN LOGIC ──
            (function() {
                var splash = document.getElementById('splash-screen');
                if (!splash)
                    return;
                // Already hidden by the inline session-check script (repeat visit
                // in this tab/session) — skip particles, scroll-lock, everything.
                if (splash.style.display === 'none')
                    return;

                // Generate floating particles
                var container = document.getElementById('splashParticles');
                var colors = ['rgba(184,146,46,', 'rgba(6,21,48,', 'rgba(0,168,107,'];
                for (var i = 0; i < 18; i++) {
                    var p = document.createElement('div');
                    p.className = 'splash-particle';
                    var size = Math.random() * 10 + 4;
                    var color = colors[Math.floor(Math.random() * colors.length)];
                    var opacity = (Math.random() * 0.4 + 0.15).toFixed(2);
                    var left = Math.random() * 100;
                    var duration = Math.random() * 4 + 3;
                    var delay = Math.random() * 1.2;
                    p.style.cssText = 'width:' + size + 'px;height:' + size + 'px;' + 'background:' + color + opacity + ');' + 'left:' + left + '%;bottom:-20px;' + 'animation-duration:' + duration + 's;' + 'animation-delay:' + delay + 's;';
                    container.appendChild(p);
                }

                // Remove after animation
                setTimeout(function() {
                    splash.classList.add('hidden');
                    document.body.style.overflow = '';
                }, 1900);

                // Prevent scroll during splash
                document.body.style.overflow = 'hidden';
            }
            )();

/* ── CONTACT FORM SUBMISSION (Web3Forms) ── */
async function submitForm() {
        const name = document.getElementById('cf-name').value.trim();
        const phone = document.getElementById('cf-phone').value.trim();
        const email = document.getElementById('cf-email').value.trim();
        const company = document.getElementById('cf-company').value.trim();
        const service = document.getElementById('cf-service').value;
        const message = document.getElementById('cf-message').value.trim();

        // Basic validation
        if (!name) {
            alert('Please enter your full name.');
            return;
        }
        if (!phone) {
            alert('Please enter your phone number.');
            return;
        }

        const btn = document.querySelector('.form-submit');
        btn.textContent = 'Sending...';
        btn.disabled = true;

        const formData = {
            access_key: 'a80a1c51-a4b8-4421-a80e-8a4361bb2f4b',
            subject: 'New Contact Form Submission',
            name,
            phone,
            email,
            company,
            service,
            message
        };

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                btn.textContent = '✅ Message Sent Successfully!';
                btn.style.background = '#28a745';
                // Clear all fields
                ['cf-name', 'cf-phone', 'cf-email', 'cf-company', 'cf-message'].forEach(id => {
                    document.getElementById(id).value = '';
                }
                );
                document.getElementById('cf-service').value = '';
            } else {
                btn.textContent = '❌ Failed. Try Again.';
                btn.style.background = '#dc3545';
                btn.disabled = false;
            }

        } catch (error) {
            btn.textContent = '❌ Network Error. Try Again.';
            btn.style.background = '#dc3545';
            btn.disabled = false;
        }
    }

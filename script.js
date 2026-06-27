// ==============================
// Particle Canvas Background
// ==============================
(function () {
    const canvas = document.getElementById("particle-canvas");
    const ctx    = canvas.getContext("2d");
    let W, H, particles = [];
    const COUNT  = 110;
    const COLOR  = "0, 212, 255"; // teal accent

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() { this.reset(true); }
        reset(initial) {
            this.x     = Math.random() * W;
            this.y     = initial ? Math.random() * H : -4;
            this.r     = Math.random() * 1.6 + 0.4;
            this.speedX = (Math.random() - 0.5) * 0.35;
            this.speedY = Math.random() * 0.5 + 0.15;
            this.alpha  = Math.random() * 0.55 + 0.15;
            this.twinkleSpeed = Math.random() * 0.02 + 0.005;
            this.twinkleDir   = Math.random() > 0.5 ? 1 : -1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.alpha += this.twinkleSpeed * this.twinkleDir;
            if (this.alpha >= 0.7 || this.alpha <= 0.1) this.twinkleDir *= -1;
            if (this.y > H + 5 || this.x < -5 || this.x > W + 5) this.reset(false);
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${COLOR}, ${this.alpha})`;
            ctx.fill();
        }
    }

    // Glow orbs — besar, melayang perlahan
    class Orb {
        constructor() { this.reset(); }
        reset() {
            this.x     = Math.random() * W;
            this.y     = Math.random() * H;
            this.r     = Math.random() * 160 + 80;
            this.speedX = (Math.random() - 0.5) * 0.18;
            this.speedY = (Math.random() - 0.5) * 0.12;
            this.alpha  = Math.random() * 0.06 + 0.02;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < -this.r*2) this.x = W + this.r;
            if (this.x > W + this.r*2) this.x = -this.r;
            if (this.y < -this.r*2) this.y = H + this.r;
            if (this.y > H + this.r*2) this.y = -this.r;
        }
        draw() {
            const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
            g.addColorStop(0,   `rgba(${COLOR}, ${this.alpha})`);
            g.addColorStop(0.5, `rgba(110, 140, 180, ${this.alpha * 0.4})`);
            g.addColorStop(1,   `rgba(${COLOR}, 0)`);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < COUNT; i++) particles.push(new Particle());
        orbs = [];
        for (let i = 0; i < 5; i++) orbs.push(new Orb());
    }

    let orbs = [];

    function draw() {
        // Background gradient — formal dark navy
        const bg = ctx.createRadialGradient(W*0.5, H*0.3, 0, W*0.5, H*0.5, Math.max(W, H));
        bg.addColorStop(0,   "#151e2e");
        bg.addColorStop(0.45,"#0d1221");
        bg.addColorStop(1,   "#0a0e1a");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Orbs
        orbs.forEach(o => { o.update(); o.draw(); });

        // Particles
        particles.forEach(p => { p.update(); p.draw(); });

        requestAnimationFrame(draw);
    }

    window.addEventListener("resize", () => { resize(); init(); });
    init();
    draw();
})();

// ==============================
// Smooth scroll helper
// ==============================
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
}

// ==============================
// Navbar – mobile toggle
// ==============================
function toggleMenu() {
    const nav = document.getElementById("nav");
    nav.classList.toggle("show");
}

// Close nav when a link is clicked (mobile)
document.querySelectorAll("#nav a").forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("nav").classList.remove("show");
    });
});

// ==============================
// Navbar – scroll shadow
// ==============================
window.addEventListener("scroll", () => {
    const header = document.getElementById("header");
    if (window.scrollY > 20) {
        header.style.boxShadow = "0 4px 30px rgba(0,0,0,0.4)";
    } else {
        header.style.boxShadow = "none";
    }
});

// ==============================
// Certificate Modal
// ==============================
function openCert(file, title, issuer) {
    const modal   = document.getElementById("certModal");
    const img     = document.getElementById("modalImg");
    const frame   = document.getElementById("modalFrame");
    const titleEl = document.getElementById("modalTitle");
    const issuerEl= document.getElementById("modalIssuer");
    const dlBtn   = document.getElementById("modalDownload");

    titleEl.textContent  = title;
    issuerEl.textContent = issuer;
    dlBtn.href           = file;
    dlBtn.download       = file;

    const isPDF = file.toLowerCase().endsWith(".pdf");

    if (isPDF) {
        img.style.display   = "none";
        img.src             = "";
        frame.style.display = "block";
        frame.src           = file + "#toolbar=0&navpanes=0&scrollbar=1&view=FitH";
    } else {
        frame.style.display = "none";
        frame.src           = "";
        img.style.display   = "block";
        img.src             = file;
        img.alt             = title;
    }

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeCert() {
    const modal = document.getElementById("certModal");
    const img   = document.getElementById("modalImg");
    const frame = document.getElementById("modalFrame");
    modal.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => {
        img.src   = "";
        frame.src = "";
    }, 300);
}

// Close when clicking the dark overlay (outside modal box)
function closeCertOnOverlay(e) {
    if (e.target === document.getElementById("certModal")) {
        closeCert();
    }
}

// Close with Escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCert();
});

// ==============================
// Typing effect
// ==============================
const phrases = [
    "TJKT Student",
    "Network Engineer",
    "System Administrator",
    "Cloud Explorer"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const current = phrases[phraseIndex];
    const typingEl = document.getElementById("typing");

    if (!typingEl) return;

    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    typingEl.textContent = current.substring(0, charIndex);

    if (!isDeleting && charIndex === current.length) {
        isDeleting = true;
        setTimeout(type, 1800);
        return;
    }

    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 400);
        return;
    }

    setTimeout(type, isDeleting ? 45 : 90);
}

type();

// ==============================
// Fade-in on scroll (IntersectionObserver)
// ==============================
const fades = document.querySelectorAll(".fade");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        } else {
            entry.target.classList.remove("show");
        }
    });
}, { threshold: 0.12 });

fades.forEach(el => observer.observe(el));

// ==============================
// Advanced scroll animations (data-anim)
// ==============================
function initScrollAnimations() {
    // Auto-assign data-anim ke elemen sesuai tipe & posisi
    const rules = [
        // Section labels & titles
        { sel: ".section-label",   anim: "fade-up" },
        { sel: ".section-title",   anim: "fade-up", delay: 1 },

        // About
        { sel: ".about-avatar-col", anim: "slide-right" },
        { sel: ".about-card",       anim: "slide-left" },

        // Hero content (langsung visible tapi dengan entry animation)
        { sel: ".hero-big-title",  anim: "fade-up" },
        { sel: ".hero-name",       anim: "fade-up", delay: 1 },
        { sel: ".hero-role",       anim: "fade-up", delay: 2 },
        { sel: ".hero-sub",        anim: "fade-up", delay: 3 },
        { sel: ".hero-actions",    anim: "fade-up", delay: 4 },
        { sel: ".hero-visual",     anim: "flip-up", delay: 2 },

        // Skills grid — stagger per card
        { sel: ".skill-cat",       anim: "scale-in", stagger: true },

        // Cert cards — stagger
        { sel: ".cert-card",       anim: "fade-up",  stagger: true },

        // Project cards — stagger
        { sel: ".project-card",    anim: "scale-in", stagger: true },

        // Contact cards — stagger
        { sel: ".contact-card",    anim: "slide-right", stagger: true },
    ];

    rules.forEach(({ sel, anim, delay, stagger }) => {
        document.querySelectorAll(sel).forEach((el, i) => {
            // Jangan re-assign jika sudah punya data-anim
            if (el.hasAttribute("data-anim")) return;
            el.setAttribute("data-anim", anim);
            if (stagger) {
                // Delay bertahap per elemen dalam satu parent group
                const siblings = el.parentElement
                    ? [...el.parentElement.querySelectorAll(sel)]
                    : [];
                const idx = siblings.indexOf(el);
                if (idx >= 0) {
                    el.style.transitionDelay = `${idx * 0.09}s`;
                }
            } else if (delay) {
                el.style.transitionDelay = `${delay * 0.08}s`;
            }
        });
    });

    // Observer untuk data-anim
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Elemen masuk viewport — jalankan animasi
                entry.target.classList.add("in-view");
            } else {
                // Elemen keluar viewport — reset agar animasi main lagi saat scroll balik
                entry.target.classList.remove("in-view");
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll("[data-anim]").forEach(el => {
        animObserver.observe(el);
    });

    // Hero langsung visible setelah 200ms (sudah di viewport)
    setTimeout(() => {
        document.querySelectorAll(".hero [data-anim]").forEach(el => {
            el.classList.add("in-view");
        });
    }, 200);
}

initScrollAnimations();

// ==============================
// Active nav link highlight on scroll
// ==============================
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("#nav a");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 100) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.style.color = "";
        if (link.getAttribute("href") === `#${current}`) {
            link.style.color = "var(--accent)";
        }
    });
});

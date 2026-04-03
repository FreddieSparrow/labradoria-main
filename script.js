// ---- Dismissible alert banner ----
const alertBanner = document.getElementById('alert-banner');
if (alertBanner) {
    if (localStorage.getItem('labradoria-alert-dismissed') === '1') {
        alertBanner.style.display = 'none';
    }
    const closeBtn = document.getElementById('alert-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            alertBanner.style.display = 'none';
            localStorage.setItem('labradoria-alert-dismissed', '1');
        });
    }
}

// ---- Scroll reveal ----
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// ---- Back to top button ----
const btn = document.getElementById('back-to-top');
if (btn) {
    window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 400 ? 'block' : 'none';
    });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ---- Card hover lift ----
document.querySelectorAll('.news-card, .territory-item, .pillar, .minister-card, .contact-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-3px)';
        card.style.boxShadow = '0 8px 24px rgba(0,33,71,0.11)';
        card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
    });
});

// ---- Dismissible alert banner — show exactly once across all sessions ----
const alertBanner = document.getElementById('alert-banner');
if (alertBanner) {
    if (localStorage.getItem('labradoria-alert-dismissed') === '1') {
        // Already seen — hide immediately, never show again
        alertBanner.style.display = 'none';
    } else {
        // First visit — show the banner, then mark it as seen immediately
        // so returning to this page (or any page) won't show it again
        localStorage.setItem('labradoria-alert-dismissed', '1');
    }
    // Still wire up any explicit close/dismiss button if present
    const closeBtn = document.getElementById('alert-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            alertBanner.style.display = 'none';
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

// ===== NAME HIGHLIGHTING FOR FREDDIE SPARROW & ADAM CALCROFT & HAYDN FELL =====
function highlightNames() {
    const nameRegex = /\b(Freddie Sparrow|Adam Calcroft|Haydn Fell|freddie sparrow|adam calcroft|haydn fell)\b(?!<\/mark>)/gi;
    
    function walkTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            if (nameRegex.test(text)) {
                const span = document.createElement('span');
                span.innerHTML = text.replace(nameRegex, (match) => {
                    const person = match.toLowerCase().replace(/\s+/g, '-');
                    return `<mark data-person="${person}" class="name-highlight" tabindex="0">${match}</mark>`;
                });
                node.parentNode.replaceChild(span, node);
                // Re-walk the new span's children
                for (let i = 0; i < span.childNodes.length; i++) {
                    walkTextNodes(span.childNodes[i]);
                }
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE', 'MARK'].includes(node.tagName) && !node.classList.contains('no-name-highlight')) {
            for (let i = 0; i < node.childNodes.length; i++) {
                walkTextNodes(node.childNodes[i]);
            }
        }
    }
    
    const mainContent = document.querySelector('main, article, .section-inner, body');
    if (mainContent) {
        walkTextNodes(mainContent);
    }
    
    // Add hover tooltips to highlighted names
    document.querySelectorAll('.name-highlight').forEach(mark => {
        const person = mark.dataset.person;
        let href1 = 'president.html';
        let href2 = 'founders.html';
        let label1 = 'Office';
        let label2 = 'Founders';
        
        const tooltip = document.createElement('div');
        tooltip.className = 'name-tooltip';

        if (person === 'haydn-fell') {
            tooltip.innerHTML = `<a href="founders.html" class="name-tooltip-link">Founders</a>`;
        } else {
            tooltip.innerHTML = `
                <a href="${href1}" class="name-tooltip-link">${label1}</a>
                <a href="${href2}" class="name-tooltip-link">${label2}</a>
            `;
        }
        mark.appendChild(tooltip);
    });
}

// Run on page load
document.addEventListener('DOMContentLoaded', highlightNames);

// ===== FOOTER ADDONS (social links + translation disclaimer) =====
document.addEventListener('DOMContentLoaded', function() {
    var fb = document.querySelector('.footer-bottom');
    if (fb) {
        var social = document.createElement('p');
        social.style.cssText = 'margin-top:10px;font-size:0.78rem;';
        social.innerHTML = '<a href="https://www.youtube.com/@labradoriaofficial" target="_blank" rel="noopener" style="color:#c8a84b;margin-right:16px;">&#9654; YouTube</a>'
            + '<a href="https://www.linkedin.com/company/labradoria" target="_blank" rel="noopener" style="color:#c8a84b;">in LinkedIn</a>';
        fb.appendChild(social);

        var disc = document.createElement('p');
        disc.style.cssText = 'margin-top:6px;font-size:0.72rem;color:#999;';
        disc.textContent = 'Translations are provided by Google Translate for convenience only. The Republic of Labradoria accepts no responsibility for inaccuracies in machine-translated content. The English version of all documents is authoritative.';
        fb.appendChild(disc);
    }
});

// ===== LANGUAGE SWITCHER =====
function setLanguage(lang) {
    localStorage.setItem('labradoria-lang', lang);
    document.querySelectorAll('.lang-btn').forEach(function(b) {
        b.classList.toggle('active', b.dataset.lang === lang);
    });
    if (lang === 'en') {
        // Reload without translate cookie to restore English
        var gt = document.cookie.match(/googtrans=([^;]+)/);
        if (gt) {
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + location.hostname;
            location.reload();
        }
        return;
    }
    var sel = document.querySelector('#google_translate_element select');
    if (sel) {
        sel.value = lang;
        sel.dispatchEvent(new Event('change'));
    } else {
        setTimeout(function() { setLanguage(lang); }, 600);
    }
}

// Map country code → language
var COUNTRY_LANG_MAP = {
    'FR':'fr','BE':'fr','LU':'fr','MC':'fr','CI':'fr','SN':'fr','CM':'fr',
    'DE':'de','AT':'de','LI':'de',
    'RU':'ru','BY':'ru','KZ':'ru','KG':'ru',
    'CN':'zh-CN','TW':'zh-CN','HK':'zh-CN','SG':'zh-CN','MO':'zh-CN'
};

document.addEventListener('DOMContentLoaded', function() {
    var saved = localStorage.getItem('labradoria-lang');
    if (saved) {
        // Restore saved preference
        document.querySelectorAll('.lang-btn').forEach(function(b) {
            b.classList.toggle('active', b.dataset.lang === saved);
        });
        if (saved !== 'en') {
            setTimeout(function() { setLanguage(saved); }, 1200);
        }
    } else {
        // Auto-detect by IP (silent fail if API unavailable)
        fetch('https://api.country.is/')
            .then(function(r) { return r.json(); })
            .then(function(data) {
                var lang = COUNTRY_LANG_MAP[data.country];
                if (lang) setLanguage(lang);
            })
            .catch(function() {});
    }
});

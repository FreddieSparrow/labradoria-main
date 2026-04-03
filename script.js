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
        } else if (node.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE', 'MARK'].includes(node.tagName)) {
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
        
        if (person === 'haydn-fell') {
            href1 = 'founders.html';
            label1 = 'Founders';
        }
        
        const tooltip = document.createElement('div');
        tooltip.className = 'name-tooltip';
        tooltip.innerHTML = `
            <a href="${href1}" class="name-tooltip-link">${label1}</a>
            <a href="${href2}" class="name-tooltip-link">${label2}</a>
        `;
        mark.appendChild(tooltip);
    });
}

// Run on page load
document.addEventListener('DOMContentLoaded', highlightNames);

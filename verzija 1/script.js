// Navbar scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile nav
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
    mobileNav.classList.add('active');
    hamburger.classList.add('hidden');
});

mobileClose.addEventListener('click', () => {
    mobileNav.classList.remove('active');
    hamburger.classList.remove('hidden');
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        hamburger.classList.remove('hidden');
    });
});

// Scroll reveal
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, i * 80);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => observer.observe(el));

// Form submit handler (placeholder)
document.querySelector('.form-submit').addEventListener('click', function() {
    const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    let filled = true;
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            filled = false;
            input.style.borderBottomColor = '#c94c4c';
            setTimeout(() => input.style.borderBottomColor = '', 2000);
        }
    });
    if (filled) {
        this.textContent = 'Poruka poslata ✓';
        this.style.background = '#4a8c5c';
        inputs.forEach(input => input.value = '');
        setTimeout(() => {
            this.innerHTML = 'Pošaljite upit <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
            this.style.background = '';
        }, 3000);
    }
});

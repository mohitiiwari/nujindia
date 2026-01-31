// ============================================
// NUJ India Website JavaScript
// ============================================

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const menuClose = document.getElementById('menuClose');

if (menuToggle && mobileMenu && menuClose) {
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    menuClose.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close menu when clicking a direct nav link (HOME, INTRODUCTION, CONTACT)
    mobileMenu.querySelectorAll('.mobile-nav-list > li > a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.parentElement.classList.contains('mobile-has-sub')) return;
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    // Close menu when clicking any submenu link
    mobileMenu.querySelectorAll('.mobile-sub a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Mobile submenu expand/collapse (+ / −)
document.querySelectorAll('.mobile-has-sub').forEach(function(item) {
    const link = item.querySelector(':scope > a');
    if (!link) return;
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.mobile-has-sub.open').forEach(function(other) {
            if (other !== item) other.classList.remove('open');
        });
        if (isOpen) {
            item.classList.remove('open');
        } else {
            item.classList.add('open');
        }
    });
});

// Megamenu: click to open on touch devices (keep hover for desktop)
(function() {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;
    const dropdowns = nav.querySelectorAll('.has-dropdown');
    let touchMode = false;

    function closeAll() {
        dropdowns.forEach(function(d) { d.classList.remove('megamenu-open'); });
    }

    dropdowns.forEach(function(li) {
        const link = li.querySelector(':scope > a');
        if (!link) return;
        link.addEventListener('click', function(e) {
            if (window.matchMedia('(min-width: 969px)').matches) {
                e.preventDefault();
                touchMode = true;
                const open = li.classList.contains('megamenu-open');
                closeAll();
                if (!open) li.classList.add('megamenu-open');
            }
        });
    });

    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target)) closeAll();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeAll();
    });
})();

// State Units megamenu: show different panel per zone (East = Office Bearers, others = zone menu)
(function() {
    const stateUnitsLi = document.querySelector('.has-dropdown.has-megamenu');
    if (!stateUnitsLi) return;
    const zonesColumn = stateUnitsLi.querySelector('.megamenu-column-zones');
    const panelsColumn = stateUnitsLi.querySelector('.megamenu-column-panels');
    const zoneItems = stateUnitsLi.querySelectorAll('.megamenu-zones li[data-zone]');
    const panels = stateUnitsLi.querySelectorAll('.megamenu-panel[data-panel]');
    let hidePanelsTimer = null;
    const delay = 180;

    function showPanel(zone) {
        panels.forEach(function(p) {
            p.classList.toggle('is-visible', p.getAttribute('data-panel') === zone);
        });
    }

    function hideAllPanels() {
        panels.forEach(function(p) { p.classList.remove('is-visible'); });
    }

    function scheduleHide() {
        if (hidePanelsTimer) clearTimeout(hidePanelsTimer);
        hidePanelsTimer = setTimeout(hideAllPanels, delay);
    }

    function cancelHide() {
        if (hidePanelsTimer) {
            clearTimeout(hidePanelsTimer);
            hidePanelsTimer = null;
        }
    }

    zoneItems.forEach(function(li) {
        li.addEventListener('mouseenter', function() {
            cancelHide();
            showPanel(li.getAttribute('data-zone'));
        });
    });

    if (zonesColumn) {
        zonesColumn.addEventListener('mouseleave', function() {
            scheduleHide();
        });
    }

    if (panelsColumn) {
        panelsColumn.addEventListener('mouseenter', cancelHide);
        panelsColumn.addEventListener('mouseleave', function() {
            scheduleHide();
        });
    }
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Content carousel navigation
function scrollContent(type, direction) {
    const container = document.getElementById(type + '-cards');
    if (container) {
        const cardWidth = container.querySelector('.content-card').offsetWidth;
        container.scrollBy({
            left: direction * (cardWidth + 20),
            behavior: 'smooth'
        });
    }
}

// Handle enquiry form submission
function handleEnquiry(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Here you would typically send this to your server
    console.log('Form submitted:', data);
    
    // Show success message
    alert('Thank you for your ' + data.type + '! We will get back to you soon.');
    event.target.reset();
    
    return false;
}

// Sticky header on scroll
let lastScroll = 0;
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Add transition to header
if (header) {
    header.style.transition = 'transform 0.3s ease';
}

// Lazy loading for images (if needed)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    // Uncomment if you want to use lazy loading
    // document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// Newsletter form handling
const newsletterForms = document.querySelectorAll('.newsletter-form');
newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        // Here you would send to your server
        console.log('Newsletter subscription:', email);
        alert('Thank you for subscribing to our newsletter!');
        this.reset();
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('.feature-card, .leader-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Console log for debugging
console.log('NUJ India website loaded successfully!');

// ============================================
// Photo Slideshow Functionality
// ============================================
let currentSlideIndex = 0;
let slideInterval;

function showSlide(index) {
    const slides = document.querySelectorAll('.news-highlights .slideshow-container .slide');
    const indicators = document.querySelectorAll('.news-highlights .slide-indicators .indicator');
    
    if (!slides.length) return;
    
    if (index >= slides.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = slides.length - 1;
    } else {
        currentSlideIndex = index;
    }
    
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
}

function changeSlide(direction) {
    showSlide(currentSlideIndex + direction);
    resetSlideInterval();
}

function currentSlide(index) {
    showSlide(index - 1);
    resetSlideInterval();
}

function autoSlide() {
    slideInterval = setInterval(() => {
        showSlide(currentSlideIndex + 1);
    }, 5000); // Change slide every 5 seconds
}

function resetSlideInterval() {
    clearInterval(slideInterval);
    autoSlide();
}

// Initialize "In Focus" slideshow (news-highlights section only)
const slideshowContainer = document.querySelector('.news-highlights .slideshow-container');
if (slideshowContainer) {
    showSlide(currentSlideIndex);
    autoSlide();
}

// ============================================
// Lightbox Functionality
// ============================================
const lightboxImages = [
    {
        src: 'images/1766290219_G8IgXNpb0AAF9GH (1).jpg',
        caption: 'All India Media Meet'
    },
    {
        src: 'images/1766290098_WhatsApp_Image_2025-12-15_at_08_07_25_871f23f6.jpg',
        caption: "Governor's Address"
    },
    {
        src: 'images/1769686728679_image.png',
        caption: 'Press Conference'
    },
    {
        src: 'images/ras_bihari.jpg',
        caption: 'Leadership Summit'
    },
    {
        src: 'images/pradeep_tiwari.jpg',
        caption: 'Annual Convention'
    },
    {
        src: 'images/1766290219_G8IgXNpb0AAF9GH (1).jpg',
        caption: 'Regional Workshop'
    }
];

let currentLightboxIndex = 0;

function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    if (lightbox && lightboxImage && lightboxCaption) {
        lightboxImage.src = lightboxImages[index].src;
        lightboxCaption.textContent = lightboxImages[index].caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function changeLightboxImage(direction) {
    currentLightboxIndex += direction;
    
    if (currentLightboxIndex >= lightboxImages.length) {
        currentLightboxIndex = 0;
    } else if (currentLightboxIndex < 0) {
        currentLightboxIndex = lightboxImages.length - 1;
    }
    
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    if (lightboxImage && lightboxCaption) {
        lightboxImage.src = lightboxImages[currentLightboxIndex].src;
        lightboxCaption.textContent = lightboxImages[currentLightboxIndex].caption;
    }
}

// Close lightbox with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            changeLightboxImage(-1);
        }
    } else if (e.key === 'ArrowRight') {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            changeLightboxImage(1);
        }
    }
});

// Close lightbox when clicking outside the image
document.getElementById('lightbox')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeLightbox();
    }
});
// News slider (photo strip) – only target slides inside .news-slider
const newsSlider = document.querySelector('.news-slider .slider-wrapper');
if (newsSlider) {
    const slides = newsSlider.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.news-slider .dot');
    let newsSlideIndex = 0;
    if (slides.length && dots.length) {
        setInterval(() => {
            slides[newsSlideIndex].classList.remove('active');
            dots[newsSlideIndex].classList.remove('active');
            newsSlideIndex = (newsSlideIndex + 1) % slides.length;
            slides[newsSlideIndex].classList.add('active');
            dots[newsSlideIndex].classList.add('active');
        }, 4000);
    }
}

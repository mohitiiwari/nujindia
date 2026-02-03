// ============================================
// NUJ India Website JavaScript
// ============================================

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const menuClose = document.getElementById('menuClose');

if (menuToggle && mobileMenu && menuClose) {
    menuToggle.addEventListener('click', function () {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    menuClose.addEventListener('click', function () {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close menu when clicking a direct nav link (HOME, INTRODUCTION, CONTACT)
    mobileMenu.querySelectorAll('.mobile-nav-list > li > a').forEach(link => {
        link.addEventListener('click', function (e) {
            if (this.parentElement.classList.contains('mobile-has-sub')) return;
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    // Close menu when clicking any submenu link
    mobileMenu.querySelectorAll('.mobile-sub a').forEach(link => {
        link.addEventListener('click', function () {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Mobile submenu expand/collapse (+ / −)
document.querySelectorAll('.mobile-has-sub').forEach(function (item) {
    const link = item.querySelector(':scope > a');
    if (!link) return;
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.mobile-has-sub.open').forEach(function (other) {
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
(function () {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;
    const dropdowns = nav.querySelectorAll('.has-dropdown');
    let touchMode = false;

    function closeAll() {
        dropdowns.forEach(function (d) { d.classList.remove('megamenu-open'); });
    }

    dropdowns.forEach(function (li) {
        const link = li.querySelector(':scope > a');
        if (!link) return;
        link.addEventListener('click', function (e) {
            if (window.matchMedia('(min-width: 969px)').matches) {
                e.preventDefault();
                touchMode = true;
                const open = li.classList.contains('megamenu-open');
                closeAll();
                if (!open) li.classList.add('megamenu-open');
            }
        });
    });

    document.addEventListener('click', function (e) {
        if (!nav.contains(e.target)) closeAll();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeAll();
    });
})();

// State Units megamenu: show different panel per zone (East = Office Bearers, others = zone menu)
(function () {
    const stateUnitsLi = document.querySelector('.has-dropdown.has-megamenu');
    if (!stateUnitsLi) return;
    const zonesColumn = stateUnitsLi.querySelector('.megamenu-column-zones');
    const panelsColumn = stateUnitsLi.querySelector('.megamenu-column-panels');
    const zoneItems = stateUnitsLi.querySelectorAll('.megamenu-zones li[data-zone]');
    const panels = stateUnitsLi.querySelectorAll('.megamenu-panel[data-panel]');
    let hidePanelsTimer = null;
    const delay = 180;

    function showPanel(zone) {
        panels.forEach(function (p) {
            p.classList.toggle('is-visible', p.getAttribute('data-panel') === zone);
        });
    }

    function hideAllPanels() {
        panels.forEach(function (p) { p.classList.remove('is-visible'); });
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

    zoneItems.forEach(function (li) {
        li.addEventListener('mouseenter', function () {
            cancelHide();
            showPanel(li.getAttribute('data-zone'));
        });
    });

    if (zonesColumn) {
        zonesColumn.addEventListener('mouseleave', function () {
            scheduleHide();
        });
    }

    if (panelsColumn) {
        panelsColumn.addEventListener('mouseenter', cancelHide);
        panelsColumn.addEventListener('mouseleave', function () {
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
    form.addEventListener('submit', function (e) {
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
document.addEventListener('keydown', function (e) {
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
document.getElementById('lightbox')?.addEventListener('click', function (e) {
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
// Get all gallery items
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.querySelector('.lightbox-caption');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let currentImageIndex = 0;
let images = [];

// Collect all images and their data
galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    const title = item.querySelector('.overlay-content h3').textContent;
    const subtitle = item.querySelector('.overlay-content p').textContent;

    images.push({
        src: img.src,
        alt: img.alt,
        title: title,
        subtitle: subtitle
    });

    // Add click event to open lightbox
    item.addEventListener('click', () => {
        openLightbox(index);
    });
});

// Open lightbox
function openLightbox(index) {
    currentImageIndex = index;
    showImage(currentImageIndex);
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Close lightbox
function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Show specific image
function showImage(index) {
    if (index < 0) {
        currentImageIndex = images.length - 1;
    } else if (index >= images.length) {
        currentImageIndex = 0;
    } else {
        currentImageIndex = index;
    }

    const currentImage = images[currentImageIndex];
    lightboxImg.src = currentImage.src;
    lightboxImg.alt = currentImage.alt;
    lightboxCaption.innerHTML = `<strong>${currentImage.title}</strong><br>${currentImage.subtitle}`;
}

// Navigate to previous image
function showPrevImage() {
    showImage(currentImageIndex - 1);
}

// Navigate to next image
function showNextImage() {
    showImage(currentImageIndex + 1);
}

// Event Listeners
closeBtn.addEventListener('click', closeLightbox);
prevBtn.addEventListener('click', showPrevImage);
nextBtn.addEventListener('click', showNextImage);

// Close lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'block') {
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    }
});

// Lazy loading for images
const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01
};

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
}, observerOptions);

// Observe all gallery images
document.querySelectorAll('.gallery-item img').forEach(img => {
    imageObserver.observe(img);
});

// Add smooth scroll animation when page loads
window.addEventListener('load', () => {
    const items = document.querySelectorAll('.gallery-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.5s ease';

            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 50);
        }, index * 50);
    });
});

// Touch support for mobile swipe
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - show next
            showNextImage();
        } else {
            // Swipe right - show previous
            showPrevImage();
        }
    }
}

// Prevent context menu on images
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});

// Add loading indicator
const loadingIndicator = document.createElement('div');
loadingIndicator.className = 'loading-indicator';
loadingIndicator.innerHTML = '<div class="spinner"></div>';
loadingIndicator.style.cssText = `
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10001;
`;

document.body.appendChild(loadingIndicator);

// Show loading when changing images in lightbox
lightboxImg.addEventListener('load', () => {
    loadingIndicator.style.display = 'none';
});

lightboxImg.addEventListener('error', () => {
    loadingIndicator.style.display = 'none';
    lightboxCaption.innerHTML = 'Image failed to load';
});

// Add image counter
const createImageCounter = () => {
    const counter = document.createElement('div');
    counter.className = 'image-counter';
    counter.style.cssText = `
        position: absolute;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-size: 18px;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 10000;
    `;
    lightbox.appendChild(counter);
    return counter;
};

const imageCounter = createImageCounter();

// Update counter when showing image
const originalShowImage = showImage;
showImage = function (index) {
    originalShowImage(index);
    imageCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
};

console.log(`Photo Gallery Initialized: ${images.length} images loaded`);
const track = document.querySelector('.scroller-track');

let scrollAmount = 0;

function autoScroll() {
    scrollAmount += 1;
    track.scrollLeft = scrollAmount;

    if (scrollAmount >= track.scrollWidth - track.clientWidth) {
        scrollAmount = 0;
    }
}

let scrollInterval = setInterval(autoScroll, 20);

// mouse hover pe auto scroll stop
track.addEventListener('mouseenter', () => {
    clearInterval(scrollInterval);
});

track.addEventListener('mouseleave', () => {
    scrollInterval = setInterval(autoScroll, 20);
});
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Get Elements
    const scroller = document.getElementById('imageScroller');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');
    const indicatorsContainer = document.getElementById('scrollIndicators');

    // Check if elements exist
    if (!scroller || !scrollLeftBtn || !scrollRightBtn || !indicatorsContainer) {
        console.error('Required elements not found!');
        return;
    }

    // Configuration
    const scrollAmount = 370; // Width of one item + gap
    let isDragging = false;
    let startX;
    let scrollLeft;

    // Initialize scroll indicators
    function initIndicators() {
        const items = document.querySelectorAll('.scroll-item');
        const numberOfIndicators = Math.ceil(items.length / 3); // One indicator per 3 items
        
        indicatorsContainer.innerHTML = ''; // Clear existing indicators
        
        for (let i = 0; i < numberOfIndicators; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => scrollToIndicator(i));
            indicatorsContainer.appendChild(indicator);
        }
    }

    // Scroll to specific indicator
    function scrollToIndicator(index) {
        const scrollPosition = index * scrollAmount * 3;
        scroller.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }

    // Update active indicator based on scroll position
    function updateIndicators() {
        const indicators = document.querySelectorAll('.indicator');
        const scrollPosition = scroller.scrollLeft;
        const activeIndex = Math.round(scrollPosition / (scrollAmount * 3));
        
        indicators.forEach((indicator, index) => {
            if (index === activeIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // Update button states
    function updateButtonStates() {
        // Left button
        if (scroller.scrollLeft <= 0) {
            scrollLeftBtn.style.opacity = '0.5';
            scrollLeftBtn.style.pointerEvents = 'none';
        } else {
            scrollLeftBtn.style.opacity = '1';
            scrollLeftBtn.style.pointerEvents = 'auto';
        }
        
        // Right button
        if (scroller.scrollLeft >= scroller.scrollWidth - scroller.clientWidth - 1) {
            scrollRightBtn.style.opacity = '0.5';
            scrollRightBtn.style.pointerEvents = 'none';
        } else {
            scrollRightBtn.style.opacity = '1';
            scrollRightBtn.style.pointerEvents = 'auto';
        }
    }

    // Scroll Left Button
    scrollLeftBtn.addEventListener('click', (e) => {
        e.preventDefault();
        scroller.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    // Scroll Right Button
    scrollRightBtn.addEventListener('click', (e) => {
        e.preventDefault();
        scroller.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Mouse Drag to Scroll
    scroller.addEventListener('mousedown', (e) => {
        isDragging = true;
        scroller.classList.add('dragging');
        scroller.style.cursor = 'grabbing';
        startX = e.pageX - scroller.offsetLeft;
        scrollLeft = scroller.scrollLeft;
        e.preventDefault();
    });

    scroller.addEventListener('mouseleave', () => {
        isDragging = false;
        scroller.classList.remove('dragging');
        scroller.style.cursor = 'grab';
    });

    scroller.addEventListener('mouseup', () => {
        isDragging = false;
        scroller.classList.remove('dragging');
        scroller.style.cursor = 'grab';
    });

    scroller.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scroller.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        scroller.scrollLeft = scrollLeft - walk;
    });

    // Touch Support for Mobile
    let touchStartX = 0;
    let touchScrollLeft = 0;

    scroller.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].pageX;
        touchScrollLeft = scroller.scrollLeft;
    }, { passive: true });

    scroller.addEventListener('touchmove', (e) => {
        const touchX = e.touches[0].pageX;
        const walk = (touchStartX - touchX) * 1.5;
        scroller.scrollLeft = touchScrollLeft + walk;
    }, { passive: true });

    // Update indicators and buttons on scroll
    scroller.addEventListener('scroll', () => {
        updateIndicators();
        updateButtonStates();
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            scroller.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        } else if (e.key === 'ArrowRight') {
            scroller.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    });

    // Auto-scroll feature (optional - uncomment to enable)
    /*
    let autoScrollInterval;

    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            if (scroller.scrollLeft >= scroller.scrollWidth - scroller.clientWidth) {
                scroller.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            } else {
                scroller.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }, 3000);
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    // Start auto-scroll
    startAutoScroll();

    // Pause on hover
    scroller.addEventListener('mouseenter', stopAutoScroll);
    scroller.addEventListener('mouseleave', startAutoScroll);
    */

    // Initialize
    initIndicators();
    updateButtonStates();
    scroller.style.cursor = 'grab';

    console.log('Image scroller initialized successfully!');
    
});
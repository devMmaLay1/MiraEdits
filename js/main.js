// MiraEdits Portfolio - Mobile-First JavaScript

// ===== MOBILE-FIRST NAVIGATION FUNCTIONALITY =====

// Navigation Menu Toggle
function initMobileNavigation() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');

    console.log('Navigation elements found:', {
        navMenu: !!navMenu,
        navToggle: !!navToggle,
        navClose: !!navClose,
        navLinksCount: navLinks.length
    });

    // Show mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger menu clicked - opening menu');
            navMenu.classList.add('show-menu');
            document.body.style.overflow = 'hidden';
        });
    } else {
        console.error('Nav toggle button not found!');
    }

    // Hide mobile menu
    if (navClose) {
        navClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button clicked - closing menu');
            navMenu.classList.remove('show-menu');
            document.body.style.overflow = '';
        });
    } else {
        console.error('Nav close button not found!');
    }

    // Close menu when clicking nav links (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            console.log('Nav link clicked - closing menu');
            navMenu.classList.remove('show-menu');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside (mobile)
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('show-menu');
            document.body.style.overflow = '';
        }
    });

    // Handle escape key to close menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('show-menu')) {
            navMenu.classList.remove('show-menu');
            document.body.style.overflow = '';
        }
    });
}

// Smooth Scroll Navigation
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Active Navigation Link Highlighting
function initActiveNavigation() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav__link');
    
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }
    
    // Throttled scroll event for better performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial call
    updateActiveLink();
}

// Header Background on Scroll
function initHeaderScroll() {
    const header = document.getElementById('header');
    
    function updateHeaderBackground() {
        // Use CSS variables instead of hardcoded colors to support dark mode
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        
        if (window.scrollY > 50) {
            // Remove inline styles to let CSS variables work
            header.style.backgroundColor = '';
            header.style.boxShadow = '';
            header.classList.add('header--scrolled');
        } else {
            // Remove inline styles to let CSS variables work
            header.style.backgroundColor = '';
            header.style.boxShadow = '';
            header.classList.remove('header--scrolled');
        }
    }
    
    // Throttled scroll event
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateHeaderBackground();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ===== DARK MODE FUNCTIONALITY =====

// Dark Mode System
const DarkMode = {
    // Initialize dark mode
    init: function() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        console.log('Dark mode elements found:', {
            themeToggle: !!this.themeToggle,
            themeIcon: !!this.themeIcon,
            currentTheme: this.currentTheme
        });
        
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add event listener
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                console.log('Dark mode toggle clicked');
                this.toggleTheme();
            });
        } else {
            console.error('Theme toggle button not found!');
        }
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
        
        console.log('Dark mode system initialized:', this.currentTheme);
    },
    
    // Set theme
    setTheme: function(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        console.log('Setting theme to:', theme);
        
        // Update icon
        if (this.themeIcon) {
            if (theme === 'dark') {
                this.themeIcon.className = 'fas fa-sun';
            } else {
                this.themeIcon.className = 'fas fa-moon';
            }
        }
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: theme } 
        }));
        
        console.log('Theme set to:', theme);
    },
    
    // Toggle theme
    toggleTheme: function() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        console.log('Toggling theme from', this.currentTheme, 'to', newTheme);
        this.setTheme(newTheme);
        
        // Add visual feedback
        if (this.themeToggle) {
            this.themeToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.themeToggle.style.transform = '';
            }, 150);
        }
    },
    
    // Get current theme
    getTheme: function() {
        return this.currentTheme;
    },
    
    // Check if dark mode is active
    isDark: function() {
        return this.currentTheme === 'dark';
    }
};

// ===== HERO SECTION FUNCTIONALITY =====

// Mobile Dynamic Background Image System - Auto-rotating every 15 seconds
function initMobileDynamicBackground() {
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero__background');
    
    if (!hero || !heroBackground) return;

    const isMobile = window.innerWidth <= 767 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) return; // Only apply to mobile devices

    // Define the background image sequence (15 seconds each)
    const backgroundSequence = [
        { src: 'assets/images/freepik-2.webp', duration: 15000 },
        { src: 'assets/images/freepik-1.webp', duration: 15000 },
        { src: 'assets/images/freepik-3.webp', duration: 15000 },
        { src: 'assets/images/freepik-4.webp', duration: 15000 }
    ];

    // Randomize starting image on page refresh
    let currentImageIndex = Math.floor(Math.random() * backgroundSequence.length);
    console.log('Starting with random image index:', currentImageIndex, '- Image:', backgroundSequence[currentImageIndex].src);

    // Preload all images for smoother transitions
    backgroundSequence.forEach(item => {
        const img = new Image();
        img.src = item.src;
        console.log('Preloading image:', item.src);
    });

    function changeBackgroundImage(index) {
        const currentImage = backgroundSequence[index];
        
        // Apply fade transition via CSS
        heroBackground.style.transition = 'opacity 0.8s ease-in-out';
        heroBackground.style.opacity = '0.7';
        
        // Change background image after brief fade
        setTimeout(() => {
            heroBackground.style.backgroundImage = `url('${currentImage.src}')`;
            heroBackground.style.opacity = '1';
            console.log('Background changed to:', currentImage.src, '- Duration: 15s');
            
            // Schedule the next change
            const nextIndex = (index + 1) % backgroundSequence.length;
            setTimeout(() => changeBackgroundImage(nextIndex), currentImage.duration);
        }, 400); // Brief fade duration
    }

    // Start the rotation with random image
    console.log('Starting mobile background rotation with', backgroundSequence.length, 'images, 15s intervals');
    changeBackgroundImage(currentImageIndex);
}

// Responsive Grid Management
function initResponsiveGrid() {
    const hero = document.querySelector('.hero');
    
    function updateGridColumns() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        let gridColumns = 2;
        
        if (viewportWidth <= 567) {
            // Mobile portrait: 2 columns
            gridColumns = 2;
        } else if (viewportWidth <= 767 && viewportHeight > viewportWidth) {
            // Mobile portrait: 2 columns
            gridColumns = 2;
        } else if (viewportWidth <= 767 && viewportHeight <= viewportWidth) {
            // Mobile landscape: 4 columns
            gridColumns = 4;
        } else {
            // Tablet and above: 4 columns
            gridColumns = 4;
        }
        
        hero.style.setProperty('--grid-columns', gridColumns.toString());
        
        // Log responsive state for debugging
        console.log('Responsive Grid Update:', {
            viewportWidth,
            viewportHeight,
            gridColumns,
            orientation: viewportHeight > viewportWidth ? 'portrait' : 'landscape'
        });
    }
    
    // Initial call
    updateGridColumns();
    
    // Update on resize and orientation change
    window.addEventListener('resize', updateGridColumns);
    window.addEventListener('orientationchange', () => {
        setTimeout(updateGridColumns, 100);
    });
}

// Hero Video Background Handler
function initHeroVideo() {
    const heroVideo = document.querySelector('.hero__video-content');
    
    if (heroVideo) {
        // Handle video loading and fallback
        heroVideo.addEventListener('loadeddata', function() {
            console.log('Hero video loaded successfully');
        });
        
        heroVideo.addEventListener('error', function() {
            console.log('Hero video failed to load, using fallback');
            // Hide video container and show fallback background
            const videoContainer = document.querySelector('.hero__video');
            if (videoContainer) {
                videoContainer.style.display = 'none';
            }
        });
        
        // Pause video when not in viewport (mobile battery optimization)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroVideo.play().catch(e => console.log('Video autoplay prevented'));
                } else {
                    heroVideo.pause();
                }
            });
        });
        
        observer.observe(heroVideo);
    }
}

// Scroll Indicator Click Handler
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.hero__scroll');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = aboutSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
        
        // Add cursor pointer
        scrollIndicator.style.cursor = 'pointer';
    }
}

// Hero Skills Animation on Scroll
function initHeroSkillsAnimation() {
    const heroSkills = document.querySelectorAll('.hero__skill');
    
    if (heroSkills.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation for each skill
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.1
        });
        
        heroSkills.forEach(skill => {
            // Set initial state
            skill.style.opacity = '0';
            skill.style.transform = 'translateY(20px)';
            skill.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            observer.observe(skill);
        });
    }
}

// ===== ABOUT SECTION FUNCTIONALITY =====

// Lazy Loading for Profile Image
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazy');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    });
                }
            });
        }, {
            rootMargin: '50px'
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
}

// About Section Animations and Interactions
function initAboutSection() {
    const aboutSection = document.querySelector('.about');
    if (!aboutSection) return;
    
    // Initialize lazy loading for images
    initLazyLoading();
    
    // Initialize skill items with hover effects
    const skillItems = document.querySelectorAll('.about__skill-item');
    const toolItems = document.querySelectorAll('.about__tool-item');
    
    // Add touch feedback for mobile devices
    function addTouchFeedback(elements) {
        elements.forEach(item => {
            // Touch start effect
            item.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
                this.style.transition = 'transform 0.1s ease';
            });
            
            // Touch end effect
            item.addEventListener('touchend', function() {
                this.style.transform = '';
                this.style.transition = 'transform 0.3s ease';
            });
            
            // Touch cancel effect
            item.addEventListener('touchcancel', function() {
                this.style.transform = '';
                this.style.transition = 'transform 0.3s ease';
            });
        });
    }
    
    // Add touch feedback to skill and tool items
    addTouchFeedback(skillItems);
    addTouchFeedback(toolItems);
    
    // Enhanced mobile touch feedback for tool items
    toolItems.forEach(item => {
        // Long press feedback for tools
        let pressTimer;
        
        item.addEventListener('touchstart', function(e) {
            this.style.transform = 'scale(0.95)';
            this.style.transition = 'transform 0.1s ease';
            
            // Start long press detection
            pressTimer = setTimeout(() => {
                // Add visual feedback for long press
                this.style.boxShadow = '0 6px 20px rgba(255, 105, 180, 0.3)';
                this.style.borderColor = 'var(--primary-pink)';
                
                // Haptic feedback if available
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            }, 500);
        });
        
        item.addEventListener('touchmove', function() {
            clearTimeout(pressTimer);
        });
        
        item.addEventListener('touchend', function() {
            clearTimeout(pressTimer);
            this.style.transform = '';
            this.style.transition = 'transform 0.3s ease';
            this.style.boxShadow = '';
            this.style.borderColor = '';
        });
        
        item.addEventListener('touchcancel', function() {
            clearTimeout(pressTimer);
            this.style.transform = '';
            this.style.transition = 'transform 0.3s ease';
            this.style.boxShadow = '';
            this.style.borderColor = '';
        });
    });
    
    // Initialize scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for each element
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // Observe skill and tool items for animations
    [...skillItems, ...toolItems].forEach((item, index) => {
        // Set initial state
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        observer.observe(item);
    });
    
    // Profile section animation
    const profileSection = document.querySelector('.about__profile');
    if (profileSection) {
        profileSection.style.opacity = '0';
        profileSection.style.transform = 'translateY(30px)';
        profileSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        const profileObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 200);
                }
            });
        }, { threshold: 0.2 });
        
        profileObserver.observe(profileSection);
    }
    
    // CTA section animation
    const ctaSection = document.querySelector('.about__cta');
    if (ctaSection) {
        ctaSection.style.opacity = '0';
        ctaSection.style.transform = 'scale(0.95)';
        ctaSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'scale(1)';
                    }, 400);
                }
            });
        }, { threshold: 0.2 });
        
        ctaObserver.observe(ctaSection);
    }
    
    console.log('About section functionality initialized');
}

// ===== SERVICES SECTION FUNCTIONALITY =====

// Services Section Animations and Interactions
function initServicesSection() {
    const servicesSection = document.querySelector('.services');
    if (!servicesSection) return;
    
    const serviceCards = document.querySelectorAll('.services__card');
    const servicesHeader = document.querySelector('.services__header');
    const servicesCta = document.querySelector('.services__cta');
    
    // Add touch feedback for service cards (mobile-first)
    function addServiceCardTouchFeedback() {
        serviceCards.forEach(card => {
            let pressTimer;
            
            // Touch start effect
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98) translateY(-2px)';
                this.style.transition = 'transform 0.1s ease';
                
                // Start long press detection for mobile
                pressTimer = setTimeout(() => {
                    // Add haptic feedback if available
                    if (navigator.vibrate) {
                        navigator.vibrate(50);
                    }
                    
                    // Enhanced visual feedback for long press
                    this.style.boxShadow = '0 8px 32px rgba(255, 105, 180, 0.4)';
                    this.style.borderColor = 'var(--primary-pink)';
                }, 500);
            });
            
            // Touch move cancels long press
            card.addEventListener('touchmove', function() {
                clearTimeout(pressTimer);
            });
            
            // Touch end effect
            card.addEventListener('touchend', function() {
                clearTimeout(pressTimer);
                this.style.transform = '';
                this.style.transition = 'transform 0.3s ease';
                this.style.boxShadow = '';
                this.style.borderColor = '';
            });
            
            // Touch cancel effect
            card.addEventListener('touchcancel', function() {
                clearTimeout(pressTimer);
                this.style.transform = '';
                this.style.transition = 'transform 0.3s ease';
                this.style.boxShadow = '';
                this.style.borderColor = '';
            });
        });
    }
    
    // Initialize touch feedback
    addServiceCardTouchFeedback();
    
    // Scroll-triggered animations for service cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for each card
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150); // 150ms stagger between cards
            }
        });
    }, observerOptions);
    
    // Set initial state and observe service cards
    serviceCards.forEach((card, index) => {
        // Set initial state for animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        cardObserver.observe(card);
    });
    
    // Header animation
    if (servicesHeader) {
        servicesHeader.style.opacity = '0';
        servicesHeader.style.transform = 'translateY(30px)';
        servicesHeader.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        const headerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                }
            });
        }, { threshold: 0.2 });
        
        headerObserver.observe(servicesHeader);
    }
    
    // CTA section animation
    if (servicesCta) {
        servicesCta.style.opacity = '0';
        servicesCta.style.transform = 'scale(0.95) translateY(20px)';
        servicesCta.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'scale(1) translateY(0)';
                    }, 600); // Delay after cards
                }
            });
        }, { threshold: 0.2 });
        
        ctaObserver.observe(servicesCta);
    }
    
    // Service card click handlers for mobile analytics (optional)
    serviceCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            console.log(`Service card clicked: ${card.querySelector('.services__card-title')?.textContent}`);
            
            // Add temporary visual feedback
            const icon = card.querySelector('.services__icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(15deg)';
                setTimeout(() => {
                    icon.style.transform = '';
                }, 300);
            }
        });
    });
    
    console.log('Services section functionality initialized with', serviceCards.length, 'service cards');
}

// ===== CONTACT SECTION FUNCTIONALITY =====

// Contact Section Form Validation and Touch Interactions
function initContactSection() {
    const contactSection = document.querySelector('.contact');
    if (!contactSection) return;
    
    const contactForm = document.getElementById('contactForm');
    const formInputs = contactForm.querySelectorAll('.contact__input, .contact__select, .contact__textarea');
    const submitButton = contactForm.querySelector('.contact__submit');
    const formStatus = document.getElementById('formStatus');
    const socialLinks = document.querySelectorAll('.contact__social-link');
    const contactMethods = document.querySelectorAll('.contact__method');
    
    // Form validation rules
    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s'-]+$/,
            message: 'Please enter a valid name (2+ characters, letters only)'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 1000,
            message: 'Message must be between 10-1000 characters'
        }
    };
    
    // Validate single field
    function validateField(input) {
        const fieldName = input.name;
        const value = input.value.trim();
        const rules = validationRules[fieldName];
        const errorElement = document.getElementById(fieldName + 'Error');
        
        if (!rules) return true;
        
        let isValid = true;
        let errorMessage = '';
        
        // Required field check
        if (rules.required && !value) {
            isValid = false;
            errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        }
        // Min length check
        else if (rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = rules.message || `Minimum ${rules.minLength} characters required`;
        }
        // Max length check
        else if (rules.maxLength && value.length > rules.maxLength) {
            isValid = false;
            errorMessage = rules.message || `Maximum ${rules.maxLength} characters allowed`;
        }
        // Pattern check
        else if (rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = rules.message || 'Invalid format';
        }
        
        // Update field styling and error message
        if (isValid) {
            input.style.borderColor = 'var(--border-color)';
            input.style.boxShadow = '';
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        } else {
            input.style.borderColor = '#ff4757';
            input.style.boxShadow = '0 0 0 3px rgba(255, 71, 87, 0.2)';
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        }
        
        return isValid;
    }
    
    // Validate entire form
    function validateForm() {
        let isFormValid = true;
        
        formInputs.forEach(input => {
            if (input.name && validationRules[input.name]) {
                const fieldValid = validateField(input);
                if (!fieldValid) isFormValid = false;
            }
        });
        
        return isFormValid;
    }
    
    // Show form status message
    function showFormStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `contact__form-status ${type}`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            formStatus.classList.remove('success', 'error');
            formStatus.style.opacity = '0';
        }, 5000);
    }
    
    // Real-time validation on input
    formInputs.forEach(input => {
        // Validate on blur (when user leaves field)
        input.addEventListener('blur', () => {
            if (input.value.trim()) {
                validateField(input);
            }
        });
        
        // Clear errors on focus
        input.addEventListener('focus', () => {
            const errorElement = document.getElementById(input.name + 'Error');
            if (errorElement) {
                errorElement.classList.remove('show');
                input.style.borderColor = 'var(--primary-pink)';
                input.style.boxShadow = '0 0 0 3px rgba(255, 105, 180, 0.2)';
            }
        });
        
        // Real-time validation for required fields as user types
        input.addEventListener('input', () => {
            if (input.name === 'email' && input.value.length > 5) {
                validateField(input);
            }
            if (input.name === 'message' && input.value.length > 10) {
                validateField(input);
            }
        });
    });
    
    // Form submission handling
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate form
        const isValid = validateForm();
        
        if (!isValid) {
            showFormStatus('Please correct the errors above before submitting.', 'error');
            
            // Add haptic feedback on mobile
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
            
            // Focus first invalid field
            const firstError = contactForm.querySelector('.contact__error.show');
            if (firstError) {
                const fieldName = firstError.id.replace('Error', '');
                const field = contactForm.querySelector(`[name="${fieldName}"]`);
                if (field) {
                    field.focus();
                    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
            return;
        }
        
        // Show loading state
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success simulation
            if (Math.random() > 0.2) { // 80% success rate for demo
                showFormStatus('Thank you! Your message has been sent successfully. I\'ll get back to you within 24 hours.', 'success');
                contactForm.reset();
                
                // Success haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate(200);
                }
                
                // Scroll to success message
                formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            showFormStatus('Sorry, there was an error sending your message. Please try again or contact me directly.', 'error');
            
            // Error haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100, 50, 100]);
            }
        } finally {
            // Restore button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
    
    // Touch feedback for social links and contact methods
    function addContactTouchFeedback() {
        [...socialLinks, ...contactMethods].forEach(element => {
            let pressTimer;
            
            // Touch start effect
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
                this.style.transition = 'transform 0.1s ease';
                
                // Long press detection
                pressTimer = setTimeout(() => {
                    if (navigator.vibrate) {
                        navigator.vibrate(50);
                    }
                    this.style.transform = 'scale(0.95)';
                    this.style.boxShadow = '0 4px 12px rgba(255, 105, 180, 0.4)';
                }, 500);
            });
            
            // Touch move cancels long press
            element.addEventListener('touchmove', function() {
                clearTimeout(pressTimer);
            });
            
            // Touch end effect
            element.addEventListener('touchend', function() {
                clearTimeout(pressTimer);
                this.style.transform = '';
                this.style.transition = 'transform 0.3s ease';
                this.style.boxShadow = '';
            });
            
            // Touch cancel effect
            element.addEventListener('touchcancel', function() {
                clearTimeout(pressTimer);
                this.style.transform = '';
                this.style.transition = 'transform 0.3s ease';
                this.style.boxShadow = '';
            });
        });
    }
    
    // Initialize touch feedback
    addContactTouchFeedback();
    
    // Scroll-triggered animations for contact section
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Stagger animation for form and info sections
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
            }
        });
    }, observerOptions);
    
    // Set initial state and observe contact elements
    const contactElements = [contactForm, document.querySelector('.contact__info-card')];
    contactElements.forEach((element, index) => {
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            setTimeout(() => {
                contactObserver.observe(element);
            }, index * 200);
        }
    });
    
    // Character counter for message field
    const messageField = document.getElementById('contactMessage');
    if (messageField) {
        const messageGroup = messageField.closest('.contact__form-group');
        const counter = document.createElement('div');
        counter.className = 'contact__char-counter';
        counter.style.cssText = `
            font-size: var(--font-size-xs);
            color: var(--text-muted);
            text-align: right;
            margin-top: var(--spacing-xs);
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        messageGroup.appendChild(counter);
        
        messageField.addEventListener('input', () => {
            const length = messageField.value.length;
            const maxLength = validationRules.message.maxLength;
            counter.textContent = `${length}/${maxLength} characters`;
            counter.style.opacity = length > 0 ? '1' : '0';
            
            if (length > maxLength * 0.9) {
                counter.style.color = '#ff4757';
            } else {
                counter.style.color = 'var(--text-muted)';
            }
        });
    }
    
    console.log('Contact section functionality initialized with form validation and touch interactions');
}

// ===== PERFORMANCE OPTIMIZATION - LAZY LOADING =====

// Advanced Lazy Loading System
function initLazyLoading() {
    // Enhanced lazy loading for images
    function setupImageLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"], img.lazy');
        
        if (!lazyImages.length) return;
        
        // Check for Intersection Observer support
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Add loading class for visual feedback
                        img.classList.add('loading');
                        
                        // Handle data-src for advanced lazy loading
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        
                        // Handle srcset for responsive images
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                        }
                        
                        // Handle sizes attribute
                        if (img.dataset.sizes) {
                            img.sizes = img.dataset.sizes;
                        }
                        
                        // Image load success handler
                        img.addEventListener('load', () => {
                            img.classList.remove('loading');
                            img.classList.add('loaded');
                            
                            // Add fade-in animation
                            img.style.opacity = '0';
                            img.style.transition = 'opacity 0.3s ease';
                            
                            requestAnimationFrame(() => {
                                img.style.opacity = '1';
                            });
                        });
                        
                        // Image load error handler
                        img.addEventListener('error', () => {
                            img.classList.remove('loading');
                            img.classList.add('error');
                            console.warn('Failed to load image:', img.src);
                        });
                        
                        // Stop observing this image
                        observer.unobserve(img);
                    }
                });
            }, {
                // Load images 50px before they come into view
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
            
            console.log('Lazy loading initialized for', lazyImages.length, 'images');
        } else {
            // Fallback for browsers without Intersection Observer
            lazyImages.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                }
                img.classList.add('loaded');
            });
            
            console.log('Lazy loading fallback applied to', lazyImages.length, 'images');
        }
    }
    
    // Lazy loading for videos
    function setupVideoLazyLoading() {
        const lazyVideos = document.querySelectorAll('video[data-src], video.lazy');
        
        if (!lazyVideos.length) return;
        
        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const video = entry.target;
                        
                        // Load video sources
                        if (video.dataset.src) {
                            // For single source videos
                            video.src = video.dataset.src;
                        } else {
                            // For videos with multiple source elements
                            const sources = video.querySelectorAll('source[data-src]');
                            sources.forEach(source => {
                                source.src = source.dataset.src;
                                source.removeAttribute('data-src');
                            });
                            video.load(); // Reload video with new sources
                        }
                        
                        // Add loading state
                        video.classList.add('loading');
                        
                        // Video load handlers
                        video.addEventListener('loadeddata', () => {
                            video.classList.remove('loading');
                            video.classList.add('loaded');
                        });
                        
                        video.addEventListener('error', () => {
                            video.classList.remove('loading');
                            video.classList.add('error');
                            console.warn('Failed to load video:', video.src);
                        });
                        
                        // Stop observing this video
                        observer.unobserve(video);
                    }
                });
            }, {
                rootMargin: '100px 0px', // Larger margin for videos
                threshold: 0.01
            });
            
            lazyVideos.forEach(video => {
                videoObserver.observe(video);
            });
            
            console.log('Lazy loading initialized for', lazyVideos.length, 'videos');
        } else {
            // Fallback for browsers without Intersection Observer
            lazyVideos.forEach(video => {
                if (video.dataset.src) {
                    video.src = video.dataset.src;
                }
                const sources = video.querySelectorAll('source[data-src]');
                sources.forEach(source => {
                    source.src = source.dataset.src;
                });
                if (sources.length > 0) {
                    video.load();
                }
                video.classList.add('loaded');
            });
        }
    }
    
    // Progressive image enhancement
    function setupProgressiveImages() {
        const progressiveImages = document.querySelectorAll('img[data-progressive]');
        
        progressiveImages.forEach(img => {
            // Create low-quality placeholder
            const placeholder = new Image();
            placeholder.src = img.dataset.progressive;
            placeholder.style.filter = 'blur(5px)';
            placeholder.style.transition = 'filter 0.3s ease';
            
            // Replace with high-quality image when loaded
            const highQualityImg = new Image();
            highQualityImg.onload = () => {
                img.src = highQualityImg.src;
                img.style.filter = 'none';
            };
            highQualityImg.src = img.dataset.src || img.src;
        });
    }
    
    // Initialize all lazy loading features
    setupImageLazyLoading();
    setupVideoLazyLoading();
    setupProgressiveImages();
    
    // Performance monitoring
    if ('performance' in window && 'measure' in performance) {
        performance.mark('lazy-loading-start');
        
        // Measure lazy loading impact
        setTimeout(() => {
            performance.mark('lazy-loading-end');
            performance.measure('lazy-loading-duration', 'lazy-loading-start', 'lazy-loading-end');
            
            const measure = performance.getEntriesByName('lazy-loading-duration')[0];
            if (measure) {
                console.log('Lazy loading initialization took:', measure.duration.toFixed(2), 'ms');
            }
        }, 100);
    }
    
    console.log('Performance optimization: Lazy loading system initialized');
}

// WebP Format Support and Optimization
function initWebPSupport() {
    // Check if browser supports WebP
    function supportsWebP() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }
    
    // Add WebP support class to document
    async function addWebPSupportClass() {
        const hasWebPSupport = await supportsWebP();
        
        if (hasWebPSupport) {
            document.documentElement.classList.add('webp');
            console.log('WebP format supported');
        } else {
            document.documentElement.classList.add('no-webp');
            console.log('WebP format not supported, using fallbacks');
        }
        
        return hasWebPSupport;
    }
    
    // Convert images to WebP when supported
    function optimizeImageFormats() {
        const images = document.querySelectorAll('img[data-webp]');
        
        images.forEach(img => {
            if (document.documentElement.classList.contains('webp')) {
                // Use WebP version
                const webpSrc = img.dataset.webp;
                const webpSrcset = img.dataset.webpSrcset;
                
                if (webpSrc) {
                    img.src = webpSrc;
                }
                
                if (webpSrcset) {
                    img.srcset = webpSrcset;
                }
                
                img.classList.add('webp-optimized');
            } else {
                // Keep original format
                img.classList.add('fallback-format');
            }
        });
    }
    
    // Progressive image enhancement with WebP
    function setupProgressiveWebP() {
        const progressiveImages = document.querySelectorAll('img[data-progressive-webp]');
        
        progressiveImages.forEach(img => {
            const supportsWebP = document.documentElement.classList.contains('webp');
            const placeholder = img.dataset.progressive;
            const highQuality = supportsWebP ? img.dataset.progressiveWebp : img.dataset.src;
            
            // Start with low-quality placeholder
            if (placeholder) {
                img.src = placeholder;
                img.style.filter = 'blur(2px)';
                img.style.transition = 'filter 0.3s ease';
            }
            
            // Load high-quality image
            const highQualityImg = new Image();
            highQualityImg.onload = () => {
                img.src = highQuality;
                img.style.filter = 'none';
                img.classList.add('progressive-loaded');
            };
            highQualityImg.onerror = () => {
                // Fallback to original if WebP fails
                if (supportsWebP && img.dataset.src) {
                    img.src = img.dataset.src;
                    img.style.filter = 'none';
                }
            };
            highQualityImg.src = highQuality;
        });
    }
    
    // Image format optimization based on connection speed
    function optimizeForConnection() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            const effectiveType = connection.effectiveType;
            
            // Use lower quality on slow connections
            if (effectiveType === 'slow-2g' || effectiveType === '2g') {
                document.documentElement.classList.add('slow-connection');
                
                // Replace high-quality images with compressed versions
                const images = document.querySelectorAll('img[data-low-quality]');
                images.forEach(img => {
                    img.src = img.dataset.lowQuality;
                    img.removeAttribute('srcset'); // Remove responsive images
                });
                
                console.log('Slow connection detected, using low-quality images');
            } else if (effectiveType === '3g') {
                document.documentElement.classList.add('medium-connection');
                console.log('Medium connection detected, using balanced quality');
            } else {
                document.documentElement.classList.add('fast-connection');
                console.log('Fast connection detected, using high-quality images');
            }
        }
    }
    
    // Initialize WebP support
    addWebPSupportClass().then(() => {
        optimizeImageFormats();
        setupProgressiveWebP();
        optimizeForConnection();
    });
    
    console.log('Performance optimization: WebP support system initialized');
}

// Video Format Optimization and Progressive Loading
function initVideoOptimization() {
    // Check browser video format support
    function getVideoFormatSupport() {
        const video = document.createElement('video');
        const formats = {
            webm: video.canPlayType('video/webm; codecs="vp8, vorbis"') !== '',
            webmVP9: video.canPlayType('video/webm; codecs="vp9"') !== '',
            mp4: video.canPlayType('video/mp4; codecs="avc1.42E01E"') !== '',
            mp4H265: video.canPlayType('video/mp4; codecs="hvc1"') !== '',
            av1: video.canPlayType('video/mp4; codecs="av01.0.05M.08"') !== ''
        };
        
        console.log('Video format support:', formats);
        return formats;
    }
    
    // Optimize video sources based on browser support
    function optimizeVideoSources() {
        const videos = document.querySelectorAll('video');
        const formatSupport = getVideoFormatSupport();
        
        videos.forEach(video => {
            const sources = video.querySelectorAll('source');
            let hasOptimalSource = false;
            
            // Prioritize formats: WebM VP9 > WebM VP8 > MP4 H.265 > MP4 H.264
            const formatPriority = ['webm', 'mp4'];
            
            formatPriority.forEach(format => {
                if (!hasOptimalSource) {
                    sources.forEach(source => {
                        const type = source.getAttribute('type');
                        if (type && type.includes(format)) {
                            if ((format === 'webm' && formatSupport.webm) || 
                                (format === 'mp4' && formatSupport.mp4)) {
                                source.style.order = '1'; // Prioritize this source
                                hasOptimalSource = true;
                            }
                        }
                    });
                }
            });
            
            // Add data attributes for monitoring
            video.setAttribute('data-optimized', 'true');
        });
    }
    
    // Progressive video loading based on viewport and connection
    function setupProgressiveVideoLoading() {
        const videos = document.querySelectorAll('video[data-progressive]');
        
        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const video = entry.target;
                        loadVideoProgressive(video);
                        videoObserver.unobserve(video);
                    }
                });
            }, {
                rootMargin: '200px 0px', // Start loading before video is visible
                threshold: 0.1
            });
            
            videos.forEach(video => {
                videoObserver.observe(video);
            });
        }
    }
    
    // Load video with progressive enhancement
    function loadVideoProgressive(video) {
        const connection = navigator.connection;
        let qualityLevel = 'high'; // Default to high quality
        
        // Determine quality based on connection
        if (connection) {
            const effectiveType = connection.effectiveType;
            const downlink = connection.downlink; // Mbps
            
            if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 1) {
                qualityLevel = 'low';
            } else if (effectiveType === '3g' || downlink < 4) {
                qualityLevel = 'medium';
            }
        }
        
        // Check if mobile device
        const isMobile = window.innerWidth <= 768;
        if (isMobile && qualityLevel === 'high') {
            qualityLevel = 'medium'; // Reduce quality on mobile
        }
        
        // Load appropriate quality sources
        const sources = video.querySelectorAll('source');
        sources.forEach(source => {
            const dataSrc = source.getAttribute('data-src');
            const dataQuality = source.getAttribute('data-quality');
            
            if (dataSrc && (!dataQuality || dataQuality === qualityLevel)) {
                source.src = dataSrc;
                source.removeAttribute('data-src');
            }
        });
        
        // Add loading state
        video.classList.add('loading');
        
        // Load the video
        video.load();
        
        // Handle loading events
        video.addEventListener('loadstart', () => {
            console.log('Video loading started:', video.src);
        });
        
        video.addEventListener('loadeddata', () => {
            video.classList.remove('loading');
            video.classList.add('loaded');
            console.log('Video loaded successfully:', video.src);
        });
        
        video.addEventListener('error', (e) => {
            video.classList.remove('loading');
            video.classList.add('error');
            console.error('Video loading failed:', e);
            
            // Try fallback source
            tryVideoFallback(video);
        });
    }
    
    // Try fallback video source on error
    function tryVideoFallback(video) {
        const fallbackSrc = video.getAttribute('data-fallback');
        if (fallbackSrc && video.src !== fallbackSrc) {
            console.log('Trying fallback video source:', fallbackSrc);
            video.src = fallbackSrc;
            video.load();
        }
    }
    
    // Video preloading optimization
    function optimizeVideoPreloading() {
        const videos = document.querySelectorAll('video');
        
        videos.forEach(video => {
            // Set preload strategy based on video importance and connection
            const isHeroVideo = video.closest('.hero');
            const connection = navigator.connection;
            
            if (isHeroVideo) {
                // Hero videos should preload metadata at minimum
                video.preload = connection && connection.effectiveType === 'slow-2g' ? 'none' : 'metadata';
            } else {
                // Other videos load only when needed
                video.preload = 'none';
            }
            
            // Add intersection observer for autoplay videos
            if (video.hasAttribute('data-autoplay')) {
                setupVideoAutoplay(video);
            }
        });
    }
    
    // Setup smart video autoplay
    function setupVideoAutoplay(video) {
        if ('IntersectionObserver' in window) {
            const playObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Only autoplay if video is ready
                        if (video.readyState >= 3) {
                            video.play().catch(e => {
                                console.log('Autoplay failed:', e);
                            });
                        }
                    } else {
                        video.pause();
                    }
                });
            }, {
                threshold: 0.5 // Play when 50% visible
            });
            
            playObserver.observe(video);
        }
    }
    
    // Monitor video performance
    function monitorVideoPerformance() {
        const videos = document.querySelectorAll('video');
        
        videos.forEach((video, index) => {
            let startTime = performance.now();
            
            video.addEventListener('loadstart', () => {
                startTime = performance.now();
            });
            
            video.addEventListener('canplaythrough', () => {
                const loadTime = performance.now() - startTime;
                console.log(`Video ${index + 1} load time: ${loadTime.toFixed(2)}ms`);
                
                // Log slow loading videos
                if (loadTime > 5000) {
                    console.warn(`Video ${index + 1} is loading slowly (${loadTime.toFixed(2)}ms)`);
                }
            });
        });
    }
    
    // Initialize all video optimizations
    optimizeVideoSources();
    setupProgressiveVideoLoading();
    optimizeVideoPreloading();
    monitorVideoPerformance();
    
    console.log('Performance optimization: Video optimization system initialized');
}

// Advanced Preload Strategies for Critical Assets
function initPreloadStrategies() {
    // Critical resource preloading
    function preloadCriticalAssets() {
        const criticalAssets = [
            // Critical CSS for above-the-fold content
            { href: 'css/buttons.css', as: 'style', priority: 'high' },
            { href: 'css/video-modal.css', as: 'style', priority: 'low' },
            
            // Critical JavaScript
            { href: 'js/video-modal.js', as: 'script', priority: 'low' },
            
            // Critical images for hero section
            { href: 'assets/images/freepik-3.webp', as: 'image', priority: 'high' },
            { href: 'assets/images/freepik-4.webp', as: 'image', priority: 'high' },
            
            // Profile image (above-the-fold)
            { href: 'assets/images/mmaAnime1.png', as: 'image', priority: 'medium' }
        ];
        
        criticalAssets.forEach(asset => {
            // Check if already preloaded in HTML
            const existingPreload = document.querySelector(`link[rel="preload"][href="${asset.href}"]`);
            
            if (!existingPreload) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = asset.href;
                link.as = asset.as;
                
                // Set priority if supported
                if ('fetchPriority' in link) {
                    link.fetchPriority = asset.priority;
                }
                
                document.head.appendChild(link);
                console.log('Preloaded:', asset.href, 'Priority:', asset.priority);
            }
        });
    }
    
    // Intelligent asset prefetching based on user behavior
    function setupIntelligentPrefetch() {
        // Prefetch next section assets when user scrolls near them
        const sections = ['#about', '#work', '#services', '#contact'];
        let prefetchedSections = new Set();
        
        if ('IntersectionObserver' in window) {
            const prefetchObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.id;
                        
                        if (!prefetchedSections.has(sectionId)) {
                            prefetchSectionAssets(sectionId);
                            prefetchedSections.add(sectionId);
                        }
                    }
                });
            }, {
                rootMargin: '300px 0px', // Prefetch when 300px away
                threshold: 0.1
            });
            
            sections.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    prefetchObserver.observe(element);
                }
            });
        }
    }
    
    // Prefetch assets for specific sections
    function prefetchSectionAssets(sectionId) {
        const sectionAssets = {
            'work': [
                'assets/videos/videothumbnail1.webp',
                'assets/videos/Backyard_4K_Living_Background.mp4'
            ],
            'services': [
                // Services section typically doesn't have heavy assets
            ],
            'about': [
                'assets/images/Cinema 4D.webp',
                'assets/images/Pro Tools.webp',
                'assets/images/CapCut.webp'
            ],
            'contact': [
                // Contact section typically doesn't have heavy assets
            ]
        };
        
        const assets = sectionAssets[sectionId] || [];
        
        assets.forEach(assetUrl => {
            // Use different strategies based on asset type
            if (assetUrl.includes('.mp4') || assetUrl.includes('.webm')) {
                // Prefetch videos with low priority
                prefetchVideo(assetUrl);
            } else if (assetUrl.includes('.webp') || assetUrl.includes('.jpg') || assetUrl.includes('.png')) {
                // Prefetch images
                prefetchImage(assetUrl);
            }
        });
        
        console.log('Prefetched assets for section:', sectionId);
    }
    
    // Prefetch images
    function prefetchImage(url) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        link.as = 'image';
        document.head.appendChild(link);
    }
    
    // Prefetch videos
    function prefetchVideo(url) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        link.as = 'video';
        document.head.appendChild(link);
    }
    
    // Connection-aware preloading
    function adaptPreloadingToConnection() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            const effectiveType = connection.effectiveType;
            
            // Adjust preloading strategy based on connection
            if (effectiveType === 'slow-2g' || effectiveType === '2g') {
                // Minimal preloading on slow connections
                console.log('Slow connection detected: Minimal preloading');
                return false; // Skip aggressive preloading
            } else if (effectiveType === '3g') {
                // Moderate preloading on 3G
                console.log('3G connection detected: Moderate preloading');
                return true;
            } else {
                // Aggressive preloading on fast connections
                console.log('Fast connection detected: Aggressive preloading');
                return true;
            }
        }
        
        return true; // Default to preloading if connection info unavailable
    }
    
    // Resource hints for external domains
    function addResourceHints() {
        const externalDomains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://cdnjs.cloudflare.com',
            'https://cdn.tailwindcss.com'
        ];
        
        externalDomains.forEach(domain => {
            // Check if dns-prefetch already exists
            const existingHint = document.querySelector(`link[rel="dns-prefetch"][href*="${domain}"]`);
            
            if (!existingHint) {
                const link = document.createElement('link');
                link.rel = 'dns-prefetch';
                link.href = domain;
                document.head.appendChild(link);
            }
        });
    }
    
    // Monitor and optimize Critical Web Vitals
    function optimizeCriticalWebVitals() {
        // Largest Contentful Paint (LCP) optimization
        function optimizeLCP() {
            // Identify LCP candidates
            const lcpCandidates = document.querySelectorAll('img, video, [style*="background-image"]');
            
            lcpCandidates.forEach(element => {
                // Add high priority to potential LCP elements
                if (element.tagName === 'IMG' && element.loading !== 'lazy') {
                    element.fetchPriority = 'high';
                }
            });
        }
        
        // First Input Delay (FID) optimization
        function optimizeFID() {
            // Defer non-critical JavaScript
            const nonCriticalScripts = document.querySelectorAll('script[data-defer]');
            
            nonCriticalScripts.forEach(script => {
                script.defer = true;
            });
        }
        
        // Cumulative Layout Shift (CLS) optimization
        function optimizeCLS() {
            // Add dimensions to images without them
            const images = document.querySelectorAll('img:not([width]):not([height])');
            
            images.forEach(img => {
                // Set aspect ratio to prevent layout shift
                img.style.aspectRatio = '16/9'; // Default aspect ratio
            });
        }
        
        optimizeLCP();
        optimizeFID();
        optimizeCLS();
    }
    
    // Initialize preload strategies based on connection
    const shouldPreload = adaptPreloadingToConnection();
    
    if (shouldPreload) {
        preloadCriticalAssets();
        setupIntelligentPrefetch();
    }
    
    addResourceHints();
    optimizeCriticalWebVitals();
    
    console.log('Performance optimization: Preload strategies initialized');
}

// Responsive Images Optimization
function initResponsiveImages() {
    // Generate responsive image srcsets programmatically
    function generateResponsiveSrcsets() {
        const images = document.querySelectorAll('img[data-responsive]');
        
        images.forEach(img => {
            const baseSrc = img.src;
            const sizes = img.dataset.sizes ? img.dataset.sizes.split(',') : ['400', '800', '1200'];
            const format = img.dataset.format || 'webp';
            
            // Generate srcset
            const srcsetArray = sizes.map(size => {
                const responsiveSrc = baseSrc.replace(/\.(\w+)$/, `-${size}.${format}`);
                return `${responsiveSrc} ${size}w`;
            });
            
            img.srcset = srcsetArray.join(', ');
            
            // Generate sizes attribute if not provided
            if (!img.sizes) {
                const sizesArray = sizes.map((size, index) => {
                    if (index === sizes.length - 1) {
                        return `${size}px`;
                    }
                    const breakpoint = parseInt(size) * 1.5; // Mobile breakpoint
                    return `(max-width: ${breakpoint}px) ${size}px`;
                });
                
                img.sizes = sizesArray.join(', ');
            }
        });
    }
    
    // Device pixel ratio optimization
    function optimizeForDevicePixelRatio() {
        const devicePixelRatio = window.devicePixelRatio || 1;
        const isHighDPI = devicePixelRatio > 1;
        
        if (isHighDPI) {
            document.documentElement.classList.add('high-dpi');
            
            // Enhance images for high-DPI displays
            const images = document.querySelectorAll('img[data-2x]');
            images.forEach(img => {
                if (devicePixelRatio >= 2) {
                    img.src = img.dataset['2x'];
                }
                if (devicePixelRatio >= 3 && img.dataset['3x']) {
                    img.src = img.dataset['3x'];
                }
            });
        }
        
        console.log('Device pixel ratio:', devicePixelRatio, '- High DPI:', isHighDPI);
    }
    
    // Viewport-based image optimization
    function optimizeForViewport() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Classify viewport size
        let viewportClass = 'large';
        if (viewportWidth <= 480) {
            viewportClass = 'small';
        } else if (viewportWidth <= 768) {
            viewportClass = 'medium';
        }
        
        document.documentElement.setAttribute('data-viewport', viewportClass);
        
        // Optimize images based on viewport
        const images = document.querySelectorAll('img[data-viewport-src]');
        images.forEach(img => {
            const viewportSrc = img.dataset[`${viewportClass}Src`];
            if (viewportSrc) {
                img.src = viewportSrc;
            }
        });
        
        console.log('Viewport optimized for:', viewportClass, `(${viewportWidth}x${viewportHeight})`);
    }
    
    // Adaptive image quality based on connection
    function adaptImageQuality() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            const effectiveType = connection.effectiveType;
            let qualityClass = 'high-quality';
            
            if (effectiveType === 'slow-2g' || effectiveType === '2g') {
                qualityClass = 'low-quality';
            } else if (effectiveType === '3g') {
                qualityClass = 'medium-quality';
            }
            
            document.documentElement.classList.add(qualityClass);
            
            // Apply quality-specific image sources
            const images = document.querySelectorAll('img[data-quality-src]');
            images.forEach(img => {
                const qualitySrc = img.dataset[qualityClass.replace('-', '')];
                if (qualitySrc) {
                    img.src = qualitySrc;
                }
            });
            
            console.log('Image quality adapted for:', effectiveType, '- Class:', qualityClass);
        }
    }
    
    // Progressive image enhancement
    function setupProgressiveImageEnhancement() {
        const images = document.querySelectorAll('img[data-progressive]');
        
        images.forEach(img => {
            const placeholder = img.dataset.placeholder;
            const highRes = img.dataset.highres || img.src;
            
            if (placeholder) {
                // Start with placeholder
                img.src = placeholder;
                img.style.filter = 'blur(5px)';
                img.classList.add('progressive-placeholder');
                
                // Create high-res image
                const highResImg = new Image();
                highResImg.onload = () => {
                    img.src = highRes;
                    img.style.filter = 'none';
                    img.classList.remove('progressive-placeholder');
                    img.classList.add('progressive-loaded');
                };
                
                // Load high-res when element comes into view
                if ('IntersectionObserver' in window) {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                highResImg.src = highRes;
                                observer.unobserve(img);
                            }
                        });
                    }, { rootMargin: '50px' });
                    
                    observer.observe(img);
                } else {
                    // Fallback: load immediately
                    highResImg.src = highRes;
                }
            }
        });
    }
    
    // Image format detection and optimization
    function optimizeImageFormats() {
        // Check for AVIF support
        function supportsAVIF() {
            const avif = new Image();
            return new Promise((resolve) => {
                avif.onload = avif.onerror = () => resolve(avif.height === 2);
                avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
            });
        }
        
        // Apply format support classes
        Promise.all([
            supportsAVIF(),
            // WebP support already handled in initWebPSupport
        ]).then(([hasAVIF]) => {
            if (hasAVIF) {
                document.documentElement.classList.add('avif');
                console.log('AVIF format supported');
            }
        });
    }
    
    // Performance monitoring for responsive images
    function monitorImagePerformance() {
        const images = document.querySelectorAll('img');
        let totalImages = images.length;
        let loadedImages = 0;
        let failedImages = 0;
        
        const startTime = performance.now();
        
        images.forEach((img, index) => {
            // Skip if already loaded
            if (img.complete) {
                loadedImages++;
                return;
            }
            
            img.addEventListener('load', () => {
                loadedImages++;
                checkAllImagesLoaded();
            });
            
            img.addEventListener('error', () => {
                failedImages++;
                console.warn(`Image ${index + 1} failed to load:`, img.src);
                checkAllImagesLoaded();
            });
        });
        
        function checkAllImagesLoaded() {
            if (loadedImages + failedImages === totalImages) {
                const endTime = performance.now();
                const totalTime = endTime - startTime;
                
                console.log('Image loading summary:');
                console.log(`- Total images: ${totalImages}`);
                console.log(`- Loaded: ${loadedImages}`);
                console.log(`- Failed: ${failedImages}`);
                console.log(`- Total time: ${totalTime.toFixed(2)}ms`);
                console.log(`- Average time per image: ${(totalTime / totalImages).toFixed(2)}ms`);
            }
        }
        
        // Check initially loaded images
        checkAllImagesLoaded();
    }
    
    // Initialize all responsive image optimizations
    generateResponsiveSrcsets();
    optimizeForDevicePixelRatio();
    optimizeForViewport();
    adaptImageQuality();
    setupProgressiveImageEnhancement();
    optimizeImageFormats();
    monitorImagePerformance();
    
    // Re-optimize on viewport changes
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            optimizeForViewport();
        }, 250);
    });
    
    console.log('Performance optimization: Responsive images system initialized');
}

// Auto-detect system preference if no saved preference
function detectSystemTheme() {
    if (!localStorage.getItem('theme')) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
    }
    return localStorage.getItem('theme') || 'light';
}

// Initialize dark mode as early as possible to prevent flash
(function() {
    const theme = detectSystemTheme();
    document.documentElement.setAttribute('data-theme', theme);
    console.log('Early theme detection:', theme);
})();

// Mobile-First Performance Optimization
document.addEventListener('DOMContentLoaded', function() {
    console.log('MiraEdits Portfolio - Mobile-First Setup Complete');
    
    // Mobile device detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Add mobile class to body for mobile-specific styling
    if (isMobile || isTouch) {
        document.body.classList.add('mobile-device');
    }
    
    // Mobile-safe viewport height fix for iOS and mobile browsers
    function setMobileVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Update hero height for mobile
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.height = `${window.innerHeight}px`;
            hero.style.minHeight = `${window.innerHeight}px`;
        }
    }
    
    setMobileVH();
    window.addEventListener('resize', setMobileVH);
    window.addEventListener('orientationchange', () => {
        setTimeout(setMobileVH, 100);
    });
    
    // Touch-friendly interaction feedback
    function addTouchFeedback() {
        const touchElements = document.querySelectorAll('.touch-target, .btn-primary, .btn-secondary, button, a');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            element.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
    }
    
    addTouchFeedback();
    
    // Initialize mobile-first navigation
    initMobileNavigation();
    initSmoothScroll();
    initActiveNavigation();
    initHeaderScroll();
    initResponsiveGrid(); // Initialize responsive grid
    initMobileDynamicBackground(); // Initialize mobile dynamic background
    
    // Initialize hero section
    initHeroVideo();
    initScrollIndicator();
    initHeroSkillsAnimation();
    initAboutSection(); // Initialize about section
    initServicesSection(); // Initialize services section
    initContactSection(); // Initialize contact section
    initLazyLoading(); // Initialize performance optimization - lazy loading
    initWebPSupport(); // Initialize WebP format optimization
    initVideoOptimization(); // Initialize video format optimization
    initPreloadStrategies(); // Initialize preload strategies for critical assets
    initResponsiveImages(); // Initialize responsive images optimization
    
    // Initialize dark mode
    DarkMode.init();
    
    console.log('Mobile-first navigation system initialized');
    console.log('Hero section functionality initialized');
    console.log('Dark mode system ready');
    
    // Mobile performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
                console.log(`Page load time: ${loadTime}ms`);
                
                // Log if load time is too slow for mobile
                if (loadTime > 3000) {
                    console.warn('Page load time exceeds 3 seconds - consider optimization');
                }
            }
        });
    }
});

// Mobile-First Utility Functions
const MiraEdits = {
    // Check if device is mobile
    isMobile: function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    // Check if device supports touch
    isTouch: function() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    
    // Get viewport dimensions
    getViewport: function() {
        return {
            width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
            height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        };
    },
    
    // Mobile-safe smooth scroll
    smoothScroll: function(target, duration = 800) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        
        const targetPosition = targetElement.offsetTop;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    },
    
    // Navigation utilities
    navigation: {
        openMenu: function() {
            const navMenu = document.getElementById('nav-menu');
            if (navMenu) {
                navMenu.classList.add('show-menu');
                document.body.style.overflow = 'hidden';
            }
        },
        
        closeMenu: function() {
            const navMenu = document.getElementById('nav-menu');
            if (navMenu) {
                navMenu.classList.remove('show-menu');
                document.body.style.overflow = '';
            }
        },
        
        scrollToSection: function(sectionId) {
            const targetSection = document.querySelector(sectionId);
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    },
    
    // Dark mode utilities
    theme: {
        toggle: function() {
            if (typeof DarkMode !== 'undefined') {
                DarkMode.toggleTheme();
            } else {
                console.error('DarkMode not available');
            }
        },
        
        set: function(theme) {
            if (theme === 'light' || theme === 'dark') {
                if (typeof DarkMode !== 'undefined') {
                    DarkMode.setTheme(theme);
                } else {
                    console.error('DarkMode not available');
                }
            }
        },
        
        get: function() {
            if (typeof DarkMode !== 'undefined') {
                return DarkMode.getTheme();
            }
            return 'light';
        },
        
        isDark: function() {
            if (typeof DarkMode !== 'undefined') {
                return DarkMode.isDark();
            }
            return false;
        }
    }
};

// ===== WORK SECTION FUNCTIONALITY =====

// Initialize Work Section
function initWorkSection() {
    const workSection = document.querySelector('.work');
    if (!workSection) return;
    
    // Initialize video player
    initVideoPlayer();
    
    // Initialize project filtering
    initProjectFilter();
    
    // Initialize categories scroll
    initCategoriesScroll();
    
    console.log('Work section functionality initialized');
}

// Video Player Functionality
function initVideoPlayer() {
    const videoContainer = document.querySelector('.work__video-container');
    if (!videoContainer) return;
    
    const video = videoContainer.querySelector('.work__video');
    const playButton = videoContainer.querySelector('.work__play-button');
    const controls = videoContainer.querySelector('.work__video-controls');
    const progress = videoContainer.querySelector('.work__progress');
    const progressBar = videoContainer.querySelector('.work__progress-bar');
    const playPauseBtn = controls.querySelector('.work__control-btn');
    const timeDisplay = controls.querySelector('.work__time');
    const volumeBtn = controls.querySelector('.work__volume-container .work__control-btn');
    const volumeSlider = controls.querySelector('.work__volume-slider');
    const volumeProgress = videoContainer.querySelector('.work__volume-progress');
    const fullscreenBtn = videoContainer.querySelector('button[aria-label="Toggle fullscreen"]');
    const loading = videoContainer.querySelector('.work__loading');
    
    // Play/Pause functionality
    function togglePlay() {
        if (video.paused) {
            video.play();
            playButton.style.opacity = '0';
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            playButton.style.opacity = '1';
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }
    
    playButton.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);
    playPauseBtn.addEventListener('click', togglePlay);
    
    // Update progress bar
    video.addEventListener('timeupdate', () => {
        const percent = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${percent}%`;
        
        // Update time display
        const currentMinutes = Math.floor(video.currentTime / 60);
        const currentSeconds = Math.floor(video.currentTime % 60);
        const durationMinutes = Math.floor(video.duration / 60);
        const durationSeconds = Math.floor(video.duration % 60);
        
        timeDisplay.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')} / ${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
    });
    
    // Click on progress bar to seek
    progress.addEventListener('click', (e) => {
        const rect = progress.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        video.currentTime = pos * video.duration;
    });
    
    // Volume control
    volumeBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        volumeBtn.innerHTML = video.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
        volumeProgress.style.width = video.muted ? '0%' : '100%';
    });
    
    volumeSlider.addEventListener('click', (e) => {
        const rect = volumeSlider.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        video.volume = pos;
        volumeProgress.style.width = `${pos * 100}%`;
        video.muted = false;
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    });
    
    // Fullscreen
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            videoContainer.requestFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            document.exitFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    });
    
    // Loading state
    video.addEventListener('waiting', () => {
        loading.style.opacity = '1';
    });
    
    video.addEventListener('canplay', () => {
        loading.style.opacity = '0';
    });
    
    // Hide controls when mouse leaves video container
    let controlsTimeout;
    videoContainer.addEventListener('mousemove', () => {
        controls.style.opacity = '1';
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => {
            if (!video.paused) {
                controls.style.opacity = '0';
            }
        }, 2000);
    });
    
    videoContainer.addEventListener('mouseleave', () => {
        if (!video.paused) {
            controls.style.opacity = '0';
        }
    });
}

// Project Filtering with Load More functionality
function initProjectFilter() {
    const categoryButtons = document.querySelectorAll('.work__category-btn');
    const projects = document.querySelectorAll('.work__project');
    const loadMoreBtn = document.querySelector('.work__load-more');
    const ITEMS_PER_PAGE = 5; // Show 5 projects initially
    let currentPage = 1;
    
    // Initialize project visibility - show first 5 projects
    function initializeProjects() {
        projects.forEach((project, index) => {
            if (index < ITEMS_PER_PAGE) {
                project.classList.add('visible');
                project.style.display = 'block';
                project.style.opacity = '1';
                project.style.transform = 'scale(1)';
            } else {
                project.classList.remove('visible');
                project.style.display = 'none';
                project.style.opacity = '0';
                project.style.transform = 'scale(0.95)';
            }
        });
        updateLoadMoreButton();
    }
    
    // Filter and paginate projects
    function filterProjects(category) {
        currentPage = 1;
        let visibleCount = 0;
        
        projects.forEach(project => {
            project.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            const matches = category === 'all' || project.dataset.category === category;
            if (matches) {
                visibleCount++;
                if (visibleCount <= ITEMS_PER_PAGE) {
                    project.classList.add('visible');
                    project.style.opacity = '1';
                    project.style.transform = 'scale(1)';
                    project.style.display = 'block';
                } else {
                    project.classList.remove('visible');
                    project.style.opacity = '0';
                    project.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        project.style.display = 'none';
                    }, 300);
                }
            } else {
                project.classList.remove('visible');
                project.style.opacity = '0';
                project.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    project.style.display = 'none';
                }, 300);
            }
        });
        
        updateLoadMoreButton(category);
    }
    
    // Update load more button visibility and text
    function updateLoadMoreButton(category = 'all') {
        const matchingProjects = category === 'all' 
            ? Array.from(projects)
            : Array.from(projects).filter(p => p.dataset.category === category);
            
        const currentlyVisible = Array.from(projects).filter(p => p.classList.contains('visible'));
        const remainingProjects = matchingProjects.length - currentlyVisible.length;
        
        if (remainingProjects > 0) {
            loadMoreBtn.style.display = 'flex';
            loadMoreBtn.innerHTML = `
                <i class="fas fa-plus"></i>
                Load More Projects (${remainingProjects} remaining)
            `;
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
    
    // Load more projects (show next batch)
    function loadMoreProjects() {
        const activeCategory = document.querySelector('.work__category-btn.active').dataset.category;
        let added = 0;
        const maxToAdd = 1; // Load 1 more project at a time for better UX
        
        // Show loading state
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        loadMoreBtn.disabled = true;
        
        // Simulate loading delay for smoother UX
        setTimeout(() => {
            projects.forEach(project => {
                if (added < maxToAdd && 
                    !project.classList.contains('visible') && 
                    (activeCategory === 'all' || project.dataset.category === activeCategory)) {
                    
                    project.classList.add('visible');
                    project.style.display = 'block';
                    project.style.opacity = '0';
                    project.style.transform = 'scale(0.95)';
                    
                    // Trigger reflow for animation
                    project.offsetHeight;
                    
                    // Animate in
                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'scale(1)';
                    }, 10);
                    
                    added++;
                }
            });
            
            currentPage++;
            updateLoadMoreButton(activeCategory);
            loadMoreBtn.disabled = false;
            
            // Add haptic feedback for mobile
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        }, 800); // Slightly longer delay for better perceived performance
    }
    
    // Initialize project visibility
    initializeProjects();
    
    // Add click handlers to category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects for the selected category
            filterProjects(button.dataset.category);
        });
    });
    
    // Add click handler to load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreProjects);
        
        // Add touch feedback for mobile
        loadMoreBtn.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        loadMoreBtn.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    }
}

// Categories Scroll
function initCategoriesScroll() {
    const categoriesScroll = document.querySelector('.work__categories-scroll');
    const fadeLeft = document.querySelector('.work__categories-fade.left');
    const fadeRight = document.querySelector('.work__categories-fade.right');
    
    if (!categoriesScroll || !fadeLeft || !fadeRight) return;
    
    function updateFadeIndicators() {
        fadeLeft.style.opacity = categoriesScroll.scrollLeft > 0 ? '1' : '0';
        fadeRight.style.opacity = 
            categoriesScroll.scrollLeft < (categoriesScroll.scrollWidth - categoriesScroll.clientWidth) 
                ? '1' : '0';
    }
    
    // Update on scroll and resize
    categoriesScroll.addEventListener('scroll', updateFadeIndicators);
    window.addEventListener('resize', updateFadeIndicators);
    
    // Initial update
    updateFadeIndicators();
    
    // Touch scroll momentum for mobile
    let isScrolling = false;
    let startX;
    let scrollLeft;
    
    categoriesScroll.addEventListener('touchstart', (e) => {
        isScrolling = true;
        startX = e.touches[0].pageX - categoriesScroll.offsetLeft;
        scrollLeft = categoriesScroll.scrollLeft;
    });
    
    categoriesScroll.addEventListener('touchmove', (e) => {
        if (!isScrolling) return;
        
        e.preventDefault();
        const x = e.touches[0].pageX - categoriesScroll.offsetLeft;
        const walk = (x - startX) * 2;
        categoriesScroll.scrollLeft = scrollLeft - walk;
    });
    
    categoriesScroll.addEventListener('touchend', () => {
        isScrolling = false;
    });
}

// Add work section initialization to the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // ... [existing initialization code] ...
    
    // Initialize work section
    initWorkSection();
});

// Export for use in other modules
window.MiraEdits = MiraEdits;
// Portfolio Interaction Script
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // DOM Element Selectors
    const selectors = {
        navbar: '.navbar',
        navLinks: '.nav-links',
        burger: '.burger',
        burgerLines: '.burger div',
        scrollSections: 'section',
        filterButtons: '.filter-btn',
        projectCards: '.project-card',
        skillBars: '.skill-progress',
        contactForm: '#contactForm'
    };
    
    /**
     * Navigation Functionality
     */
    const navModule = (() => {
        const burger = document.querySelector(selectors.burger);
        const nav = document.querySelector(selectors.navLinks);
        const navLinks = document.querySelectorAll(`${selectors.navLinks} li`);
        const navbar = document.querySelector(selectors.navbar);
        
        // Toggle mobile navigation
        const toggleMobileNav = () => {
            // Toggle Nav
            nav.classList.toggle('active');
            
            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
            
            // Burger Animation
            burger.classList.toggle('toggle');
        };
        
        // Handle navbar scroll effect
        const handleNavbarScroll = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        
        // Setup smooth scrolling for anchor links
        const setupSmoothScrolling = () => {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        // Close mobile menu if open
                        if (nav.classList.contains('active')) {
                            toggleMobileNav();
                        }
                        
                        window.scrollTo({
                            top: targetElement.offsetTop - 70, // Adjust for navbar height
                            behavior: 'smooth'
                        });
                    }
                });
            });
        };
        
        // Initialize navigation functionality
        const init = () => {
            if (burger) {
                burger.addEventListener('click', toggleMobileNav);
            }
            
            window.addEventListener('scroll', handleNavbarScroll);
            setupSmoothScrolling();
        };
        
        return { init };
    })();
    
    /**
     * Project Filtering Functionality
     */
    const projectFilterModule = (() => {
        const filterBtns = document.querySelectorAll(selectors.filterButtons);
        const projectCards = document.querySelectorAll(selectors.projectCards);
        
        // Handle filter button click
        const handleFilterClick = (e) => {
            const target = e.target;
            const filter = target.getAttribute('data-filter');
            
            // Remove active class from all buttons
            filterBtns.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            target.classList.add('active');
            
            // Filter projects
            filterProjects(filter);
        };
        
        // Filter projects based on category
        const filterProjects = (filter) => {
            projectCards.forEach(card => {
                // Remove any existing animation classes
                card.classList.remove('fade-in');
                
                if (filter === 'all') {
                    card.style.display = 'block';
                } else if (card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
                
                // Add animation after a small delay
                setTimeout(() => {
                    if (card.style.display === 'block') {
                        card.classList.add('fade-in');
                    }
                }, 50);
            });
        };
        
        // Initialize project filtering
        const init = () => {
            if (filterBtns.length > 0) {
                filterBtns.forEach(btn => {
                    btn.addEventListener('click', handleFilterClick);
                });
            }
        };
        
        return { init };
    })();
    
    /**
     * Form Handling Module
     */
    const formModule = (() => {
        const contactForm = document.getElementById(selectors.contactForm.substring(1));
        
        // Validate email format
        const isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };
        
        // Create success message element
        const createSuccessMessage = () => {
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            
            const icon = document.createElement('i');
            icon.className = 'fas fa-check-circle';
            successMessage.appendChild(icon);
            
            const text = document.createElement('span');
            text.textContent = 'Thank you for your message! I\'ll get back to you soon.';
            successMessage.appendChild(text);
            
            return successMessage;
        };
        
        // Handle form submission
        const handleSubmit = (e) => {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Basic validation
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Email validation
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Form data for submission
            const formData = {
                name,
                email,
                message
            };
            
            // Log data (would normally be sent to a server)
            console.log('Form submitted:', formData);
            
            // Clear form
            contactForm.reset();
            
            // Show success message
            const successMessage = createSuccessMessage();
            
            // Remove any existing success messages
            const existingMessage = contactForm.parentNode.querySelector('.success-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            contactForm.parentNode.appendChild(successMessage);
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.add('fade-out');
                setTimeout(() => {
                    successMessage.remove();
                }, 500);
            }, 5000);
        };
        
        // Initialize form handling
        const init = () => {
            if (contactForm) {
                contactForm.addEventListener('submit', handleSubmit);
            }
        };
        
        return { init };
    })();
    
    /**
     * Scroll Animation Module
     */
    const scrollAnimationModule = (() => {
        const sections = document.querySelectorAll(selectors.scrollSections);
        const skillBars = document.querySelectorAll(selectors.skillBars);
        
        // Set up intersection observer for section fade-in
        const setupSectionObserver = () => {
            const fadeInOptions = {
                threshold: 0.2,
                rootMargin: "0px 0px -100px 0px"
            };
            
            const fadeInObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                });
            }, fadeInOptions);
            
            sections.forEach(section => {
                section.classList.add('not-visible');
                fadeInObserver.observe(section);
            });
        };
        
        // Set up intersection observer for skill bars animation
        const setupSkillBarObserver = () => {
            const skillOptions = {
                threshold: 0.5
            };
            
            const skillObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    
                    const target = entry.target;
                    const width = target.style.width;
                    
                    // Reset width to 0 first
                    target.style.width = '0';
                    
                    // Animate width after a short delay
                    setTimeout(() => {
                        target.style.transition = 'width 1.5s cubic-bezier(0.1, 0.5, 0.1, 1)';
                        target.style.width = width;
                    }, 200);
                    
                    observer.unobserve(target);
                });
            }, skillOptions);
            
            skillBars.forEach(bar => {
                skillObserver.observe(bar);
            });
        };
        
        // Initialize scroll animations
        const init = () => {
            if ('IntersectionObserver' in window) {
                setupSectionObserver();
                setupSkillBarObserver();
            } else {
                // Fallback for browsers that don't support Intersection Observer
                sections.forEach(section => {
                    section.classList.add('fade-in');
                });
                
                skillBars.forEach(bar => {
                    bar.style.width = bar.getAttribute('data-width') || bar.style.width;
                });
            }
        };
        
        return { init };
    })();
    
    /**
     * Hero Animation Module
     */
    const heroAnimationModule = (() => {
        const heroSection = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        // Animate hero content elements on load
        const animateHeroContent = () => {
            if (!heroContent) return;
            
            const elements = heroContent.children;
            Array.from(elements).forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.8s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 200 + (index * 150));
            });
        };
        
        // Initialize hero animations
        const init = () => {
            if (heroSection) {
                // Start animations after a short delay
                setTimeout(animateHeroContent, 100);
            }
        };
        
        return { init };
    })();
    
    // Initialize all modules
    const initApp = () => {
        navModule.init();
        projectFilterModule.init();
        formModule.init();
        scrollAnimationModule.init();
        heroAnimationModule.init();
    };
    
    // Start the application
    initApp();
});
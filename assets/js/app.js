/**
 * Main Application Controller
 * Clean, modern JavaScript using ES6+ and DOM APIs
 */

class TeqpodApp {
  constructor() {
    this.siteData = null;
    this.isInitialized = false;
    this.elements = {};
    this.currentSection = 'home';
    this.init();
  }

  // Initialize the application
  async init() {
    try {
      console.log('🚀 Initializing...');

      // Show loading screen for minimum duration
      const minLoadTime = new Promise(resolve => setTimeout(resolve, 2000));
      
      // Load data and initialize in parallel
      await Promise.all([
        this.loadSiteData(),
        minLoadTime
      ]);

      this.cacheElements();
      this.renderContent();
      this.bindEvents();
      this.initializeComponents();
      
      await this.hideLoading();
      
      this.isInitialized = true;
      console.log('✅ Initialization successful');
      
    } catch (error) {
      console.error('❌ Initialization failed:', error);
      this.handleError('Failed to load application. Please refresh the page.');
    }
  }

  // Load site data using fetch API
  async loadSiteData() {
    try {
      const response = await fetch('./assets/data/siteData.json');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      this.siteData = await response.json();
      console.log('📊 Site data loaded successfully');
      
    } catch (error) {
      console.error('❌ Failed to load site data:', error);
      throw new Error('Could not load site content');
    }
  }

  // Cache DOM elements for performance
  cacheElements() {
    this.elements = {
      // Loading
      loadingScreen: domManager.getElementById('loading-screen'),
      
      // Navigation
      navbar: domManager.getElementById('navbar'),
      navMenu: domManager.getElementById('nav-menu'),
      mobileToggle: domManager.getElementById('mobile-menu-toggle'),
      navLinks: domManager.querySelectorAll('.nav-link'),
      
      // Content containers
      statsGrid: domManager.getElementById('stats-grid'),
      featuresGrid: domManager.getElementById('features-grid'),
      eventsContainer: domManager.getElementById('events-container'),
      contactInfo: domManager.getElementById('contact-info'),
      footerLinks: domManager.getElementById('footer-links'),
      
      // Form elements
      contactForm: domManager.getElementById('contact-form'),
      formInputs: domManager.querySelectorAll('.form-input'),
      
      // Sections
      sections: domManager.querySelectorAll('section[id]')
    };
  }

  // Render all dynamic content
  renderContent() {
    if (!this.siteData) return;

    try {
      // Render all components
      componentSystem.renderStats(this.siteData.stats, this.elements.statsGrid);
      componentSystem.renderFeatures(this.siteData.features, this.elements.featuresGrid);
      componentSystem.renderEvents(this.siteData.events, this.elements.eventsContainer);
      componentSystem.renderContactInfo(this.siteData.contact, this.elements.contactInfo);
      componentSystem.renderFooterLinks(this.siteData.footer, this.elements.footerLinks);
      
      console.log('🎨 Content rendered successfully');
      
    } catch (error) {
      console.error('❌ Content rendering failed:', error);
    }
  }

  // Bind all event handlers
  bindEvents() {
    // Navigation events
    this.bindNavigationEvents();
    
    // Form events
    this.bindFormEvents();
    
    // Scroll events
    this.bindScrollEvents();
    
    // Resize events
    this.bindResizeEvents();
    
    // Keyboard events
    this.bindKeyboardEvents();
  }

  // Bind navigation events
  bindNavigationEvents() {
    // Mobile menu toggle
    if (this.elements.mobileToggle) {
      this.elements.mobileToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMobileMenu();
      });
    }

    // Navigation link clicks
    this.elements.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        this.navigateToSection(targetId);
        this.closeMobileMenu();
      });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
      if (!this.elements.navMenu.contains(e.target) && 
          !this.elements.mobileToggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Smooth scroll for CTA buttons
    domManager.querySelectorAll('.cta-primary, .cta-secondary').forEach(btn => {
      if (btn.getAttribute('href')?.startsWith('#')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = btn.getAttribute('href');
          this.navigateToSection(targetId);
        });
      }
    });
  }

  // Bind form events
  bindFormEvents() {
    if (!this.elements.contactForm) return;

    // Form submission
    this.elements.contactForm.addEventListener('submit', (e) => {
      this.handleFormSubmit(e);
    });

    // Enhanced input interactions
    this.elements.formInputs.forEach(input => {
      // Focus animations
      animationSystem.animateFormFocus(input);
      
      // Real-time validation (optional)
      input.addEventListener('input', (e) => {
        this.validateField(e.target);
      });
    });
  }

  // Bind scroll events
  bindScrollEvents() {
    // Throttled scroll handler for performance
    const scrollHandler = domManager.throttle(() => {
      this.handleScroll();
    }, 16); // ~60fps

    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    // Setup intersection observer for active navigation
    this.setupSectionObserver();
  }

  // Bind resize events
  bindResizeEvents() {
    const resizeHandler = domManager.debounce(() => {
      this.handleResize();
    }, 250);

    window.addEventListener('resize', resizeHandler);
  }

  // Bind keyboard events
  bindKeyboardEvents() {
    document.addEventListener('keydown', (e) => {
      this.handleKeyboard(e);
    });
  }

  // Initialize all components
  initializeComponents() {
    // Components are initialized through their respective systems
    // Animation system is already initialized globally
    console.log('🔧 Components initialized');
  }

  // Navigation methods
  toggleMobileMenu() {
    domManager.toggleClass(this.elements.mobileToggle, 'active');
    domManager.toggleClass(this.elements.navMenu, 'active');
    
    // Prevent body scroll when menu is open
    const isActive = this.elements.navMenu.classList.contains('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
  }

  closeMobileMenu() {
    domManager.removeClass(this.elements.mobileToggle, 'active');
    domManager.removeClass(this.elements.navMenu, 'active');
    document.body.style.overflow = '';
  }

  navigateToSection(targetId) {
    const targetSection = domManager.querySelector(targetId);
    if (!targetSection) return;

    // Smooth scroll to section
    animationSystem.smoothScrollTo(targetSection, 80);
    
    // Update current section
    this.currentSection = targetId.substring(1);
  }

  // Setup intersection observer for navigation
  setupSectionObserver() {
    const observerOptions = {
      rootMargin: '-20% 0px -20% 0px',
      threshold: 0.1
    };

    const observer = domManager.createIntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          this.updateActiveNavigation(sectionId);
        }
      });
    }, observerOptions);

    this.elements.sections.forEach(section => {
      observer.observe(section);
    });
  }

  // Update active navigation state
  updateActiveNavigation(sectionId) {
    this.currentSection = sectionId;
    
    this.elements.navLinks.forEach(link => {
      domManager.removeClass(link, 'active');
      if (link.getAttribute('href') === `#${sectionId}`) {
        domManager.addClass(link, 'active');
      }
    });
  }

  // Handle scroll events
  handleScroll() {
    const scrollY = window.pageYOffset;
    
    // Update navbar appearance
    if (scrollY > 100) {
      domManager.addClass(this.elements.navbar, 'scrolled');
    } else {
      domManager.removeClass(this.elements.navbar, 'scrolled');
    }
  }

  // Handle form submission
  async handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Validation
    if (!this.validateForm(form)) {
      componentSystem.createNotification('Please fill in all required fields correctly.', 'error');
      return;
    }

    try {
      // Show loading state
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      domManager.addClass(submitBtn, 'loading');
      
      // Simulate form submission
      await this.submitForm(formData);
      
      // Success
      componentSystem.createNotification(
        '🚀 Message sent successfully! We\'ll get back to you soon.', 
        'success'
      );
      
      this.resetForm(form);
      
    } catch (error) {
      console.error('Form submission error:', error);
      componentSystem.createNotification(
        'Failed to send message. Please try again.', 
        'error'
      );
    } finally {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      domManager.removeClass(submitBtn, 'loading');
    }
  }

  // Validate form
  validateForm(form) {
    const inputs = form.querySelectorAll('.form-input[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  // Validate individual field
  validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;

    // Required field check
    if (field.hasAttribute('required') && !value) {
      isValid = false;
    }

    // Email validation
    if (fieldType === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
      }
    }

    // Visual feedback
    const formGroup = field.closest('.form-group');
    if (isValid) {
      domManager.removeClass(formGroup, 'error');
    } else {
      domManager.addClass(formGroup, 'error');
    }

    return isValid;
  }

  // Submit form (simulation)
  async submitForm(formData) {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve({ success: true });
        } else {
          reject(new Error('Server error'));
        }
      }, 2000);
    });
  }

  // Reset form
  resetForm(form) {
    form.reset();
    
    // Remove focused states
    form.querySelectorAll('.form-group.focused').forEach(group => {
      domManager.removeClass(group, 'focused');
    });
    
    // Clear errors
    form.querySelectorAll('.form-group.error').forEach(group => {
      domManager.removeClass(group, 'error');
    });
  }

  // Handle resize events
  handleResize() {
    const viewport = domManager.getViewport();
    
    // Close mobile menu on desktop
    if (viewport.width > 768) {
      this.closeMobileMenu();
    }
    
    console.log(`📱 Viewport: ${viewport.width}x${viewport.height}`);
  }

  // Handle keyboard events
  handleKeyboard(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
      this.closeMobileMenu();
    }
    
    // Ctrl/Cmd + K for quick navigation (future feature)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      console.log('🔍 Quick navigation (coming soon)');
    }
  }

  // Hide loading screen
  async hideLoading() {
    if (!this.elements.loadingScreen) return;
    
    // Fade out loading screen
    await animationSystem.fadeOut(this.elements.loadingScreen, 500);
    this.elements.loadingScreen.style.display = 'none';
  }

  // Handle application errors
  handleError(message) {
    console.error('Application Error:', message);
    
    // Hide loading if still showing
    if (this.elements.loadingScreen) {
      this.elements.loadingScreen.style.display = 'none';
    }
    
    // Show error modal
    const errorModal = componentSystem.createModal('Error', `
      <p>${message}</p>
      <div style="margin-top: 1rem; text-align: center;">
        <button onclick="location.reload()" style="
          background: var(--color-primary);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        ">Refresh Page</button>
      </div>
    `);
  }

  // Get application status
  getStatus() {
    return {
      initialized: this.isInitialized,
      currentSection: this.currentSection,
      hasData: !!this.siteData,
      viewport: domManager.getViewport()
    };
  }

  // Cleanup application
  destroy() {
    console.log('🧹 Cleaning up application...');
    
    // Cleanup animation system
    if (window.animationSystem) {
      animationSystem.cleanup();
    }
    
    // Cleanup DOM manager
    if (window.domManager) {
      domManager.cleanup();
    }
    
    // Reset state
    this.isInitialized = false;
    this.siteData = null;
    this.elements = {};
    
    console.log('✅ Cleanup complete');
  }
}

// Application lifecycle management
class AppLifecycle {
  constructor() {
    this.app = null;
    this.init();
  }

  init() {
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.startApp();
      });
    } else {
      this.startApp();
    }

    // Handle page visibility changes
    this.setupVisibilityHandlers();
    
    // Handle page unload
    this.setupUnloadHandlers();
  }

  startApp() {
    try {
      this.app = new TeqpodApp();
      console.log('🎉 Teqpod Labs application started');
    } catch (error) {
      console.error('Failed to start application:', error);
    }
  }

  setupVisibilityHandlers() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('👋 Page hidden - pausing animations');
        if (window.animationSystem) {
          animationSystem.pauseAnimations();
        }
      } else {
        console.log('🔥 Page visible - resuming animations');
        if (window.animationSystem) {
          animationSystem.resumeAnimations();
        }
      }
    });
  }

  setupUnloadHandlers() {
    window.addEventListener('beforeunload', () => {
      if (this.app && this.app.destroy) {
        this.app.destroy();
      }
    });
  }

  getApp() {
    return this.app;
  }
}

// Initialize application lifecycle
const appLifecycle = new AppLifecycle();

// Make app available globally for debugging
window.teqpodApp = appLifecycle.getApp();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TeqpodApp, AppLifecycle };
}

// Final console message
console.info(`
╔════════════════════════════════════════╗
       🚀 TEQPOD LABS LOADED             
                                        
                                        
       Ready for Innovation! 🌟           
╚════════════════════════════════════════╝
`);

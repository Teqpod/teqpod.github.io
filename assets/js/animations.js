/**
 * Animations - Clean, purposeful animation system
 * Minimalistic yet powerful animations
 */

class AnimationSystem {
  constructor() {
    this.isReducedMotion = this.checkReducedMotion();
    this.isTouch = 'ontouchstart' in window;
    this.animationFrameId = null;
    this.observers = [];
    this.init();
  }

  init() {
    this.setupScrollReveal();
    this.setupFloatingElements();
    this.setupTerminalAnimation();
    this.setupCursor();
    this.setupGridAnimation();
  }

  // Check for reduced motion preference
  checkReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Setup scroll-based reveal animations
  setupScrollReveal() {
    if (this.isReducedMotion) return;

    const revealObserver = domManager.createIntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            domManager.addClass(entry.target, 'active');
            
            // Add stagger delay for grouped elements
            if (entry.target.dataset.stagger) {
              const delay = parseInt(entry.target.dataset.stagger) * 100;
              entry.target.style.transitionDelay = `${delay}ms`;
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    // Observe all reveal elements
    domManager.querySelectorAll('.reveal').forEach(el => {
      revealObserver.observe(el);
    });

    this.observers.push(revealObserver);
  }

  // Create floating elements for hero section
  setupFloatingElements() {
    if (this.isReducedMotion) return;

    const container = domManager.getElementById('floating-elements');
    if (!container) return;

    const elements = ['⚡', '🚀', '💻', '🎯', '🔥', '✨'];
    const positions = [
      { top: '10%', left: '10%', delay: '0s' },
      { top: '20%', right: '15%', delay: '2s' },
      { bottom: '30%', left: '20%', delay: '4s' },
      { bottom: '20%', right: '10%', delay: '1s' },
      { top: '60%', left: '5%', delay: '3s' },
      { top: '70%', right: '25%', delay: '5s' }
    ];

    elements.forEach((emoji, index) => {
      if (positions[index]) {
        const element = domManager.createElement('div', 'floating-element');
        element.appendChild(domManager.createTextNode(emoji));
        
        // Set position
        const pos = positions[index];
        Object.entries(pos).forEach(([key, value]) => {
          if (key !== 'delay') {
            element.style[key] = value;
          }
        });
        
        element.style.animationDelay = pos.delay;
        container.appendChild(element);
      }
    });
  }

  // Animate terminal output
  setupTerminalAnimation() {
    const output = domManager.getElementById('terminal-output');
    if (!output) return;

    const messages = [
      { text: '✓ Connecting to innovation network...', delay: 1000 },
      { text: '✓ Loading opportunities...', delay: 2000 },
      { text: '✓ Initializing your journey...', delay: 3000 },
      { text: '🚀 Ready to transform the future!', delay: 4000, class: 'success' }
    ];

    messages.forEach(msg => {
      setTimeout(() => {
        const line = domManager.createElement('div', `terminal-line ${msg.class || ''}`);
        line.appendChild(domManager.createTextNode(msg.text));
        output.appendChild(line);
        
        // Cursor effect
        if (msg === messages[messages.length - 1]) {
          setTimeout(() => {
            const cursor = domManager.createElement('span', 'terminal-cursor');
            cursor.appendChild(domManager.createTextNode('_'));
            line.appendChild(cursor);
          }, 500);
        }
      }, msg.delay);
    });
  }

  // Setup custom cursor (desktop only)
  setupCursor() {
    if (this.isTouch) return;

    const cursor = domManager.getElementById('cursor');
    if (!cursor) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      domManager.addClass(cursor, 'active');
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      domManager.removeClass(cursor, 'active');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Smooth cursor animation
    const animateCursor = () => {
      const speed = 0.2;
      cursorX += (mouseX - cursorX) * speed;
      cursorY += (mouseY - cursorY) * speed;
      
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      
      this.animationFrameId = requestAnimationFrame(animateCursor);
    };

    animateCursor();

    // Hover effects for interactive elements
    const hoverElements = domManager.querySelectorAll(
      'a, button, .cta-primary, .cta-secondary, .feature-card, .event-card, .contact-item'
    );

    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => domManager.addClass(cursor, 'hover'));
      el.addEventListener('mouseleave', () => domManager.removeClass(cursor, 'hover'));
    });
  }

  // Setup grid animation
  setupGridAnimation() {
    if (this.isReducedMotion) return;

    const grid = domManager.getElementById('hero-grid');
    if (!grid) return;

    // Simple CSS animation is already applied, no JS needed
    // Grid animation is handled by CSS keyframes for better performance
  }

  // Animate statistics counters
  animateCounter(element, target, suffix = '', duration = 2000) {
    if (this.isReducedMotion) {
      element.textContent = target + suffix;
      return;
    }

    const start = 0;
    const startTime = performance.now();
    const targetNum = parseInt(target.replace(/\D/g, ''));

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (targetNum * easeOutQuart));
      
      element.textContent = current + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = target + suffix;
      }
    };

    requestAnimationFrame(animate);
  }

  // Create stagger animation for multiple elements
  staggerAnimation(elements, className = 'active', delay = 100) {
    if (this.isReducedMotion) {
      elements.forEach(el => domManager.addClass(el, className));
      return;
    }

    elements.forEach((el, index) => {
      setTimeout(() => {
        domManager.addClass(el, className);
      }, index * delay);
    });
  }

  // Animate form input focus
  animateFormFocus(inputElement, lineElement) {
    const handleFocus = () => {
      domManager.addClass(inputElement.closest('.form-group'), 'focused');
    };

    const handleBlur = () => {
      if (!inputElement.value.trim()) {
        domManager.removeClass(inputElement.closest('.form-group'), 'focused');
      }
    };

    inputElement.addEventListener('focus', handleFocus);
    inputElement.addEventListener('blur', handleBlur);
  }

  // Smooth scroll with easing
  smoothScrollTo(element, offset = 80, duration = 800) {
    if (!element) return;

    const startPosition = window.pageYOffset;
    const targetPosition = element.offsetTop - offset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // Easing function
      const ease = this.easeInOutCubic(progress);
      window.scrollTo(0, startPosition + distance * ease);

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }

  // Easing function
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  // Fade in animation
  fadeIn(element, duration = 300) {
    if (this.isReducedMotion) {
      element.style.opacity = '1';
      return;
    }

    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  }

  // Fade out animation
  fadeOut(element, duration = 300) {
    if (this.isReducedMotion) {
      element.style.opacity = '0';
      return Promise.resolve();
    }

    return new Promise(resolve => {
      element.style.transition = `opacity ${duration}ms ease`;
      element.style.opacity = '0';
      
      setTimeout(resolve, duration);
    });
  }

  // Slide up animation
  slideUp(element, duration = 400) {
    if (this.isReducedMotion) {
      domManager.addClass(element, 'active');
      return;
    }

    element.style.transform = 'translateY(30px)';
    element.style.opacity = '0';
    element.style.transition = `all ${duration}ms ease`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'translateY(0)';
      element.style.opacity = '1';
    });
  }

  // Scale animation
  scale(element, fromScale = 0.9, toScale = 1, duration = 300) {
    if (this.isReducedMotion) {
      element.style.transform = `scale(${toScale})`;
      return;
    }

    element.style.transform = `scale(${fromScale})`;
    element.style.transition = `transform ${duration}ms ease`;
    
    requestAnimationFrame(() => {
      element.style.transform = `scale(${toScale})`;
    });
  }

  // Pulse animation for buttons
  pulse(element) {
    if (this.isReducedMotion) return;

    domManager.addClass(element, 'pulse');
    setTimeout(() => {
      domManager.removeClass(element, 'pulse');
    }, 600);
  }

  // Loading animation
  showLoading(element, text = 'Loading...') {
    const loader = domManager.createElement('div', 'loading-indicator');
    loader.appendChild(domManager.createTextNode(text));
    
    element.appendChild(loader);
    this.fadeIn(loader);
    
    return loader;
  }

  hideLoading(loader) {
    if (!loader) return;
    
    this.fadeOut(loader).then(() => {
      domManager.removeElement(loader);
    });
  }

  // Parallax effect (simplified)
  setupParallax(elements) {
    if (this.isReducedMotion) return;

    const handleScroll = domManager.throttle(() => {
      const scrolled = window.pageYOffset;
      
      elements.forEach(el => {
        const rate = scrolled * -0.5;
        el.style.transform = `translateY(${rate}px)`;
      });
    }, 10);

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // Cleanup animations
  cleanup() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.observers.forEach(observer => {
      if (observer.disconnect) {
        observer.disconnect();
      }
    });

    this.observers = [];
  }

  // Pause all animations
  pauseAnimations() {
    const animatedElements = domManager.querySelectorAll('*');
    animatedElements.forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  }

  // Resume all animations
  resumeAnimations() {
    const animatedElements = domManager.querySelectorAll('*');
    animatedElements.forEach(el => {
      el.style.animationPlayState = 'running';
    });
  }

  // Check if animations should be disabled
  shouldDisableAnimations() {
    return this.isReducedMotion || document.hidden;
  }
}

// Create global instance
window.animationSystem = new AnimationSystem();

// Handle visibility change for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    window.animationSystem.pauseAnimations();
  } else {
    window.animationSystem.resumeAnimations();
  }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnimationSystem;
}

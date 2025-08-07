/**
 * DOM Manager - Clean DOM manipulation using modern APIs
 * Avoids innerHTML and uses proper DOM methods
 */

class DOMManager {
  constructor() {
    this.templates = new Map();
    this.observers = new Map();
  }

  // Create element using document.createElement
  createElement(tagName, className = '', attributes = {}) {
    const element = document.createElement(tagName);
    
    if (className) {
      element.className = className;
    }
    
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    
    return element;
  }

  // Create text node
  createTextNode(text) {
    return document.createTextNode(text);
  }

  // Clone node (preferred method)
  cloneNode(node, deep = true) {
    return node.cloneNode(deep);
  }

  // Append multiple children efficiently
  appendChildren(parent, ...children) {
    const fragment = document.createDocumentFragment();
    
    children.forEach(child => {
      if (typeof child === 'string') {
        fragment.appendChild(this.createTextNode(child));
      } else if (child instanceof Node) {
        fragment.appendChild(child);
      }
    });
    
    parent.appendChild(fragment);
  }

  // Create template for reuse
  createTemplate(templateId, createFunction) {
    if (!this.templates.has(templateId)) {
      this.templates.set(templateId, createFunction());
    }
    return this.cloneNode(this.templates.get(templateId));
  }

  // Set multiple attributes
  setAttributes(element, attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  // Add class with null check
  addClass(element, className) {
    if (element && className) {
      element.classList.add(className);
    }
  }

  // Remove class with null check
  removeClass(element, className) {
    if (element && className) {
      element.classList.remove(className);
    }
  }

  // Toggle class with null check
  toggleClass(element, className) {
    if (element && className) {
      element.classList.toggle(className);
    }
  }

  // Safe element removal
  removeElement(element) {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }

  // Query selector with null check
  querySelector(selector, context = document) {
    return context.querySelector(selector);
  }

  // Query selector all with null check
  querySelectorAll(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
  }

  // Get element by ID with null check
  getElementById(id) {
    return document.getElementById(id);
  }

  // Intersection Observer wrapper
  createIntersectionObserver(callback, options = {}) {
    const defaultOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(callback, {
      ...defaultOptions,
      ...options
    });

    const observerId = `observer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.observers.set(observerId, observer);
    
    return {
      observer,
      id: observerId,
      observe: (element) => observer.observe(element),
      unobserve: (element) => observer.unobserve(element),
      disconnect: () => {
        observer.disconnect();
        this.observers.delete(observerId);
      }
    };
  }

  // Create notification element
  createNotification(message, type = 'info') {
    const notification = this.createElement('div', `notification notification-${type}`);
    
    const content = this.createElement('div', 'notification-content');
    content.appendChild(this.createTextNode(message));
    
    const closeBtn = this.createElement('button', 'notification-close');
    closeBtn.appendChild(this.createTextNode('×'));
    
    this.appendChildren(notification, content, closeBtn);
    
    // Auto-remove functionality
    closeBtn.addEventListener('click', () => {
      this.removeNotification(notification);
    });
    
    setTimeout(() => {
      this.removeNotification(notification);
    }, 5000);
    
    return notification;
  }

  // Remove notification with animation
  removeNotification(notification) {
    if (notification && notification.parentNode) {
      this.addClass(notification, 'notification-exit');
      setTimeout(() => {
        this.removeElement(notification);
      }, 300);
    }
  }

  // Debounce utility
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle utility
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Clean up all observers
  cleanup() {
    this.observers.forEach(observer => {
      if (observer && observer.disconnect) {
        observer.disconnect();
      }
    });
    this.observers.clear();
    this.templates.clear();
  }

  // Wait for element to exist
  waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const element = this.querySelector(selector);
      
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver((mutations, obs) => {
        const element = this.querySelector(selector);
        if (element) {
          obs.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  }

  // Smooth scroll to element
  scrollToElement(element, offset = 80) {
    if (!element) return;
    
    const elementTop = element.offsetTop - offset;
    window.scrollTo({
      top: elementTop,
      behavior: 'smooth'
    });
  }

  // Get viewport dimensions
  getViewport() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  // Check if element is in viewport
  isInViewport(element, offset = 0) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const viewport = this.getViewport();
    
    return (
      rect.top >= -offset &&
      rect.left >= -offset &&
      rect.bottom <= viewport.height + offset &&
      rect.right <= viewport.width + offset
    );
  }
}

// Create global instance
window.domManager = new DOMManager();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DOMManager;
}

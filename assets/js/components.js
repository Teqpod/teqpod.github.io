/**
 * Components - Clean component rendering system
 * Uses DOM APIs and cloneNode for efficiency
 */

class ComponentSystem {
  constructor() {
    this.templates = new Map();
    this.createTemplates();
  }

  // Create reusable templates
  createTemplates() {
    // Feature Card Template
    const featureCard = domManager.createElement('div', 'feature-card reveal');
    const featureIcon = domManager.createElement('div', 'feature-icon');
    const featureTitle = domManager.createElement('h3', 'feature-title');
    const featureDesc = domManager.createElement('p', 'feature-description');
    
    domManager.appendChildren(featureCard, featureIcon, featureTitle, featureDesc);
    this.templates.set('feature-card', featureCard);

    // Stat Card Template
    const statCard = domManager.createElement('div', 'stat-card reveal');
    const statNumber = domManager.createElement('div', 'stat-number');
    const statLabel = domManager.createElement('div', 'stat-label');
    
    domManager.appendChildren(statCard, statNumber, statLabel);
    this.templates.set('stat-card', statCard);

    // Event Item Template
    const eventItem = domManager.createElement('div', 'event-item reveal');
    const eventContent = domManager.createElement('div', 'event-content');
    const eventCard = domManager.createElement('div', 'event-card');
    const eventType = domManager.createElement('div', 'event-type');
    const eventTitle = domManager.createElement('h3', 'event-title');
    const eventDesc = domManager.createElement('p', 'event-description');
    const eventDate = domManager.createElement('div', 'event-date');
    const eventDay = domManager.createElement('div', 'event-day');
    const eventMonth = domManager.createElement('div', 'event-month');
    
    domManager.appendChildren(eventCard, eventType, eventTitle, eventDesc);
    domManager.appendChildren(eventContent, eventCard);
    domManager.appendChildren(eventDate, eventDay, eventMonth);
    domManager.appendChildren(eventItem, eventContent, eventDate);
    this.templates.set('event-item', eventItem);

    // Contact Item Template
    const contactItem = domManager.createElement('div', 'contact-item reveal');
    const contactIcon = domManager.createElement('div', 'contact-icon');
    const contactDetails = domManager.createElement('div', 'contact-details');
    const contactTitle = domManager.createElement('h4');
    const contactValue = domManager.createElement('div', 'contact-value');
    const contactDesc = domManager.createElement('div', 'contact-description');
    
    domManager.appendChildren(contactDetails, contactTitle, contactValue, contactDesc);
    domManager.appendChildren(contactItem, contactIcon, contactDetails);
    this.templates.set('contact-item', contactItem);

    // Footer Section Template
    const footerSection = domManager.createElement('div', 'footer-section');
    const footerTitle = domManager.createElement('h3');
    const footerNav = domManager.createElement('div', 'footer-nav');
    
    domManager.appendChildren(footerSection, footerTitle, footerNav);
    this.templates.set('footer-section', footerSection);
  }

  // Render features section
  renderFeatures(features, container) {
    if (!container || !features) return;

    const fragment = document.createDocumentFragment();
    
    features.forEach((feature, index) => {
      const card = domManager.cloneNode(this.templates.get('feature-card'));
      
      // Populate content using DOM methods
      const icon = card.querySelector('.feature-icon');
      const title = card.querySelector('.feature-title');
      const description = card.querySelector('.feature-description');
      
      icon.appendChild(domManager.createTextNode(feature.icon));
      title.appendChild(domManager.createTextNode(feature.title));
      description.appendChild(domManager.createTextNode(feature.description));
      
      // Add stagger animation data
      card.dataset.stagger = index;
      
      fragment.appendChild(card);
    });
    
    container.appendChild(fragment);
  }

  // Render statistics section
  renderStats(stats, container) {
    if (!container || !stats) return;

    const fragment = document.createDocumentFragment();
    
    stats.forEach((stat, index) => {
      const card = domManager.cloneNode(this.templates.get('stat-card'));
      
      const numberEl = card.querySelector('.stat-number');
      const labelEl = card.querySelector('.stat-label');
      
      // Store target for animation
      numberEl.dataset.target = stat.number;
      numberEl.dataset.suffix = stat.suffix || '';
      numberEl.appendChild(domManager.createTextNode('0' + (stat.suffix || '')));
      
      labelEl.appendChild(domManager.createTextNode(stat.label));
      
      // Add stagger animation data
      card.dataset.stagger = index;
      
      // Setup counter animation when element comes into view
      setTimeout(() => {
        this.setupCounterAnimation(numberEl, stat.number + (stat.suffix || ''));
      }, index * 200);
      
      fragment.appendChild(card);
    });
    
    container.appendChild(fragment);
  }

  // Setup counter animation
  setupCounterAnimation(element, target) {
    const observer = domManager.createIntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animationSystem.animateCounter(element, target);
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.5 }
    );
    
    observer.observe(element);
  }

  // Render events section
  renderEvents(events, container) {
    if (!container || !events) return;

    const fragment = document.createDocumentFragment();
    
    events.forEach((event, index) => {
      const item = domManager.cloneNode(this.templates.get('event-item'));
      
      const typeEl = item.querySelector('.event-type');
      const titleEl = item.querySelector('.event-title');
      const descEl = item.querySelector('.event-description');
      const dayEl = item.querySelector('.event-day');
      const monthEl = item.querySelector('.event-month');
      
      // Parse date
      const date = new Date(event.date);
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleDateString('en', { month: 'short' }).toUpperCase();
      
      // Populate content
      typeEl.appendChild(domManager.createTextNode(event.type));
      titleEl.appendChild(domManager.createTextNode(event.title));
      descEl.appendChild(domManager.createTextNode(event.description));
      dayEl.appendChild(domManager.createTextNode(day));
      monthEl.appendChild(domManager.createTextNode(month));
      
      // Add stagger animation data
      item.dataset.stagger = index;
      
      fragment.appendChild(item);
    });
    
    container.appendChild(fragment);
  }

  // Render contact info section
  renderContactInfo(contactData, container) {
    if (!container || !contactData) return;

    const fragment = document.createDocumentFragment();
    
    contactData.forEach((contact, index) => {
      const item = domManager.cloneNode(this.templates.get('contact-item'));
      
      const iconEl = item.querySelector('.contact-icon');
      const titleEl = item.querySelector('h4');
      const valueEl = item.querySelector('.contact-value');
      const descEl = item.querySelector('.contact-description');
      
      // Populate content
      iconEl.appendChild(domManager.createTextNode(contact.icon));
      titleEl.appendChild(domManager.createTextNode(contact.title));
      valueEl.appendChild(domManager.createTextNode(contact.value));
      descEl.appendChild(domManager.createTextNode(contact.description));
      
      // Add stagger animation data
      item.dataset.stagger = index;
      
      fragment.appendChild(item);
    });
    
    container.appendChild(fragment);
  }

  // Render footer links
  renderFooterLinks(footerData, container) {
    if (!container || !footerData) return;

    const fragment = document.createDocumentFragment();
    
    footerData.forEach((section, index) => {
      const sectionEl = domManager.cloneNode(this.templates.get('footer-section'));
      
      const titleEl = sectionEl.querySelector('h3');
      const navEl = sectionEl.querySelector('.footer-nav');
      
      // Set section title
      titleEl.appendChild(domManager.createTextNode(section.title));
      
      // Add links
      section.links.forEach(link => {
        const linkEl = domManager.createElement('a');
        linkEl.href = link.url;
        linkEl.appendChild(domManager.createTextNode(link.text));
        navEl.appendChild(linkEl);
      });
      
      fragment.appendChild(sectionEl);
    });
    
    container.appendChild(fragment);
  }

  // Create notification component
  createNotification(message, type = 'info') {
    const notification = domManager.createElement('div', `notification notification-${type}`);
    
    // Create content
    const content = domManager.createElement('div', 'notification-content');
    const text = domManager.createElement('span', 'notification-text');
    const closeBtn = domManager.createElement('button', 'notification-close');
    
    text.appendChild(domManager.createTextNode(message));
    closeBtn.appendChild(domManager.createTextNode('×'));
    
    domManager.appendChildren(content, text, closeBtn);
    notification.appendChild(content);
    
    // Add styles
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: this.getNotificationBG(type),
      color: 'white',
      padding: '1rem 1.5rem',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      zIndex: '10000',
      transform: 'translateX(400px)',
      transition: 'transform 0.3s ease',
      maxWidth: '400px',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    });

    Object.assign(closeBtn.style, {
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '1.2rem',
      cursor: 'pointer',
      padding: '0',
      marginLeft: 'auto'
    });
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
    });
    
    // Auto remove
    const remove = () => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => domManager.removeElement(notification), 300);
    };
    
    closeBtn.addEventListener('click', remove);
    setTimeout(remove, 5000);
    
    return notification;
  }

  // Get notification background color
  getNotificationBG(type) {
    const colors = {
      success: 'linear-gradient(135deg, #10b981, #059669)',
      error: 'linear-gradient(135deg, #ef4444, #dc2626)',
      warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
      info: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
    };
    return colors[type] || colors.info;
  }

  // Create loading component
  createLoadingSpinner(container, text = 'Loading...') {
    const loader = domManager.createElement('div', 'loading-spinner');
    const spinnerIcon = domManager.createElement('div', 'spinner-icon');
    const loadingText = domManager.createElement('div', 'loading-text');
    
    loadingText.appendChild(domManager.createTextNode(text));
    domManager.appendChildren(loader, spinnerIcon, loadingText);
    
    // Add styles
    Object.assign(loader.style, {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      padding: '2rem',
      color: 'var(--color-text-light)'
    });

    Object.assign(spinnerIcon.style, {
      width: '32px',
      height: '32px',
      border: '3px solid var(--color-border)',
      borderTop: '3px solid var(--color-accent)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    });
    
    if (container) {
      container.appendChild(loader);
    }
    
    return loader;
  }

  // Create modal component
  createModal(title, content) {
    const modal = domManager.createElement('div', 'modal-overlay');
    const modalContent = domManager.createElement('div', 'modal-content');
    const modalHeader = domManager.createElement('div', 'modal-header');
    const modalTitle = domManager.createElement('h3', 'modal-title');
    const closeBtn = domManager.createElement('button', 'modal-close');
    const modalBody = domManager.createElement('div', 'modal-body');
    
    modalTitle.appendChild(domManager.createTextNode(title));
    closeBtn.appendChild(domManager.createTextNode('×'));
    
    if (typeof content === 'string') {
      modalBody.appendChild(domManager.createTextNode(content));
    } else {
      modalBody.appendChild(content);
    }
    
    domManager.appendChildren(modalHeader, modalTitle, closeBtn);
    domManager.appendChildren(modalContent, modalHeader, modalBody);
    modal.appendChild(modalContent);
    
    // Add styles
    Object.assign(modal.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '10001',
      opacity: '0',
      transition: 'opacity 0.3s ease'
    });

    Object.assign(modalContent.style, {
      background: 'white',
      borderRadius: '12px',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto',
      transform: 'scale(0.9)',
      transition: 'transform 0.3s ease'
    });
    
    // Add to DOM and animate in
    document.body.appendChild(modal);
    requestAnimationFrame(() => {
      modal.style.opacity = '1';
      modalContent.style.transform = 'scale(1)';
    });
    
    // Close functionality
    const closeModal = () => {
      modal.style.opacity = '0';
      modalContent.style.transform = 'scale(0.9)';
      setTimeout(() => domManager.removeElement(modal), 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    return { modal, close: closeModal };
  }

  // Clear container content
  clearContainer(container) {
    if (container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }
  }

  // Get template by name
  getTemplate(name) {
    return this.templates.get(name);
  }

  // Check if template exists
  hasTemplate(name) {
    return this.templates.has(name);
  }
}

// Create global instance
window.componentSystem = new ComponentSystem();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ComponentSystem;
}

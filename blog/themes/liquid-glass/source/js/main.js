// Liquid Glass Theme - Main JavaScript

(function() {
  'use strict';

  // ===== Bubble Background Generator =====
  function initBubbles() {
    const container = document.querySelector('.bubble-container');
    if (!container) return;

    const bubbleCount = 15;
    
    for (let i = 0; i < bubbleCount; i++) {
      createBubble(container, i);
    }
  }

  function createBubble(container, index) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    const size = Math.random() * 100 + 50;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 20;
    const delay = Math.random() * 10;
    
    bubble.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;
    
    container.appendChild(bubble);
  }

  // ===== Mobile Menu Toggle =====
  function initMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!menuButton || !mobileMenu) return;

    menuButton.addEventListener('click', function() {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        mobileMenu.classList.remove('open');
      } else {
        mobileMenu.classList.add('open');
      }
      
      // Toggle icon
      const icon = menuButton.querySelector('svg');
      if (icon) {
        icon.innerHTML = !isOpen 
          ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>'
          : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        const icon = menuButton.querySelector('svg');
        if (icon) {
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
        }
      }
    });
  }

  // ===== Scroll Animations =====
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.animate-slide-up, .animate-fade-in').forEach(function(el) {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  }

  // ===== Smooth Scroll for Anchor Links =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ===== Active Navigation Highlight =====
  function initActiveNav() {
    const currentPath = window.location.pathname;
    
    document.querySelectorAll('.nav-link').forEach(function(link) {
      const href = link.getAttribute('href');
      if (href && (currentPath === href || currentPath.startsWith(href + '/'))) {
        link.classList.add('active');
      }
    });
  }

  // ===== Code Block Copy Button =====
  function initCodeCopy() {
    document.querySelectorAll('pre code').forEach(function(codeBlock) {
      const pre = codeBlock.parentElement;
      if (!pre) return;
      
      pre.style.position = 'relative';
      
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button';
      copyButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
        </svg>
      `;
      copyButton.style.cssText = `
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        padding: 0.5rem;
        background: rgba(139, 92, 246, 0.2);
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: 0.5rem;
        color: #a78bfa;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      
      pre.appendChild(copyButton);
      
      pre.addEventListener('mouseenter', function() {
        copyButton.style.opacity = '1';
      });
      
      pre.addEventListener('mouseleave', function() {
        copyButton.style.opacity = '0';
      });
      
      copyButton.addEventListener('click', function() {
        navigator.clipboard.writeText(codeBlock.textContent).then(function() {
          copyButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          `;
          setTimeout(function() {
            copyButton.innerHTML = `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
            `;
          }, 2000);
        });
      });
    });
  }

  // ===== Sidebar Dropdowns =====
  function initSidebarDropdowns() {
    const toggles = document.querySelectorAll('.sidebar-dropdown-toggle');
    
    toggles.forEach(toggle => {
      toggle.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const content = document.getElementById(targetId);
        const arrow = this.querySelector('.arrow-icon');
        
        if (!content) return;

        const isOpen = content.classList.contains('active');
        
        // Close other dropdowns
        document.querySelectorAll('.sidebar-dropdown-content').forEach(c => {
          if (c !== content) {
            c.classList.remove('active');
            c.style.maxHeight = '0px';
            const otherToggle = document.querySelector(`[data-target="${c.id}"]`);
            if (otherToggle) {
              const otherArrow = otherToggle.querySelector('.arrow-icon');
              if (otherArrow) otherArrow.style.transform = 'rotate(0deg)';
            }
          }
        });

        if (isOpen) {
          content.classList.remove('active');
          content.style.maxHeight = '0px';
          if (arrow) arrow.style.transform = 'rotate(0deg)';
        } else {
          content.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
          if (arrow) arrow.style.transform = 'rotate(180deg)';
        }
      });
    });
  }

  // ===== Initialize Everything =====
  function init() {
    initBubbles();
    initMobileMenu();
    initSidebarDropdowns();
    initScrollAnimations();
    initSmoothScroll();
    initActiveNav();
    initCodeCopy();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

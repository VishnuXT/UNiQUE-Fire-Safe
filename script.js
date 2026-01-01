// DOM Elements
const navbar = document.querySelector('.navbar');
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
const body = document.body;

// Mobile Menu Functions
function toggleMobileMenu() {
  const isMenuOpen = body.classList.contains('menu-open');
  
  if (isMenuOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function openMobileMenu() {
  body.classList.add('menu-open');
  // Prevent scrolling when menu is open
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
}

function closeMobileMenu() {
  body.classList.remove('menu-open');
  // Re-enable scrolling
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
}

// Toggle mobile menu
menuToggle.addEventListener('click', toggleMobileMenu);
mobileOverlay.addEventListener('click', closeMobileMenu);

// Close mobile menu when clicking on a link
mobileNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeMobileMenu();
    
    // Get the target section and scroll to it
    const targetId = link.getAttribute('href');
    if (targetId && targetId !== '#') {
      setTimeout(() => {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const navbarHeight = navbar.offsetHeight;
          const targetPosition = targetElement.offsetTop - navbarHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }, 300); // Delay to allow menu to close first
    }
  });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Section in-view detection for the top border animation
const sections = document.querySelectorAll('.section');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => {
  sectionObserver.observe(section);
});

// Scroll animation for elements
const fadeElements = document.querySelectorAll('.fade-in, .fade-in-delay, .fade-in-left, .fade-in-right, .fade-in-up, .slide-up, .scale-in, .rotate-in');

const elementObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Remove observer after animation to improve performance
      if (!entry.target.classList.contains('card')) {
        elementObserver.unobserve(entry.target);
      }
    } else {
      // For cards, remove visible class when out of view for re-animation on scroll up
      if (entry.target.classList.contains('card')) {
        entry.target.classList.remove('visible');
      }
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(element => {
  elementObserver.observe(element);
});

// Smooth scroll for navigation links with offset for fixed navbar
function smoothScroll(target) {
  const targetElement = document.querySelector(target);
  if (targetElement) {
    const navbarHeight = navbar.offsetHeight;
    const targetPosition = targetElement.offsetTop - navbarHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// Add click event to desktop navigation links
desktopNavLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    smoothScroll(targetId);
    
    // Update active nav link
    desktopNavLinks.forEach(link => link.classList.remove('active'));
    this.classList.add('active');
  });
});

// Add active class to nav links based on scroll position
const allNavLinks = document.querySelectorAll('.nav-link');

function highlightNavOnScroll() {
  const scrollPosition = window.scrollY + navbar.offsetHeight + 100;
  
  let currentSectionId = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSectionId = sectionId;
    }
  });
  
  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSectionId}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', highlightNavOnScroll);

// Initialize
highlightNavOnScroll();

// Close mobile menu on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && body.classList.contains('menu-open')) {
    closeMobileMenu();
  }
});

// Close menu when clicking outside on mobile
document.addEventListener('click', (e) => {
  if (body.classList.contains('menu-open')) {
    if (!mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMobileMenu();
    }
  }
});

// Handle window resize - close menu if resized to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && body.classList.contains('menu-open')) {
    closeMobileMenu();
  }
});

// Prevent scroll when mobile menu is open
document.addEventListener('touchmove', (e) => {
  if (body.classList.contains('menu-open')) {
    e.preventDefault();
  }
}, { passive: false });

// Add loading animation to page
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});
/* 
=======================================================
Menu Toggle Functionality
=======================================================
*/

// Grab elements from the DOM
const hamburgerMenu = document.getElementById('hamburger-menu');
const navLinks      = document.getElementById('nav-links');
const mainContent   = document.querySelector('main');           // For toggling visibility on mobile menu

// Hide/show main content based on nav-menu state
function toggleMainVisibility () {
  mainContent.style.visibility =
    navLinks.classList.contains('nav-active') ? 'hidden' : 'visible';
}

// Hamburger click ⇒ open/close nav + lock body scroll
hamburgerMenu.addEventListener('click', () => {
  navLinks.classList.toggle('nav-active');
  hamburgerMenu.classList.toggle('toggle');
  document.body.classList.toggle('nav-open');
  toggleMainVisibility();
});


/* 
=======================================================
Window Resize Event for Mobile Menu
=======================================================
*/

window.addEventListener('resize', () => {
  // If window is resized above mobile width (880px) and menu is open ⇒ close it
  if (window.innerWidth > 880 && navLinks.classList.contains('nav-active')) {
    navLinks.classList.remove('nav-active');
    hamburgerMenu.classList.remove('toggle');
    document.body.classList.remove('nav-open');
    mainContent.style.visibility = 'visible';
  }
});


/* 
=======================================================
Active Link Functionality (Home, Projects, Contact)
=======================================================
*/

const navItems = document.querySelectorAll('.nav-links a:not(.resume-link)');

// Set active class on whichever link is clicked
function setActiveLink (targetLink) {
  navItems.forEach(link => link.classList.remove('active'));
  targetLink.classList.add('active');
}

navItems.forEach(item => {
  item.addEventListener('click', function () {
    setActiveLink(this);

    // On mobile ⇒ close nav after click
    if (window.innerWidth <= 880) {
      navLinks.classList.remove('nav-active');
      hamburgerMenu.classList.remove('toggle');
      document.body.classList.remove('nav-open');
      mainContent.style.visibility = 'visible';
    }
  });
});

// Automatically set “Home” active when the page loads
document.addEventListener('DOMContentLoaded', () => setActiveLink(navItems[0]));


/* 
=======================================================
Smooth Scroll for Arrow & About Link
=======================================================
*/

const scrollArrow  = document.getElementById('scroll-arrow');
const aboutSection = document.getElementById('about');

if (scrollArrow && aboutSection) {
  scrollArrow.addEventListener('click', () =>
    aboutSection.scrollIntoView({ behavior: 'smooth' })
  );
}

const aboutLink = document.querySelector('.nav-links a[href="#about"]');
if (aboutLink && aboutSection) {
  aboutLink.addEventListener('click', e => {
    e.preventDefault();
    aboutSection.scrollIntoView({ behavior: 'smooth' });
  });
}


/* 
=======================================================
Fade-In Scroll Animation
(Home, About, Projects, Contact)
=======================================================
*/

document.addEventListener('DOMContentLoaded', () => {
  // Elements to fade-in
  const avatar          = document.querySelector('.avatar-container');
  const homeContent     = document.querySelector('.home-content');
  const arrowContainer  = document.querySelector('.scroll-arrow-container');
  const aboutContent    = document.querySelector('.about');
  const projectCards    = document.querySelectorAll('.projects-column');
  const projectsSection = document.querySelector('.projects');
  const contactSection  = document.querySelector('.contact');

  // IntersectionObserver for fade-ins
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
        observer.unobserve(entry.target); // stop observing once visible
      }
    });
  }, { threshold: 0.15 });

  avatar && observer.observe(avatar);
  if (homeContent) setTimeout(() => observer.observe(homeContent), 400);
  arrowContainer && observer.observe(arrowContainer);
  aboutContent   && observer.observe(aboutContent);
  projectCards.forEach(card => observer.observe(card));
  projectsSection && observer.observe(projectsSection);
  contactSection  && observer.observe(contactSection);
});


/* 
=======================================================
Contact Form (Netlify) Functionality
=======================================================
*/

document.addEventListener('DOMContentLoaded', () => {
  const form        = document.querySelector('.contact-form');
  const statusMsgEl = document.getElementById('form-status');

  if (!form) return;

  // URL-encode helper
  const encode = data =>
    Object.keys(data)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
      .join('&');

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Honeypot check
    if (form.querySelector('[name="bot-field"]')?.value) return;

    // Gather form inputs
    const data = { 'form-name': form.getAttribute('name') };
    form.querySelectorAll('input, textarea').forEach(el => {
      if (el.name && el.type !== 'submit') data[el.name] = el.value;
    });

    fetch('/', {
      method : 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body   : encode(data)
    })
      .then(() => {
        form.reset();
        if (statusMsgEl) {
          statusMsgEl.textContent = 'Thank you! Your message has been sent.';
          statusMsgEl.style.color = '#64FFDA';
        }
      })
      .catch(err => {
        console.error(err);
        if (statusMsgEl) {
          statusMsgEl.textContent = 'Oops! Something went wrong. Please try again later.';
          statusMsgEl.style.color = '#ED4502';
        }
      });
  });
});


/* 
=======================================================
Scroll-Up Button
=======================================================
*/

const scrollBtn = document.getElementById('scroll-up');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) scrollBtn.classList.add('show');
  else                      scrollBtn.classList.remove('show');
});

scrollBtn.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })
);


/* 
=======================================================
Sticky / Auto-Hide / Solid-on-Scroll Navigation Bar
=======================================================
*/

const navBar    = document.querySelector('nav');
let prevScrollY = window.pageYOffset || document.documentElement.scrollTop;

// On load: if user refreshed mid-page, ensure nav is solid
if (prevScrollY > 0) navBar.classList.add('fixed');

window.addEventListener('scroll', () => {
  const currScrollY = window.pageYOffset || document.documentElement.scrollTop;

  /* 1) Make nav bar solid after leaving the very top */
  if (currScrollY > 0) navBar.classList.add('fixed');
  else                 navBar.classList.remove('fixed');

  /* 2) Auto-hide while scrolling down, show while scrolling up */
  if (currScrollY > prevScrollY && currScrollY > 120) {
    navBar.classList.add('nav-hidden');   // scrolling down
  } else {
    navBar.classList.remove('nav-hidden'); // scrolling up / near top
  }

  prevScrollY = currScrollY;
});
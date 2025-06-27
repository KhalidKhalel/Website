/* 
=======================================================
Dynamic URL/Section Sync
=======================================================
*/
(() => {
    // map each section to the path you’d like to show
    const SECTIONS = [
      { id:'home',    path:'/' },
      { id:'about',   path:'/about' },
      { id:'projects',path:'/projects' },
      { id:'contact', path:'/contact' }
    ];
  
    const io = new IntersectionObserver(entries => {
      // find the entry that is now MOST in view
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  
      if (visible) {
        const match = SECTIONS.find(s => s.id === visible.target.id);
        if (match && match.path !== window.location.pathname) {
          history.replaceState({}, '', match.path);   // no page reload
        }
      }
    }, { threshold:0.6 });   // 60 % in view counts as “current”
  
    // observe each section element
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
  
    /* optional: on first load, if someone landed directly on
       /about, /projects, … scroll to that section immediately */
    window.addEventListener('DOMContentLoaded', () => {
      const current = SECTIONS.find(s => s.path === window.location.pathname);
      if (current && current.id !== 'home') {
        document.getElementById(current.id)
                ?.scrollIntoView({behavior:'instant'});
      }
    });
  })();

/* 
=======================================================
Menu-toggle (mobile nav)
======================================================= 
*/
const hamburgerMenu = document.getElementById('hamburger-menu');
const navLinks      = document.getElementById('nav-links');
const mainContent   = document.querySelector('main');

function toggleMainVisibility () {
  if (!mainContent || !navLinks) return;
  mainContent.style.visibility =
    navLinks.classList.contains('nav-active') ? 'hidden' : 'visible';
}

if (hamburgerMenu && navLinks) {
  hamburgerMenu.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
    hamburgerMenu.classList.toggle('toggle');
    document.body.classList.toggle('nav-open');
    toggleMainVisibility();
  });

  window.addEventListener('resize', () => {
    if (innerWidth > 880 && navLinks.classList.contains('nav-active')) {
      navLinks.classList.remove('nav-active');
      hamburgerMenu.classList.remove('toggle');
      document.body.classList.remove('nav-open');
      toggleMainVisibility();
    }
  });
}

/* 
=======================================================
Active-link highlight
======================================================= 
*/
const navItems = document.querySelectorAll('.nav-links a:not(.resume-link)');

function setActive (el) {
  navItems.forEach(a => a.classList.remove('active'));
  el && el.classList.add('active');
}

navItems.forEach(a =>
  a.addEventListener('click', function () {
    setActive(this);
    if (innerWidth <= 880 && navLinks && hamburgerMenu) {
      navLinks.classList.remove('nav-active');
      hamburgerMenu.classList.remove('toggle');
      document.body.classList.remove('nav-open');
      toggleMainVisibility();
    }
  })
);

if (navItems.length)
  document.addEventListener('DOMContentLoaded', () => setActive(navItems[0]));

/* 
=======================================================
Smooth-scroll shortcuts
======================================================= 
*/
const scrollArrow  = document.getElementById('scroll-arrow');
const aboutSection = document.getElementById('about');

if (scrollArrow && aboutSection)
  scrollArrow.addEventListener('click', () =>
    aboutSection.scrollIntoView({ behavior:'smooth' })
  );

const aboutLink = document.querySelector('.nav-links a[href="#about"]');
if (aboutLink && aboutSection)
  aboutLink.addEventListener('click', e => {
    e.preventDefault();
    aboutSection.scrollIntoView({ behavior:'smooth' });
  });

/* 
=======================================================
Fade-in IntersectionObservers
======================================================= 
*/
document.addEventListener('DOMContentLoaded', () => {
  const io = new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('fade-in-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold:.15 });

  [
    '.avatar-container','.home-content','.scroll-arrow-container',
    '.about','.projects','.contact','.projects-column'
  ].forEach(sel => document.querySelectorAll(sel).forEach(t => io.observe(t)));
});

/* 
=======================================================
Contact form (Netlify)
=======================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    const form        = document.querySelector('.contact-form');
    const statusEl    = document.getElementById('form-status');
    if (!form || !statusEl) return;
  
    const encode = data =>
      Object.keys(data)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
        .join('&');
  
    form.addEventListener('submit', e => {
      e.preventDefault();
  
      /* honeypot check */
      if (form.querySelector('[name="bot-field"]')?.value) return;
  
      /* gather form data */
      const data = { 'form-name': form.getAttribute('name') };
      form.querySelectorAll('input, textarea').forEach(el => {
        if (el.name && el.type !== 'submit') data[el.name] = el.value;
      });
  
      /* POST */
      fetch('/', {
        method : 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body   : encode(data)
      })
      .then(() => {
        form.reset();
        statusEl.textContent = 'Thank you! Your message has been sent.';
        statusEl.classList.remove('error');
        statusEl.classList.add('success');
      })
      .catch(err => {
        console.error(err);
        statusEl.textContent = 'Oops! Something went wrong. Please try again later.';
        statusEl.classList.remove('success');
        statusEl.classList.add('error');
      });
    });
  });

/* 
=======================================================
Scroll-up button
======================================================= 
*/
const scrollBtn = document.getElementById('scroll-up');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    window.scrollY > 300 ? scrollBtn.classList.add('show')
                         : scrollBtn.classList.remove('show');
  });
  scrollBtn.addEventListener('click', () =>
    window.scrollTo({ top:0, behavior:'smooth' })
  );
}

/* 
=======================================================
Sticky / auto-hide nav bar
======================================================= 
*/
const navBar = document.querySelector('nav');
let prevScrollY = pageYOffset || document.documentElement.scrollTop;

if (navBar && prevScrollY > 0) navBar.classList.add('fixed');

window.addEventListener('scroll', () => {
  if (!navBar) return;
  const currScrollY = pageYOffset || document.documentElement.scrollTop;
  if (currScrollY > 0) navBar.classList.add('fixed');
  else                 navBar.classList.remove('fixed');

  if (currScrollY > prevScrollY && currScrollY > 120)
       navBar.classList.add('nav-hidden');
  else navBar.classList.remove('nav-hidden');

  prevScrollY = currScrollY;
});

/* 
=======================================================
404 typing effect (runs only on 404 page)
======================================================= 
*/
   (() => {
    const line = document.getElementById('nfLine');   // <div id="nfLine">
    if (!line) return;                                // quit on non-404 pages
  
    const MSG        = "Looks like you got lost. Let's get you back home.";
    const TYPE_MS    = 45;     // speed per character
    const LOOP_PAUSE = 5000;   // pause before re-start
    const CURSOR     = '<span class="type-cursor"></span>';
  
    function run () {
      let i = 0;
      const step = () => {
        if (i <= MSG.length) {
          line.innerHTML = MSG.slice(0, i) + CURSOR;
          i++;
          setTimeout(step, TYPE_MS);
        } else {
          line.textContent = MSG;                     // leave full message
          setTimeout(() => {                          // …then erase & repeat
            line.textContent = '';
            run();
          }, LOOP_PAUSE);
        }
      };
      step();
    }
  
    // start immediately if DOM is ready, otherwise wait
    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', run)
      : run();
  })();
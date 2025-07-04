/* =======================================================
   Dynamic URL ⇆ Section Sync  (clean “/” for home)
   =======================================================*/
(() => {
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = [...document.querySelectorAll('main > section[id]')];
  if (!links.length || !sections.length) return;

  /* helper — id ⇒ new URL ("/" for home, "/#about" for others) */
  const setURL = id => {
    const url = id === 'home' ? '/' : `/#${id}`;
    const current = location.pathname + location.hash; // e.g. "/#about"
    if (current !== url) history.replaceState(null, '', url);
  };

  /* ───────── clicks ───────── */
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.getAttribute('href').slice(1);   // "home" | "about"…
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      setURL(id);                                      // push clean URL
      links.forEach(a => a.classList.toggle('active', a === link));
    });
  });

  /* ───────── scroll ───────── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        setURL(id);
        links.forEach(a =>
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`)
        );
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });
  sections.forEach(sec => io.observe(sec));

  /* ───────── initial load / deep-link ───────── */
  window.addEventListener('DOMContentLoaded', () => {
    const startID =
      (location.hash ? location.hash.slice(1) : 'home'); // default to home
    document.getElementById(startID)?.scrollIntoView();
    document
      .querySelector(`a[href="#${startID}"]`)
      ?.classList.add('active');
  });

  /* ───────── back / forward buttons ───────── */
  window.addEventListener('popstate', () => {
    const id = location.hash ? location.hash.slice(1) : 'home';
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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
    const line = document.getElementById('nfLine');
    if (!line) return;                                
  
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
          line.textContent = MSG;                    
          setTimeout(() => {                          
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
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Footer year
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // Mobile navigation
  var btn = document.getElementById('menuBtn');
  var links = document.getElementById('navLinks');
  function setMenu(open) {
    links.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  }
  btn.addEventListener('click', function () { setMenu(!links.classList.contains('open')); });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Floating bubbles
  var box = document.getElementById('bubbles');
  if (box && !reduce) {
    var count = window.innerWidth < 600 ? 10 : 20;
    for (var i = 0; i < count; i++) {
      var b = document.createElement('span');
      var size = 6 + Math.random() * 26;
      b.className = 'bubble';
      b.style.width = b.style.height = size + 'px';
      b.style.left = Math.random() * 100 + '%';
      b.style.animationDuration = 12 + Math.random() * 16 + 's';
      b.style.animationDelay = -Math.random() * 20 + 's';
      b.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px');
      b.style.opacity = 0.35 + Math.random() * 0.5;
      box.appendChild(b);
    }
  }

  // Subtle mouse parallax
  var orb = document.querySelector('.orb');
  var rays = document.querySelector('.rays');
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    var ticking = false;
    window.addEventListener('mousemove', function (e) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var x = e.clientX / window.innerWidth - 0.5;
        var y = e.clientY / window.innerHeight - 0.5;
        if (orb) orb.style.transform = 'translate(' + x * 28 + 'px,' + y * 28 + 'px)';
        if (rays) rays.style.transform = 'translate(' + x * -30 + 'px,' + y * -12 + 'px)';
        ticking = false;
      });
    }, { passive: true });
  }

  // Scroll reveal
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el, idx) {
      el.style.transitionDelay = (idx % 5) * 70 + 'ms';
      ro.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // Active nav highlighting
  var navAnchors = document.querySelectorAll('.nav-links a');
  var sections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          navAnchors.forEach(function (a) {
            var on = a.getAttribute('href') === '#' + en.target.id;
            a.classList.toggle('active', on);
            if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { so.observe(s); });
  }

  // Back to top
  var top = document.getElementById('toTop');
  window.addEventListener('scroll', function () {
    top.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });
  top.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  // Learning journey
  var stages = [
    { t: 'Computer Science Foundations', d: 'Exploring fundamental concepts and different areas of CSE.', g: 'Exploring' },
    { t: 'C Programming', d: 'Currently learning programming fundamentals using C.', g: 'Currently learning' },
    { t: 'Cloud Computing', d: 'Developing an interest in cloud technologies and exploring how cloud platforms work.', g: 'Interest' },
    { t: 'Future Growth', d: 'Continuing to build technical knowledge, explore projects, and discover areas of interest.', g: 'Ahead' }
  ];
  var tabs = document.querySelectorAll('.depth');
  var panel = document.getElementById('jpanel');
  function pick(i) {
    tabs.forEach(function (t, n) {
      t.classList.toggle('active', n === i);
      t.setAttribute('aria-selected', String(n === i));
      t.tabIndex = n === i ? 0 : -1;
    });
    document.getElementById('jtitle').textContent = stages[i].t;
    document.getElementById('jtext').textContent = stages[i].d;
    document.getElementById('jtag').textContent = stages[i].g;
    panel.setAttribute('aria-labelledby', 't' + i);
    panel.classList.remove('swap');
    void panel.offsetWidth;
    panel.classList.add('swap');
  }
  tabs.forEach(function (t, i) {
    t.tabIndex = i === 0 ? 0 : -1;
    t.addEventListener('click', function () { pick(i); });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % tabs.length;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      if (n !== null) { e.preventDefault(); tabs[n].focus(); pick(n); }
    });
  });
})();

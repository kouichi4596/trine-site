/* trine.js — plain JS, deferred. Logo mark injection, mobile nav, scroll reveal. */
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    // inject the brand mark image (cropped from the official logo)
    document.querySelectorAll('[data-mark]').forEach(function (el) {
      var size = parseInt(el.getAttribute('data-mark'), 10) || 28;
      var img = document.createElement('img');
      img.src = 'site/trine-mark.png';
      img.alt = 'Trine';
      img.className = 'mark-img';
      img.style.height = size + 'px';
      img.style.width = 'auto';
      img.style.display = 'block';
      el.innerHTML = '';
      el.appendChild(img);
    });

    // mobile nav
    var menu = document.querySelector('.mobile-menu');
    var openBtn = document.querySelector('.hamburger');
    var closeBtn = document.querySelector('.mm-close');
    function close() { if (menu) { menu.classList.remove('open'); document.body.style.overflow = ''; } }
    function open() { if (menu) { menu.classList.add('open'); document.body.style.overflow = 'hidden'; } }
    if (openBtn) openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (menu) menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });

    // scroll reveal
    var els = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && els.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      els.forEach(function (el) { io.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add('in'); });
    }

    // hero slideshow
    var hs = document.getElementById('heroSlides');
    if (hs) {
      var slides = [].slice.call(hs.querySelectorAll('.hero-slide'));
      var dots = hs.querySelector('.hero-dots');
      var idx = 0, timer;
      slides.forEach(function (s, i) {
        var b = document.createElement('button'); b.type = 'button';
        b.addEventListener('click', function () { go(i); reset(); });
        dots.appendChild(b);
      });
      var dotEls = [].slice.call(dots.querySelectorAll('button'));
      function go(n) {
        idx = (n + slides.length) % slides.length;
        slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
        dotEls.forEach(function (d, i) { d.classList.toggle('on', i === idx); });
      }
      function next() { go(idx + 1); }
      function reset() { clearInterval(timer); timer = setInterval(next, 4800); }
      go(0); reset();
      hs.addEventListener('mouseenter', function () { clearInterval(timer); });
      hs.addEventListener('mouseleave', reset);
    }
  });
})();

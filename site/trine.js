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

    // schedule calendar
    var cal = document.getElementById('trineCal');
    if (cal) {
      var WD = ['月', '火', '水', '木', '金', '土', '日'];
      var NAME = { rose: 'ローズベル', mil: 'ミリオン' };
      // availability data by 'YYYY-M'
      var DATA = {
        '2026-6': {
          1: [['09:30', 'mil']],
          3: [['09:30', 'rose'], ['13:30', 'rose']],
          5: [['09:30', 'mil'], ['09:30', 'rose'], ['15:00', 'rose']],
          6: [['12:00', 'rose']],
          7: [['09:30', 'mil'], ['09:30', 'rose'], ['16:30', 'rose']],
          8: [['09:30', 'mil'], ['09:30', 'rose'], ['14:30', 'rose']],
          10: [['09:30', 'mil'], ['09:30', 'rose']],
          12: [['09:30', 'mil'], ['09:30', 'rose']],
          13: [['09:30', 'mil'], ['16:30', 'rose']],
          14: [['09:30', 'rose'], ['16:30', 'mil']],
          15: [['09:30', 'mil'], ['09:30', 'rose']],
          17: [['09:30', 'mil'], ['09:30', 'rose']],
          19: [['09:30', 'mil'], ['09:30', 'rose']],
          20: [['13:00', 'mil'], ['13:00', 'rose']],
          21: [['09:30', 'mil'], ['16:30', 'rose']],
          22: [['09:30', 'mil'], ['09:30', 'rose']],
          24: [['09:30', 'mil'], ['09:30', 'rose'], ['13:30', 'rose']],
          26: [['09:30', 'mil'], ['09:30', 'rose']],
          27: [['09:30', 'rose'], ['13:00', 'mil']],
          28: [['09:30', 'mil'], ['09:30', 'rose']],
          29: [['09:30', 'mil'], ['09:30', 'rose']]
        }
      };
      var detail = document.getElementById('trineCalDetail');
      var label = document.getElementById('calMonth');
      var cy = 2026, cm = 6;
      var curEv = {};

      function showDetail(d) {
        var evs = curEv[d];
        // clear previous selection
        var prev = cal.querySelector('.tcal-day.sel');
        if (prev) prev.classList.remove('sel');
        if (!evs) {
          detail.innerHTML = '<div class="tcal-hint">日付をタップすると、その日の鑑定可能時間が表示されます。</div>';
          return;
        }
        var sel = cal.querySelector('.tcal-day[data-day="' + d + '"]');
        if (sel) sel.classList.add('sel');
        var first = (new Date(cy, cm - 1, 1).getDay() + 6) % 7;
        var col = (first + d - 1) % 7;
        var cc = col === 5 ? ' sat' : col === 6 ? ' sun' : '';
        var slots = evs.map(function (e) {
          return '<span class="slot bookable" data-day="' + d + '" data-time="' + e[0] + '" data-who="' + e[1] + '"><span class="dot dot-' + (e[1] === 'rose' ? 'rose' : 'mil') + '"></span>' + e[0] + ' <span class="sn">' + NAME[e[1]] + '</span><span class="arr">予約 →</span></span>';
        }).join('');
        detail.innerHTML = '<div class="tcal-li' + cc + '"><div class="tdate"><div class="dn">' + cm + '/' + d + '</div><div class="dw">' + WD[col] + '曜</div></div><div class="tslots">' + slots + '</div></div>';
      }

      function render() {
        var ev = DATA[cy + '-' + cm] || {};
        curEv = ev;
        label.innerHTML = cy + '年 <span>' + cm + '月</span>';
        var first = (new Date(cy, cm - 1, 1).getDay() + 6) % 7; // 0=Mon
        var days = new Date(cy, cm, 0).getDate();
        var prevDays = new Date(cy, cm - 1, 0).getDate();
        // ---- grid ----
        var g = '';
        WD.forEach(function (w, i) {
          var c = i === 5 ? ' sat' : i === 6 ? ' sun' : '';
          g += '<div class="tcal-wd' + c + '">' + w + '</div>';
        });
        for (var p = 0; p < first; p++) {
          g += '<div class="tcal-day dim"><div class="d">' + (prevDays - first + 1 + p) + '</div></div>';
        }
        for (var d = 1; d <= days; d++) {
          var col = (first + d - 1) % 7;
          var c2 = col === 5 ? ' sat' : col === 6 ? ' sun' : '';
          var evs = ev[d] || [];
          var has = evs.length ? ' has-ev' : '';
          var inner = '<div class="d">' + d + '</div>';
          evs.forEach(function (e) {
            inner += '<div class="tcal-ev bookable" data-day="' + d + '" data-time="' + e[0] + '" data-who="' + e[1] + '"><span class="dot dot-' + (e[1] === 'rose' ? 'rose' : 'mil') + '"></span><span class="evtxt">' + e[0] + ' ' + NAME[e[1]] + '</span></div>';
          });
          g += '<div class="tcal-day' + c2 + has + '" data-day="' + d + '">' + inner + '</div>';
        }
        var used = first + days;
        var trail = (7 - (used % 7)) % 7;
        for (var t = 1; t <= trail; t++) {
          g += '<div class="tcal-day dim"><div class="d">' + t + '</div></div>';
        }
        cal.innerHTML = g;
        // ---- mobile detail (reset) ----
        if (Object.keys(ev).length) {
          detail.innerHTML = '<div class="tcal-hint">日付をタップすると、その日の鑑定可能時間が表示されます。</div>';
        } else {
          detail.innerHTML = '<div class="tcal-empty">この月の鑑定スケジュールは準備中です。<br>お電話 <b>06-6575-7977</b> までお問い合わせください。</div>';
        }
      }

      // booking modal
      var modal = document.getElementById('bookModal');
      var EMAIL = 'info@trine-kansai.com';
      var LINE_URL = '#'; // ← LINE公式アカウントのURLに差し替え
      function openBooking(day, time, who) {
        if (!modal) return;
        var first = (new Date(cy, cm - 1, 1).getDay() + 6) % 7;
        var col = (first + day - 1) % 7;
        var whenStr = cm + '月' + day + '日（' + WD[col] + '）' + time + '〜';
        modal.querySelector('#bookWhen').textContent = whenStr;
        modal.querySelector('#bookWho').innerHTML = '<span class="dot dot-' + (who === 'rose' ? 'rose' : 'mil') + '"></span>担当：' + NAME[who] + '';
        var subject = '【鑑定予約】' + cy + '年' + whenStr + ' ' + NAME[who] + '希望';
        var body = 'トリン 御中\n\n占い鑑定を予約します。\n\n■ご希望日時：' + cy + '年' + whenStr + '\n■ご希望の占い師：' + NAME[who] + '\n■お名前：\n■お電話番号：\n■ご相談内容（任意）：\n\nよろしくお願いいたします。';
        modal.querySelector('#bookMail').setAttribute('href', 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body));
        modal.querySelector('#bookLine').setAttribute('href', LINE_URL);
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
      }
      function closeBooking() { if (modal) { modal.hidden = true; document.body.style.overflow = ''; } }
      if (modal) {
        modal.querySelectorAll('[data-close]').forEach(function (el) { el.addEventListener('click', closeBooking); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeBooking(); });
      }

      cal.addEventListener('click', function (e) {
        var slot = e.target.closest('.tcal-ev.bookable');
        if (slot) {
          openBooking(parseInt(slot.getAttribute('data-day'), 10), slot.getAttribute('data-time'), slot.getAttribute('data-who'));
          return;
        }
        var cell = e.target.closest('.tcal-day.has-ev');
        if (cell) showDetail(parseInt(cell.getAttribute('data-day'), 10));
      });
      detail.addEventListener('click', function (e) {
        var slot = e.target.closest('.slot.bookable');
        if (slot) openBooking(parseInt(slot.getAttribute('data-day'), 10), slot.getAttribute('data-time'), slot.getAttribute('data-who'));
      });
      document.getElementById('calPrev').addEventListener('click', function () {
        cm--; if (cm < 1) { cm = 12; cy--; } render();
      });
      document.getElementById('calNext').addEventListener('click', function () {
        cm++; if (cm > 12) { cm = 1; cy++; } render();
      });
      render();
    }
  });
})();

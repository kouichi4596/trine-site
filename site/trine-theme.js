/* trine-theme.js — plain JS, loaded synchronously in <head>.
   Single source of truth for themeable tokens + applies them to :root before
   first paint (no flash). Values persist in localStorage so the Tweaks panel
   carries across all pages. Direction: "格式モダン" (editorial / refined). */
(function () {
  var THEMES = {
    beige:   { bg:'#f4efe4', card:'#faf6ec', ink:'#262219', sub:'#6c6453', line:'rgba(60,52,36,.18)', deep:'#23211a', rose:'#a8823a', sage:'#8a9a7b', tg:'#f1e9d9', tr:'#f3ead9', ts:'#ecefe3' },
    milktea: { bg:'#efe6d6', card:'#fbf6ea', ink:'#2c261b', sub:'#75694f', line:'rgba(70,55,30,.2)',  deep:'#272015', rose:'#b0834a', sage:'#94a07c', tg:'#f3e9d6', tr:'#f4ecdc', ts:'#ecefe2' },
    greige:  { bg:'#edeae1', card:'#faf9f4', ink:'#2c2a23', sub:'#6e695d', line:'rgba(70,65,50,.18)', deep:'#222019', rose:'#9c8456', sage:'#8d9a84', tg:'#f0ede2', tr:'#efe9df', ts:'#eaeee4' },
    rose:    { bg:'#f3e9df', card:'#fdf7ee', ink:'#2c2419', sub:'#766857', line:'rgba(80,55,35,.18)', deep:'#271f15', rose:'#b07a52', sage:'#97a07e', tg:'#f3ead7', tr:'#f4e6d8', ts:'#edefe2' },
  };
  var DISPLAY = {
    oldmin:   '"Zen Old Mincho", serif',
    shippori: '"Shippori Mincho", serif',
    maru:     '"Zen Maru Gothic", sans-serif',
    gothic:   '"Zen Kaku Gothic New", sans-serif',
  };
  var BODY = {
    noto:   '"Noto Sans JP", sans-serif',
    zenkaku:'"Zen Kaku Gothic New", sans-serif',
  };
  // editorial style keeps corners crisp; "round" softens for a warmer feel.
  var RADII = {
    sharp:  { rc:'2px',  rb:'2px',  rs:'2px',  btn:'2px'  },
    soft:   { rc:'10px', rb:'12px', rs:'8px',  btn:'6px'  },
    round:  { rc:'22px', rb:'28px', rs:'18px', btn:'999px'},
  };

  var DEFAULTS = {
    theme: 'beige',
    gold:  '#a8823a',
    display: 'oldmin',
    body:  'noto',
    base:  16,
    radius:'sharp',
    band: 'espresso',
    hero: 'tarot',
    logo:  'both',
  };

  // 濃色帯（鑑定セクション・フッター）のトーン候補。
  var BANDS = { espresso:'#3c3026', sumi:'#232019', taupe:'#4f4738' };

  var KEY = 'trine.tweaks.c1';

  function load() {
    var v = {};
    try { v = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) {}
    var out = {};
    for (var k in DEFAULTS) out[k] = (k in v) ? v[k] : DEFAULTS[k];
    return out;
  }
  function save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }

  function apply(v) {
    var r = document.documentElement, s = r.style;
    var th = THEMES[v.theme] || THEMES.beige;
    s.setProperty('--bg', th.bg);
    s.setProperty('--card', th.card);
    s.setProperty('--ink', th.ink);
    s.setProperty('--sub', th.sub);
    s.setProperty('--line', th.line);
    s.setProperty('--deep', th.deep);
    s.setProperty('--rose', th.rose);
    s.setProperty('--sage', th.sage);
    s.setProperty('--tint-gold', th.tg);
    s.setProperty('--tint-rose', th.tr);
    s.setProperty('--tint-sage', th.ts);
    s.setProperty('--gold', v.gold || DEFAULTS.gold);
    s.setProperty('--font-display', DISPLAY[v.display] || DISPLAY.oldmin);
    s.setProperty('--font-body', BODY[v.body] || BODY.noto);
    s.setProperty('--base', (v.base || 16) + 'px');
    var rad = RADII[v.radius] || RADII.sharp;
    s.setProperty('--rc', rad.rc); s.setProperty('--rb', rad.rb);
    s.setProperty('--rs', rad.rs); s.setProperty('--rbtn', rad.btn);
    // band tone: dark variants set --deep as the band background; "light"
    // keeps --deep dark (for button text) but flips the band/footer to a
    // light panel via the data-band attribute (CSS handles the rest).
    if (v.band === 'light') {
      r.setAttribute('data-band', 'light');
      s.setProperty('--deep', BANDS.espresso);
    } else {
      r.setAttribute('data-band', 'dark');
      s.setProperty('--deep', BANDS[v.band] || BANDS.espresso);
    }
    r.setAttribute('data-logo', v.logo || 'both');
    r.setAttribute('data-hero', v.hero || 'tarot');
  }

  // equilateral triangle inscribed in a circle — the "trine" mark.
  function markSVG(size) {
    var r = 18, cx = 20, cy = 20, pts = [];
    [0, 120, 240].forEach(function (a) {
      var rad = (a - 90) * Math.PI / 180;
      pts.push((cx + r * Math.cos(rad)).toFixed(2) + ',' + (cy + r * Math.sin(rad)).toFixed(2));
    });
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 40 40" fill="none" ' +
      'stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" style="display:block">' +
      '<circle cx="20" cy="20" r="18"/><polygon points="' + pts.join(' ') + '"/>' +
      '<circle cx="20" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';
  }

  window.TRINE = {
    THEMES: THEMES, DISPLAY: DISPLAY, BODY: BODY, RADII: RADII, DEFAULTS: DEFAULTS,
    load: load, save: save, apply: apply, markSVG: markSVG,
  };
  apply(load());
})();

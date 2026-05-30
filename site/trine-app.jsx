// trine-app.jsx — Tweaks panel island. Reads/writes tokens via window.TRINE
// (localStorage-backed, shared across all pages). Renders only the floating
// panel; the live site is styled through CSS variables that TRINE.apply sets
// on :root.
(function () {
  var useTweaks = window.useTweaks, TweaksPanel = window.TweaksPanel,
      TweakSection = window.TweakSection, TweakSelect = window.TweakSelect,
      TweakRadio = window.TweakRadio, TweakColor = window.TweakColor,
      TweakSlider = window.TweakSlider;

  var THEME = [['ベージュ&ゴールド','beige'],['ミルクティー','milktea'],['グレージュ','greige'],['ローズ寄り','rose']];
  var DISPLAY = [['明朝（伝統・格式）','oldmin'],['明朝（細め・上品）','shippori'],['丸ゴシック（やさしい）','maru'],['角ゴシック','gothic']];
  var BODY = [['ゴシック','noto'],['角ゴシック','zenkaku']];
  var RADIUS = [['きっちり','sharp'],['標準','soft'],['まろやか','round']];
  var LOGO = [['マーク+文字','both'],['文字のみ','text'],['マークのみ','mark']];
  var BAND = [['焼茶（やわらか）','espresso'],['墨（深い）','sumi'],['グレージュ','taupe'],['生成り（明るい）','light']];
  var GOLDS = ['#a8823a', '#c1ab0a', '#b8954f', '#9a7a3c'];

  function labelOf(map, key) { var f = map.find(function (p) { return p[1] === key; }); return f ? f[0] : map[0][0]; }
  function keyOf(map, label) { var f = map.find(function (p) { return p[0] === label; }); return f ? f[1] : map[0][1]; }

  function Panel() {
    var init = window.TRINE.load();
    var ref = React.useState(init);
    var t = ref[0], set = ref[1];
    function update(patch) {
      var next = Object.assign({}, t, patch);
      window.TRINE.apply(next);
      window.TRINE.save(next);
      set(next);
    }
    return (
      React.createElement(TweaksPanel, { title: 'デザイン調整' },
        React.createElement(TweakSection, { label: 'カラー' }),
        React.createElement(TweakSelect, {
          label: 'テーマ', value: labelOf(THEME, t.theme), options: THEME.map(function (p) { return p[0]; }),
          onChange: function (v) { update({ theme: keyOf(THEME, v) }); } }),
        React.createElement(TweakColor, {
          label: '差し色（ゴールド）', value: t.gold, options: GOLDS,
          onChange: function (v) { update({ gold: v }); } }),
        React.createElement(TweakSelect, {
          label: '濃色帯のトーン', value: labelOf(BAND, t.band), options: BAND.map(function (p) { return p[0]; }),
          onChange: function (v) { update({ band: keyOf(BAND, v) }); } }),
        React.createElement(TweakSection, { label: 'タイポグラフィ' }),
        React.createElement(TweakSelect, {
          label: '見出しフォント', value: labelOf(DISPLAY, t.display), options: DISPLAY.map(function (p) { return p[0]; }),
          onChange: function (v) { update({ display: keyOf(DISPLAY, v) }); } }),
        React.createElement(TweakRadio, {
          label: '本文フォント', value: labelOf(BODY, t.body), options: BODY.map(function (p) { return p[0]; }),
          onChange: function (v) { update({ body: keyOf(BODY, v) }); } }),
        React.createElement(TweakSlider, {
          label: '本文サイズ', value: t.base, min: 15, max: 19, step: 1, unit: 'px',
          onChange: function (v) { update({ base: v }); } }),
        React.createElement(TweakSection, { label: 'スタイル' }),
        React.createElement(TweakRadio, {
          label: '角丸', value: labelOf(RADIUS, t.radius), options: RADIUS.map(function (p) { return p[0]; }),
          onChange: function (v) { update({ radius: keyOf(RADIUS, v) }); } }),
        React.createElement(TweakRadio, {
          label: 'ロゴ', value: labelOf(LOGO, t.logo), options: LOGO.map(function (p) { return p[0]; }),
          onChange: function (v) { update({ logo: keyOf(LOGO, v) }); } })
      )
    );
  }

  var mount = document.getElementById('tweaks-root');
  if (mount) ReactDOM.createRoot(mount).render(React.createElement(Panel));
})();

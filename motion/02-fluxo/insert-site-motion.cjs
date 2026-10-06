// Movimento no site (teste/motion-site): números que contam, mapa vivo e logo que se desenha.
// Roda da raiz do site: node motion/02-fluxo/insert-site-motion.cjs
const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');
let j = fs.readFileSync('js/main.js', 'utf8');
const rep = (src, a, b, label) => { if (!src.includes(a)) { console.error('NÃO ACHEI', label || a.slice(0, 70)); process.exit(1); } return src.replace(a, b); };
if (h.includes('brand-mark') || j.includes('odômetro')) { console.error('já aplicado'); process.exit(1); }

// ---------- 4. logo do cabeçalho em SVG, revelado ao longo das setas ----------
global.window = {};
eval(fs.readFileSync('motion/01-explicador/assets/mark.js', 'utf8'));
const M = window.MARK;
const svg = `<svg class="brand-mark" viewBox="0 0 268 194" width="268" height="194" aria-hidden="true" focusable="false">
        <mask id="bmG" maskUnits="userSpaceOnUse" x="-50" y="-50" width="400" height="300"><path class="bm-s bm-g" d="M142 84C120 116 102 144 106 172C112 204 160 200 196 158C212 140 224 120 240 100" pathLength="1"/></mask>
        <mask id="bmR" maskUnits="userSpaceOnUse" x="-50" y="-50" width="400" height="300"><path class="bm-s bm-r" d="M158 156C130 140 104 120 98 98C94 70 128 52 162 56C190 60 210 70 236 86" pathLength="1"/></mask>
        <path fill="#8D8D8D" mask="url(#bmG)" d="${M.gray}"/>
        <path fill="#BE0205" mask="url(#bmR)" d="${M.red}"/>
      </svg>`;
// o primeiro logo da página é o do cabeçalho (o do rodapé tem loading="lazy" e fica como está)
h = rep(h, '<img src="images/logo.png" alt="" width="268" height="194">', svg, 'logo do cabeçalho');
h = rep(h, `.brand img{ height:34px; width:auto; }`, `.brand img, .brand .brand-mark{ height:34px; width:auto; }
/* logo do cabeçalho: as duas setas se desenham uma vez quando a página abre (sem JS, aparece inteiro) */
.bm-s{ fill:none; stroke:#fff; stroke-dasharray:1 1; stroke-dashoffset:0; }
.bm-g{ stroke-width:84; } .bm-r{ stroke-width:74; }
.js .bm-s{ stroke-dashoffset:1; transition:stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1); }
.js .bm-g{ transition-delay:.15s; } .js .bm-r{ transition-delay:.4s; }
.js.ready .bm-s{ stroke-dashoffset:0; }`);

// ---------- 2. números que contam (odômetro) ----------
h = rep(h, `<div class="fact"><span class="v"><span data-anos>52</span> anos</span>`, `<div class="fact"><span class="v"><span data-anos data-odo>52</span> anos</span>`);
h = rep(h, `<div class="fact"><span class="v">27 terminais</span>`, `<div class="fact"><span class="v"><span data-odo>27</span> terminais</span>`);
h = rep(h, `<span class="count" aria-hidden="true">13</span>`, `<span class="count" aria-hidden="true" data-odo>13</span>`);
h = rep(h, `<span class="count" aria-hidden="true">14</span>`, `<span class="count" aria-hidden="true" data-odo>14</span>`);
h = rep(h, `.c-row .sub{ display:block;`, `/* odômetro: cada dígito é uma fita 0–9 que rola dentro de uma janela de 1 linha */
.odo{ display:inline-flex; vertical-align:top; font-variant-numeric:tabular-nums; }
.odo-c{ display:inline-block; height:1.1em; line-height:1.1em; overflow:hidden; }
.odo-s{ display:block; will-change:transform; }
.odo-s i{ display:block; font-style:normal; height:1.1em; }
.c-row .sub{ display:block;`);

// ---------- 3. mapa vivo: estilo dos contêineres nas rotas ----------
h = rep(h, `.map-box .route{ fill:none; stroke:var(--red-light); stroke-width:1.3; stroke-linecap:round; }`, `.map-box .route{ fill:none; stroke:var(--red-light); stroke-width:1.3; stroke-linecap:round; }
.map-box .rbox{ fill:#fff; opacity:0; }`);
fs.writeFileSync('index.html', h);

// ---------- JS ----------
const end = j.lastIndexOf('})();');
const JS = `
  /* ---------- odômetro: 52 anos e 27 terminais no topo, 13 e 14 nos terminais ----------
     Cada dígito é uma fita 0–9; o valor sobe com aceleração e desaceleração suaves (como no vídeo)
     e a coluna da esquerda só gira quando a da direita passa do 9. O número final fica para leitores de tela. */
  (function(){
    var els = document.querySelectorAll("[data-odo]");
    if(!els.length) return;
    function ease(x){ x = Math.max(0, Math.min(1, x)); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
    var odos = Array.prototype.map.call(els, function(el){
      var n = parseInt(el.textContent, 10), digits = String(n).length;
      if(isNaN(n)) return null;
      var hidden = el.getAttribute("aria-hidden") === "true";
      el.textContent = "";
      if(!hidden){ var sr = document.createElement("span"); sr.className = "sr-only"; sr.textContent = n; el.appendChild(sr); }
      var box = document.createElement("span"); box.className = "odo"; box.setAttribute("aria-hidden", "true");
      var strips = [];
      for(var d = 0; d < digits; d++){
        var c = document.createElement("span"); c.className = "odo-c";
        var s = document.createElement("span"); s.className = "odo-s";
        for(var k = 0; k <= 10; k++){ var i = document.createElement("i"); i.textContent = k % 10; s.appendChild(i); }
        c.appendChild(s); box.appendChild(c); strips.push({ c:c, s:s, u:Math.pow(10, digits - 1 - d) });
      }
      el.appendChild(box);
      return { el:el, n:n, strips:strips, done:false };
    }).filter(Boolean);
    function set(o, v){
      o.strips.forEach(function(st, idx){
        var u = st.u, p = u === 1 ? v % 10 : (Math.floor(v / u) % 10) + Math.min(1, Math.max(0, (v % u) - (u - 1)));
        st.s.style.transform = "translateY(" + (-p * 1.1).toFixed(4) + "em)";
        // zero à esquerda fica invisível até o número precisar dele (a largura não muda)
        if(idx < o.strips.length - 1) st.c.style.opacity = Math.max(0, Math.min(1, v / u - 0.9)).toFixed(3);
      });
    }
    function run(o, delay){
      if(o.done) return; o.done = true;
      if(reduce){ set(o, o.n); return; }
      set(o, 0);
      var t0 = null, dur = 1500 + o.n * 6;
      setTimeout(function(){
        requestAnimationFrame(function step(ts){
          if(!t0) t0 = ts;
          var p = (ts - t0) / dur;
          set(o, o.n * ease(p));
          if(p < 1) requestAnimationFrame(step); else set(o, o.n);
        });
      }, delay || 0);
    }
    odos.forEach(function(o){ set(o, reduce ? o.n : 0); });
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting) return;
        var o = odos.filter(function(x){ return x.el === e.target; })[0];
        // no topo, espera a entrada do hero; nos terminais, começa quando aparece
        if(o){ run(o, o.el.closest(".hero") ? 900 : 150); io.unobserve(e.target); }
      });
    }, { threshold:0.6 });
    odos.forEach(function(o){ io.observe(o.el); });
  })();

  /* ---------- mapa vivo: depois que cada rota se desenha, um contêiner anda por ela em loop ---------- */
  (function(){
    if(reduce || typeof routes === "undefined" || !svg) return;
    var NSv = "http://www.w3.org/2000/svg";
    var boxes = routes.map(function(rt, i){
      var r = document.createElementNS(NSv, "rect");
      r.setAttribute("class", "rbox"); r.setAttribute("width", "6"); r.setAttribute("height", "2.6"); r.setAttribute("rx", ".5");
      r.setAttribute("x", "-3"); r.setAttribute("y", "-1.3");
      svg.appendChild(r);
      // viagens mais longas duram mais; cada rota tem a sua fase para não andarem juntas
      return { rt:rt, el:r, period:3.2 + rt.L / 55, phase:i * 0.83 };
    });
    function ease(x){ return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
    var running = false, raf = 0, t0 = 0;
    function frame(ts){
      if(!t0) t0 = ts;
      var t = (ts - t0) / 1000;
      boxes.forEach(function(b){
        if(!b.rt.dot.classList.contains("on")){ b.el.style.opacity = 0; return; }
        var u = ((t + b.phase) % b.period) / b.period, travel = 0.72;
        if(u > travel){ b.el.style.opacity = 0; return; }
        var q = ease(u / travel), L = b.rt.L, a = b.rt.path.getPointAtLength(L * q), z = b.rt.path.getPointAtLength(Math.min(L, L * q + 0.6));
        var ang = Math.atan2(z.y - a.y, z.x - a.x) * 180 / Math.PI;
        var op = Math.min(1, (u / travel) / 0.08, (1 - u / travel) / 0.1);
        b.el.setAttribute("transform", "translate(" + a.x.toFixed(2) + " " + a.y.toFixed(2) + ") rotate(" + ang.toFixed(1) + ")");
        b.el.style.opacity = (0.95 * op).toFixed(3);
      });
      raf = requestAnimationFrame(frame);
    }
    function start(){ if(!running){ running = true; raf = requestAnimationFrame(frame); } }
    function stop(){ if(running){ running = false; cancelAnimationFrame(raf); } }
    new IntersectionObserver(function(es){ if(es[0].isIntersecting && !document.hidden) start(); else stop(); }).observe(svg);
    document.addEventListener("visibilitychange", function(){ if(document.hidden) stop(); });
  })();
`;
j = j.slice(0, end) + JS + j.slice(end);
fs.writeFileSync('js/main.js', j);
console.log('ok');

// Insere o item 2 (fluxo da cotação em loop) no index.html e no js/main.js. Roda da raiz do site.
const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');
const once = (src, a, b) => { if (!src.includes(a)) { console.error('NÃO ACHEI:', a.slice(0, 80)); process.exit(1); } if (src.includes('id="flow"') && b.includes('id="flow"')) { console.error('já inserido'); process.exit(1); } if (src.includes('.flow{') && b.includes('.flow{')) { console.error('css já inserido'); process.exit(1); } return src.replace(a, b); };

// ---- HTML: depois das linhas de contato
h = once(h,
`        <div class="c-row"><span class="k">Horário</span><span class="v">Segunda a sexta, 8h30 às 18h<span class="sub">Fora do horário, respondemos no próximo dia útil.</span></span></div>
      </div>
`,
`        <div class="c-row"><span class="k">Horário</span><span class="v">Segunda a sexta, 8h30 às 18h<span class="sub">Fora do horário, respondemos no próximo dia útil.</span></span></div>
      </div>

      <!-- fluxo da cotação em loop: uma forma só que muda de papel (decorativo; o texto abaixo resume) -->
      <figure class="flow" id="flow" data-reveal>
        <div class="flow-stage" aria-hidden="true">
          <div class="flow-shape" id="flowShape">
            <div class="fs"><span>Pedir cotação</span><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9h11M10 4.5 14.5 9 10 13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <div class="fs"><svg class="fs-spin" width="26" height="26" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="13" r="10" stroke="rgba(255,255,255,.18)" stroke-width="3"/><path d="M13 3a10 10 0 0 1 10 10" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg></div>
            <div class="fs"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path class="fs-check" d="M5 12.5 10 17.5 19 7" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/></svg></div>
            <div class="fs"><i class="fs-box"></i><span>Retirada no terminal</span></div>
            <div class="fs fs-track"><span class="fs-a">Santos</span><span class="fs-line"><i class="fs-run"></i></span><span class="fs-b">Sua porta</span></div>
            <div class="fs"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12.5 10 17.5 19 7" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Entregue na sua porta</span></div>
            <div class="fs"><i class="fs-box fs-empty"></i><span>Vazio devolvido</span></div>
          </div>
        </div>
        <figcaption class="flow-cap">Da cotação à devolução do vazio, a gente cuida de tudo.</figcaption>
      </figure>
`);

// ---- CSS: junto do bloco de contato
h = once(h,
`.c-row .sub{ display:block; font-size:.86rem; color:var(--on-ink-soft); font-weight:400; }
`,
`.c-row .sub{ display:block; font-size:.86rem; color:var(--on-ink-soft); font-weight:400; }
/* fluxo da cotação: uma forma só que muda de tamanho, raio e cor; quadros calculados no main.js */
.flow{ margin:40px 0 0; }
.flow-stage{ position:relative; height:156px; border-radius:16px; background:var(--ink); border:1px solid var(--line-dark); display:grid; place-items:center; overflow:hidden; }
.flow-shape{ position:relative; width:232px; height:58px; border-radius:29px; background:var(--red); overflow:hidden; will-change:width,height; }
.fs{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; gap:10px; white-space:nowrap; color:#fff; font-weight:600; font-size:.95rem; opacity:0; }
.fs:first-child{ opacity:1; }
.fs-box{ display:block; width:30px; height:12px; border-radius:2px; background:var(--red); box-shadow:inset 0 0 0 1.5px rgba(0,0,0,.25); }
.fs-box.fs-empty{ background:transparent; box-shadow:inset 0 0 0 2px var(--red-light); }
.fs-track{ padding:0 20px; gap:14px; font-family:var(--mono); font-size:.72rem; font-weight:500; letter-spacing:.08em; text-transform:uppercase; color:var(--on-ink-soft); }
.fs-line{ position:relative; flex:1; height:2px; background:rgba(255,255,255,.18); border-radius:2px; }
.fs-run{ position:absolute; left:0; top:50%; width:30px; height:12px; margin-top:-6px; border-radius:2px; background:var(--red); }
.fs-check{ stroke-dasharray:1 1; stroke-dashoffset:1; }
.flow-cap{ margin-top:14px; font-size:.9rem; color:var(--on-ink-soft); }
@media (max-width:900px){ .flow{ display:none; } }
`);
fs.writeFileSync('index.html', h);

// ---- JS: no fim do main.js, antes de fechar o IIFE
let j = fs.readFileSync('js/main.js', 'utf8');
const end = j.lastIndexOf('})();');
if (end < 0) { console.error('fim do IIFE não encontrado'); process.exit(1); }
if (j.includes('flowShape')) { console.error('main.js já tem o fluxo'); process.exit(1); }
const JS = `
  /* ---------- fluxo da cotação em loop (Contato) ----------
     Uma forma só, sem cortes: cada estado muda largura, altura, raio e cor com molas
     criticamente amortecidas. Cada quadro é calculado a partir do tempo (sem transições CSS),
     então o loop fecha sem salto: o último estado volta ao primeiro. */
  (function(){
    var shape = document.getElementById("flowShape");
    if(!shape) return;
    var parts = shape.querySelectorAll(".fs");
    var run = shape.querySelector(".fs-run"), line = shape.querySelector(".fs-line");
    var check = shape.querySelector(".fs-check"), spin = shape.querySelector(".fs-spin");
    // estados: largura, altura, raio, cor (0 = tinta, 1 = vermelho), contorno vermelho, início (s)
    var S = [
      { w:232, h:58, r:29, c:1, o:0, t:0 },     // Pedir cotação
      { w:58,  h:58, r:29, c:0, o:0, t:1.7 },   // carregando
      { w:58,  h:58, r:29, c:1, o:0, t:2.5 },   // ✓
      { w:290, h:58, r:29, c:0, o:0, t:3.3 },   // Retirada no terminal
      { w:420, h:72, r:14, c:0, o:0, t:5.1 },   // Santos → Sua porta
      { w:300, h:58, r:29, c:1, o:0, t:8.0 },   // Entregue na sua porta
      { w:250, h:58, r:29, c:0, o:1, t:9.8 }    // Vazio devolvido
    ];
    var T = 11.6; // volta ao botão
    var RESP = 0.42; // tempo de resposta da mola (s): firme, sem quique
    var w0 = 2 * Math.PI / RESP;
    function spring(x){ return x <= 0 ? 0 : 1 - Math.exp(-w0 * x) * (1 + w0 * x); } // amortecimento crítico
    function prop(t, k){
      // valor = estado inicial + soma de uma mola por mudança, em dois ciclos (o loop fecha sem salto)
      var v = S[0][k], tt = T + (t % T);
      for(var cyc = 0; cyc < 2; cyc++){
        for(var i = 1; i <= S.length; i++){
          var a = S[i - 1][k], b = S[i % S.length][k], at = (i < S.length ? S[i].t : T) + cyc * T;
          v += (b - a) * spring(tt - at);
        }
      }
      return v;
    }
    function ease(x){ x = Math.max(0, Math.min(1, x)); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
    function mixC(c, o){
      var r = Math.round(36 + (190 - 36) * c), g = Math.round(40 + (2 - 40) * c), b = Math.round(47 + (5 - 47) * c);
      return { bg:"rgb(" + r + "," + g + "," + b + ")", ring:"inset 0 0 0 2px rgba(255,90,95," + (0.9 * o).toFixed(3) + ")" };
    }
    function frame(t){
      t = ((t % T) + T) % T;
      var c = mixC(prop(t, "c"), prop(t, "o"));
      shape.style.width = prop(t, "w").toFixed(2) + "px";
      shape.style.height = prop(t, "h").toFixed(2) + "px";
      shape.style.borderRadius = prop(t, "r").toFixed(2) + "px";
      shape.style.background = c.bg; shape.style.boxShadow = c.ring;
      // conteúdo de cada estado: entra com um leve desfoque depois que a forma começa a mudar, sai antes da próxima
      for(var i = 0; i < S.length; i++){
        var a = S[i].t, z = i + 1 < S.length ? S[i + 1].t : T;
        var tout = 1 - ease((t - (z - 0.16)) / 0.14), op;
        if(i === 0) op = t < z ? tout : ease((t - (T - 0.28)) / 0.22); // o botão volta no fim do ciclo
        else op = Math.min(ease((t - a - 0.12) / 0.22), tout);
        parts[i].style.opacity = op.toFixed(3);
        parts[i].style.filter = op > 0 && op < 1 ? "blur(" + (4 * (1 - op)).toFixed(2) + "px)" : "none";
      }
      if(spin) spin.style.transform = "rotate(" + ((t * 540) % 360).toFixed(1) + "deg)";
      if(check) check.style.strokeDashoffset = (1 - ease((t - S[2].t - 0.18) / 0.35)).toFixed(3);
      if(run && line){
        var p = ease((t - S[4].t - 0.4) / 2.0), L = line.clientWidth - 30;
        run.style.transform = "translateX(" + (p * L).toFixed(2) + "px)";
      }
    }
    if(reduce){ frame(S[5].t + 1); return; } // movimento reduzido: mostra só "Entregue na sua porta", parado
    var visible = false, raf = 0, t0 = 0, tAcc = 0;
    function loop(now){
      if(!t0) t0 = now;
      frame(tAcc + (now - t0) / 1000);
      raf = requestAnimationFrame(loop);
    }
    function start(){ if(raf) return; t0 = 0; raf = requestAnimationFrame(loop); }
    function stop(){ if(!raf) return; cancelAnimationFrame(raf); raf = 0; tAcc += (performance.now() - t0) / 1000; }
    frame(0);
    new IntersectionObserver(function(es){
      visible = es[0].isIntersecting;
      if(visible && !document.hidden) start(); else stop();
    }, { rootMargin:"0px 0px -10% 0px" }).observe(shape);
    document.addEventListener("visibilitychange", function(){ if(document.hidden) stop(); else if(visible) start(); });
  })();
`;
j = j.slice(0, end) + JS + j.slice(end);
fs.writeFileSync('js/main.js', j);
console.log('ok');

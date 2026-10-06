/* Transportes Imigrantes — comportamento das páginas (carregado com defer).
   O mesmo arquivo serve todas as páginas: cada bloco só roda se o elemento dele existir. */
(function(){
  "use strict";
  var doc = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; // a classe .js já foi posta no <head>

  /* ---------- anos de estrada, sempre atualizado ---------- */
  var ANO = new Date().getFullYear();
  var ANOS = ANO - 1974;
  document.querySelectorAll("[data-anos]").forEach(function(el){ el.textContent = ANOS; });
  document.querySelectorAll("[data-ano-atual]").forEach(function(el){ el.textContent = ANO; });

  /* ---------- entrada do hero ---------- */
  function ready(){ requestAnimationFrame(function(){ doc.classList.add("ready"); }); }
  if(reduce){ ready(); }
  else{
    var heroImg = document.querySelector("#heroFrame img");
    if(heroImg && !heroImg.complete){
      var done = false, go = function(){ if(!done){ done = true; ready(); } };
      heroImg.addEventListener("load", go); heroImg.addEventListener("error", go);
      setTimeout(go, 1200);
    } else { ready(); }
  }

  /* ---------- cabeçalho: muda ao rolar, some descendo, volta subindo ---------- */
  var head = document.getElementById("siteHead");
  var wa = document.getElementById("waFloat");
  // topo da página: o hero do início ou o topo escuro das páginas internas
  var hero = document.querySelector(".hero, .page-hero, .contact-page");
  var heroMedia = hero && hero.querySelector(".hero-media");
  var drawRoutes = null; // definido pelo mapa, quando a página tem mapa
  var lastY = window.scrollY, ticking = false;
  function onScroll(){
    var y = window.scrollY;
    var heroH = hero ? hero.offsetHeight : 0;
    // no celular a foto do início fica em cima e o texto embaixo: o cabeçalho fica sólido assim que a foto passa,
    // para não ficar transparente por cima do título
    var solidAt = window.innerWidth <= 940 && heroMedia ? heroMedia.offsetHeight - 72 : heroH - 80;
    head.classList.toggle("scrolled", y > solidAt);
    if(!doc.classList.contains("menu-open")){
      head.classList.toggle("hide", y > lastY && y > heroH && !reduce);
    }
    updateWa(y);
    lastY = y;
    if(!reduce){ parallax(y); if(mapVisible && drawRoutes){ drawRoutes(); } }
    ticking = false;
  }
  window.addEventListener("scroll", function(){ if(!ticking){ ticking = true; requestAnimationFrame(onScroll); } }, { passive:true });

  /* WhatsApp flutuante: aparece quando o botão do topo sai da tela e some sobre o formulário, a chamada final
     e o rodapé, para não cobrir campos nem botões (elementos com data-wa-hide) */
  var heroCta = hero && hero.querySelector(".btn-row");
  var heroCtaVisible = !!heroCta, hiders = [], mapVisible = false;
  function updateWa(y){
    if(y === undefined){ y = window.scrollY; }
    var nearEnd = y + window.innerHeight > document.documentElement.scrollHeight - 120;
    wa.classList.toggle("show", !heroCtaVisible && !hiders.length && !nearEnd);
  }
  if("IntersectionObserver" in window){
    var visObs = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.target === heroCta){ heroCtaVisible = en.isIntersecting; return; }
        var i = hiders.indexOf(en.target);
        if(en.isIntersecting && i < 0){ hiders.push(en.target); }
        if(!en.isIntersecting && i > -1){ hiders.splice(i, 1); }
      });
      updateWa();
    });
    if(heroCta){ visObs.observe(heroCta); }
    document.querySelectorAll("[data-wa-hide]").forEach(function(n){ visObs.observe(n); });
  } else { heroCtaVisible = false; }

  /* parallax leve na foto do hero */
  var heroImgEl = document.querySelector("#heroFrame img");
  function parallax(y){
    if(!heroImgEl || !hero || y > hero.offsetHeight) return;
    if(window.innerWidth < 940) return;
    heroImgEl.style.translate = "0 " + (y * 0.12).toFixed(1) + "px";
  }

  /* ---------- menu mobile ---------- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobileMenu");
  // com o menu aberto, o resto da página sai da ordem de tabulação e do leitor de tela
  var behindMenu = [document.querySelector("main"), document.querySelector(".foot"), wa, document.querySelector(".skip-link")];
  function setMenu(open){
    doc.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";
    behindMenu.forEach(function(n){ if(n){ n.inert = open; } });
    if(open){ head.classList.remove("hide"); }
  }
  // se a tela crescer para desktop com o menu aberto, fecha
  window.matchMedia("(min-width:1121px)").addEventListener("change", function(m){ if(m.matches){ setMenu(false); } });
  burger.addEventListener("click", function(){ setMenu(!doc.classList.contains("menu-open")); });
  menu.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", function(){ setMenu(false); }); });
  document.addEventListener("keydown", function(e){ if(e.key === "Escape" && doc.classList.contains("menu-open")){ setMenu(false); burger.focus(); } });

  /* ---------- revelar ao rolar ---------- */
  function onView(els, cb, opts){
    if(!("IntersectionObserver" in window)){ els.forEach(cb); return; }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ cb(en.target); io.unobserve(en.target); } });
    }, opts || { rootMargin:"0px 0px -12% 0px" });
    els.forEach(function(el){ io.observe(el); });
  }
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if(reduce){ revealEls.forEach(function(el){ el.classList.add("in"); }); }
  else{
    onView(revealEls, function(el){
      // escalonar irmãos que entram juntos
      var sibs = el.parentElement ? Array.prototype.filter.call(el.parentElement.children, function(c){ return c.hasAttribute("data-reveal"); }) : [];
      var i = Math.max(0, sibs.indexOf(el));
      el.style.transitionDelay = Math.min(i * 70, 350) + "ms";
      el.classList.add("in");
    });
  }

  /* ---------- letreiro de plaquinhas (split-flap) ---------- */
  // as letras passam em ordem, como num painel de aeroporto, e desaceleram até parar na certa
  var SLOTS = 7, CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·";
  var canAnimate = typeof Element.prototype.animate === "function";
  var flaps = Array.prototype.slice.call(document.querySelectorAll(".flap"));

  function makeCell(ch){
    var c = document.createElement("span");
    c.className = "c" + (ch ? "" : " blank");
    c.innerHTML = '<span class="t"><i></i></span><span class="b"><i></i></span><span class="ft"><i></i></span><span class="fb"><i></i></span>';
    c._p = { t:c.querySelector(".t i"), b:c.querySelector(".b i"), ft:c.querySelector(".ft"), fb:c.querySelector(".fb") };
    c._p.fti = c._p.ft.firstChild; c._p.fbi = c._p.fb.firstChild;
    setCell(c, ch);
    return c;
  }
  function setCell(c, ch){
    c._ch = ch;
    c._p.t.textContent = c._p.b.textContent = c._p.fti.textContent = c._p.fbi.textContent = ch;
  }
  // uma virada: a metade de cima (letra antiga) cai até 90°, depois a de baixo (letra nova) desce até assentar
  function flipTo(c, next, dur){
    var p = c._p, cur = c._ch;
    p.t.textContent = next; p.fti.textContent = cur;
    p.b.textContent = cur;  p.fbi.textContent = next;
    p.ft.style.visibility = p.fb.style.visibility = "visible";
    var half = dur / 2;
    var a1 = p.ft.animate(
      [{ transform:"rotateX(0deg)", filter:"brightness(1)" }, { transform:"rotateX(-90deg)", filter:"brightness(.6)" }],
      { duration:half, easing:"cubic-bezier(.55,0,1,.45)", fill:"forwards" });
    var a2 = p.fb.animate(
      [{ transform:"rotateX(90deg)", filter:"brightness(1.35)" }, { transform:"rotateX(0deg)", filter:"brightness(1)" }],
      { duration:half, delay:half, easing:"cubic-bezier(0,.55,.45,1)", fill:"forwards" });
    return a2.finished.then(function(){
      p.b.textContent = next; c._ch = next;
      p.ft.style.visibility = p.fb.style.visibility = "hidden";
      a1.cancel(); a2.cancel();
    });
  }

  flaps.forEach(function(f){
    var t = f.getAttribute("data-text");
    for(var i = 0; i < SLOTS; i++){ f.appendChild(makeCell(t.charAt(i))); }
  });

  function spin(f, delay){
    if(f._running || !canAnimate) return;
    var cells = Array.prototype.slice.call(f.querySelectorAll(".c:not(.blank)"));
    var t = f.getAttribute("data-text");
    f._running = cells.length;
    cells.forEach(function(cell, i){
      var target = t.charAt(i), ti = CHARS.indexOf(target), L = CHARS.length;
      var steps = 5 + i * 2 + Math.floor(Math.random() * 2);
      var seq = [];
      for(var k = steps; k >= 0; k--){ seq.push(CHARS.charAt(((ti - k) % L + L) % L)); }
      seq[seq.length - 1] = target; // garante a letra final mesmo se ela não estiver em CHARS
      var n = 0;
      function next(){
        if(n >= seq.length){ if(--f._running === 0){ f._running = 0; } return; }
        var prog = n / (seq.length - 1);
        var dur = 70 + 190 * Math.pow(prog, 2.2); // rápido no começo, assentando devagar no fim
        flipTo(cell, seq[n++], dur).then(next);
      }
      setTimeout(next, delay + i * 40);
    });
  }
  if(!reduce){
    onView(flaps, function(f){ spin(f, flaps.indexOf(f) * 140); }, { rootMargin:"0px 0px -15% 0px" });
    flaps.forEach(function(f){
      var row = f.closest(".svc, .sd-side");
      if(row){ row.addEventListener("mouseenter", function(){ spin(f, 0); }); }
    });
  }

  /* ---------- contador 1974 → ano atual ---------- */
  var counter = document.getElementById("yearCounter");
  if(counter){ counter.textContent = ANO; }
  if(counter && !reduce){
    counter.textContent = "1974";
    onView([counter], function(){
      var t0 = null, dur = 2200;
      function step(ts){
        if(!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        var e = 1 - Math.pow(1 - p, 3);
        counter.textContent = Math.round(1974 + (ANO - 1974) * e);
        if(p < 1) requestAnimationFrame(step);
      }
      setTimeout(function(){ requestAnimationFrame(step); }, 300);
    }, { rootMargin:"0px 0px -25% 0px" });
  }

  /* ---------- antes / depois ---------- */
  var cmp = document.getElementById("compare");
  var range = cmp && cmp.querySelector("input");
  function setPos(v){ cmp.style.setProperty("--pos", v + "%"); }
  if(range){ range.addEventListener("input", function(){ setPos(range.value); }); }
  if(range && !reduce){
    // pequena "demonstração" quando aparece, para mostrar que dá para arrastar
    onView([cmp], function(){
      var t0 = null, dur = 1600, touched = false;
      ["pointerdown", "keydown", "touchstart"].forEach(function(ev){
        range.addEventListener(ev, function(){ touched = true; }, { once:true, passive:true });
      });
      function step(ts){
        if(touched) return;
        if(!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        var v = 50 + Math.sin(p * Math.PI * 2) * 22 * (1 - p);
        setPos(v); range.value = v;
        if(p < 1) requestAnimationFrame(step);
      }
      setTimeout(function(){ requestAnimationFrame(step); }, 500);
    }, { rootMargin:"0px 0px -30% 0px" });
  }

  /* ---------- mapa do Brasil com rotas ---------- */
  // contorno simplificado (lon, lat) — só para ilustração
  var BR = [[-51.6,4.2],[-51.1,3.9],[-50.5,2.0],[-49.9,1.0],[-50.0,0.3],[-48.6,-0.6],[-47.5,-0.6],[-46.5,-1.0],[-44.6,-2.2],[-43.0,-2.4],[-41.8,-2.9],[-40.0,-2.8],[-38.5,-3.6],[-37.2,-4.7],[-35.4,-5.1],[-35.0,-6.5],[-34.8,-7.6],[-35.1,-9.0],[-36.4,-10.5],[-37.4,-11.6],[-38.4,-12.8],[-39.0,-14.0],[-39.0,-16.0],[-39.2,-17.8],[-39.8,-19.6],[-40.6,-21.0],[-41.0,-22.0],[-42.0,-22.95],[-43.2,-23.05],[-44.6,-23.35],[-45.4,-23.8],[-46.4,-24.05],[-47.6,-24.9],[-48.4,-25.7],[-48.6,-26.6],[-48.6,-28.0],[-49.6,-29.3],[-50.4,-30.6],[-51.3,-31.6],[-52.3,-32.4],[-53.4,-33.7],[-53.4,-32.6],[-54.6,-31.9],[-55.5,-30.9],[-56.4,-30.4],[-57.6,-30.2],[-56.0,-28.6],[-55.0,-27.8],[-53.8,-27.1],[-53.6,-26.2],[-54.6,-25.6],[-54.3,-24.1],[-55.4,-23.6],[-55.7,-22.4],[-57.0,-22.2],[-57.9,-22.1],[-57.9,-20.0],[-57.7,-19.0],[-58.4,-17.3],[-58.4,-16.3],[-60.2,-16.2],[-60.4,-15.1],[-60.3,-13.6],[-61.8,-13.5],[-63.3,-12.6],[-64.5,-12.4],[-65.3,-11.0],[-65.4,-9.8],[-66.6,-9.9],[-68.0,-10.7],[-69.6,-11.0],[-70.6,-11.0],[-70.6,-9.5],[-72.2,-10.0],[-73.2,-9.3],[-74.0,-7.6],[-72.9,-5.1],[-71.5,-4.4],[-70.0,-4.3],[-69.4,-1.2],[-69.6,0.6],[-69.8,1.1],[-67.2,1.8],[-66.9,1.2],[-65.5,0.8],[-64.1,1.8],[-63.4,2.2],[-64.0,3.6],[-64.7,4.0],[-62.8,4.0],[-61.0,4.5],[-60.7,5.2],[-60.1,5.2],[-59.9,4.0],[-59.6,2.0],[-59.0,1.3],[-57.0,1.9],[-55.9,1.9],[-54.6,2.3],[-52.9,2.2],[-52.0,3.4]];
  // destinos ilustrativos — ajuste para os destinos reais mais frequentes
  var CITIES = [
    ["São Paulo",-46.63,-23.55,-1],["Campinas",-47.06,-22.90,-1],["Rio de Janeiro",-43.20,-22.90,0],["Curitiba",-49.27,-25.43,1],
    ["Belo Horizonte",-43.94,-19.92,1],["Florianópolis",-48.55,-27.60,0],["Vitória",-40.31,-20.32,0],["Porto Alegre",-51.23,-30.03,1],
    ["Campo Grande",-54.62,-20.47,1]
  ];
  var ORIGIN = [-46.33,-23.96];
  function P(lon, lat){ return [ (lon + 74.5) * 10, (5.8 - lat) * 10 ]; }
  var NS = "http://www.w3.org/2000/svg";
  var svg = document.getElementById("brMap");
  if(svg){
  function el(name, attrs, parent){
    var n = document.createElementNS(NS, name);
    for(var k in attrs){ n.setAttribute(k, attrs[k]); }
    (parent || svg).appendChild(n); return n;
  }
  var defs = el("defs", {});
  var pat = el("pattern", { id:"dots", width:"6", height:"6", patternUnits:"userSpaceOnUse" }, defs);
  el("circle", { cx:"3", cy:"3", r:"1.15", fill:"rgba(255,255,255,.26)" }, pat);
  var poly = BR.map(function(c){ var p = P(c[0], c[1]); return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ");
  el("polygon", { points:poly, fill:"url(#dots)", stroke:"rgba(255,255,255,.22)", "stroke-width":"1", "stroke-linejoin":"round" });

  var o = P(ORIGIN[0], ORIGIN[1]);
  var cityList = document.getElementById("cityList");
  var routes = [];
  CITIES.forEach(function(c, i){
    var d = P(c[1], c[2]);
    var mx = (o[0] + d[0]) / 2, my = (o[1] + d[1]) / 2;
    var dx = d[0] - o[0], dy = d[1] - o[1], len = Math.sqrt(dx*dx + dy*dy);
    var side = (i % 2 ? 1 : -1);
    var k = 0.22 * side;
    var cx = mx - dy * k, cy = my + dx * k;
    var path = el("path", { class:"route", d:"M" + o[0].toFixed(1) + " " + o[1].toFixed(1) + " Q" + cx.toFixed(1) + " " + cy.toFixed(1) + " " + d[0].toFixed(1) + " " + d[1].toFixed(1) });
    var dot = el("circle", { class:"city", cx:d[0].toFixed(1), cy:d[1].toFixed(1), r:"3.2" });
    var right = c[3] === 1 ? -1 : 1; // 0 = rótulo à direita, 1 = à esquerda, -1 = sem rótulo
    var lbl = el("text", { class:"city-lbl", x:(d[0] + 7 * right).toFixed(1), y:(d[1] + 3).toFixed(1), "text-anchor": right > 0 ? "start" : "end" });
    lbl.textContent = c[3] === -1 ? "" : c[0];
    var li = document.createElement("li"); li.textContent = c[0]; cityList.appendChild(li);
    var L = path.getTotalLength();
    path.style.strokeDasharray = L; path.style.strokeDashoffset = L;
    routes.push({ path:path, L:L, dot:dot, lbl:lbl, li:li, len:len });
  });
  // ordem de desenho: das mais próximas às mais distantes
  routes.sort(function(a, b){ return a.len - b.len; });
  el("circle", { class:"pulse", cx:o[0].toFixed(1), cy:o[1].toFixed(1), r:"6" });
  el("circle", { class:"origin", cx:o[0].toFixed(1), cy:o[1].toFixed(1), r:"5" });
  var ot = el("text", { class:"city-lbl on", x:(o[0] + 9).toFixed(1), y:(o[1] + 14).toFixed(1), style:"fill:#fff; font-weight:600;" });
  ot.textContent = "Santos";

  var mapBox = document.getElementById("mapBox");
  drawRoutes = function(force){
    var p;
    if(force === 1){ p = 1; }
    else{
      var r = mapBox.getBoundingClientRect(), vh = window.innerHeight;
      // começa quando o topo do mapa chega a 85% da tela, termina quando o meio do mapa passa de 35%
      var start = vh * 0.85, end = vh * 0.35 - r.height / 2;
      p = (start - r.top) / (start - end);
      p = Math.max(0, Math.min(1, p));
    }
    var n = routes.length;
    routes.forEach(function(rt, i){
      var a = i / n * 0.7, local = Math.max(0, Math.min(1, (p - a) / 0.3));
      rt.path.style.strokeDashoffset = (rt.L * (1 - local)).toFixed(1);
      var on = local >= 0.98;
      rt.dot.classList.toggle("on", on); rt.lbl.classList.toggle("on", on); rt.li.classList.toggle("lit", on);
    });
  };
  if(reduce){ drawRoutes(1); } else { drawRoutes(); }
  // rótulos do mapa com tamanho fixo na tela (12px no desktop, 11px no celular), qualquer que seja a escala do SVG
  var mapLbls = svg.querySelectorAll(".city-lbl");
  function fitMapLabels(){
    var w = svg.getBoundingClientRect().width;
    if(!w){ return; }
    var fs = (w > 480 ? 12 : w > 320 ? 11 : 9.5) / (w / 314); // em telas bem estreitas o mapa é pequeno: rótulo menor evita sobreposição
    mapLbls.forEach(function(t){ t.style.fontSize = fs.toFixed(2) + "px"; t.style.strokeWidth = (fs * 0.3).toFixed(2) + "px"; });
  }
  fitMapLabels();
  window.addEventListener("resize", function(){ fitMapLabels(); if(!reduce) drawRoutes(); });
  // só recalcula o mapa a cada rolagem quando ele está perto da tela
  if("IntersectionObserver" in window){
    new IntersectionObserver(function(entries){
      mapVisible = entries[0].isIntersecting;
      if(mapVisible && !reduce){ drawRoutes(); }
    }, { rootMargin:"20% 0px" }).observe(mapBox);
  } else { mapVisible = true; }
  } // fim do mapa

  /* ---------- marca gigante do rodapé ocupa a largura exata ---------- */
  var giant = document.querySelector(".giant");
  function fitGiant(){
    if(!giant) return;
    giant.style.fontSize = "100px";
    var w = giant.scrollWidth, target = document.documentElement.clientWidth * 0.96;
    giant.style.fontSize = (100 * target / w).toFixed(2) + "px";
  }
  fitGiant();
  window.addEventListener("resize", fitGiant);
  if(document.fonts && document.fonts.ready){ document.fonts.ready.then(fitGiant); }

  /* ---------- medição (analytics) ----------
     Envia eventos para a ferramenta que estiver instalada (Vercel, Umami ou Google Analytics).
     Sem nenhuma instalada, não faz nada. Em localhost, mostra no console para testar. */
  function track(name, data){
    try{
      if(window.va){ window.va("event", { name:name, data:data }); }
      if(window.umami && window.umami.track){ window.umami.track(name, data); }
      if(window.gtag){ window.gtag("event", name, data); }
      if(/^(localhost|127\.0\.0\.1)$/.test(location.hostname)){ console.info("[analytics]", name, data); }
    }catch(e){}
  }
  // cliques em WhatsApp, telefone e e-mail, com a seção de onde vieram
  document.addEventListener("click", function(e){
    var a = e.target.closest && e.target.closest('a[href^="https://wa.me"], a[href^="tel:"], a[href^="mailto:"]');
    if(!a || a.hasAttribute("data-notrack")) return;
    var href = a.getAttribute("href");
    var tipo = href.indexOf("wa.me") > -1 ? "whatsapp" : href.indexOf("tel:") === 0 ? "telefone" : "email";
    var sec = a.closest("section[id], header, footer, .mobile-menu");
    var origem = a.getAttribute("data-origem") || (a.id === "waFloat" ? "botao-flutuante" : sec ? (sec.id || sec.tagName.toLowerCase() || "menu") : "outro");
    if(sec && sec.classList.contains("mobile-menu")){ origem = "menu-celular"; }
    origem = { siteHead:"cabecalho", topo:"hero", footer:"rodape" }[origem] || origem;
    track("contato_" + tipo, { origem:origem });
  });

  // quais perguntas frequentes são abertas (mostra as dúvidas mais comuns dos clientes)
  document.querySelectorAll(".faq details").forEach(function(d){
    d.addEventListener("toggle", function(){
      if(d.open){ track("duvida_aberta", { pergunta:d.querySelector("summary").textContent.trim() }); }
    });
  });

  /* ---------- formulário de cotação ---------- */
  var WA_NUM = "5513978043399", EMAIL = "administrativo@transportesimigrantes.com.br";
  var form = document.getElementById("cotacao");
  if(form){
  // na importação a carga sai do porto para o destino; na exportação ela é coletada e vai para o porto
  var destinoLbl = document.getElementById("qDestinoLbl");
  var valorWrap = document.getElementById("qValorWrap"), valor = document.getElementById("qValor");
  // o valor da mercadoria só é pedido na importação (entra no seguro); na exportação o campo some e não é validado
  function setOperacao(exp){
    destinoLbl.textContent = exp ? "Local de coleta" : "Destino";
    valorWrap.hidden = exp; valor.disabled = exp;
    if(exp){ limpa(valor); }
  }
  form.querySelectorAll("input[name=operacao]").forEach(function(r){
    r.addEventListener("change", function(){ if(r.checked){ setOperacao(r.value === "Exportação"); } });
  });
  setOperacao(form.querySelector("input[name=operacao]:checked").value === "Exportação");
  // máscara de valor: "125000" vira "125.000" (valor inteiro, como as pessoas digitam);
  // centavos só se a pessoa digitar vírgula: "125000,5" → "125.000,5" e, ao sair do campo, "125.000,50"
  function maskValor(s){
    if(/^\s*\d+\.\d{1,2}\s*$/.test(s)){ s = s.replace(".", ","); } // colado no formato americano: 85000.00
    var partes = s.replace(/[^\d,]/g, "").split(",");
    var inteiro = partes[0].replace(/^0+(?=\d)/, "").slice(0, 12);
    var dec = partes.length > 1 ? "," + partes.slice(1).join("").slice(0, 2) : "";
    if(!inteiro && dec){ inteiro = "0"; }
    return inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + dec;
  }
  valor.addEventListener("input", function(){ valor.value = maskValor(valor.value); });
  valor.addEventListener("blur", function(){
    var m = valor.value.match(/,(\d?)$/);
    if(m){ valor.value = valor.value.replace(/,\d?$/, "," + (m[1] + "00").slice(0, 2)); }
  });
  var canal = "whatsapp";
  form.querySelectorAll("button[type=submit]").forEach(function(b){
    b.addEventListener("click", function(){ canal = b.getAttribute("data-canal"); });
  });
  function openLink(url, newTab){
    var a = document.createElement("a");
    a.href = url; a.setAttribute("data-notrack", ""); // já medido como cotacao_enviada
    if(newTab){ a.target = "_blank"; a.rel = "noopener"; }
    document.body.appendChild(a); a.click(); a.remove();
  }
  /* validação: mensagem ao lado do campo, dizendo o que fazer, e foco no primeiro erro */
  var status = document.getElementById("qStatus");
  function erro(input, texto){
    var campo = input.closest(".q-field"), id = "err-" + input.id, p = document.getElementById(id);
    if(!p){ p = document.createElement("p"); p.className = "q-err"; p.id = id; campo.appendChild(p); }
    p.textContent = texto;
    input.setAttribute("aria-invalid", "true"); input.setAttribute("aria-describedby", id);
  }
  function limpa(input){
    var p = document.getElementById("err-" + input.id);
    if(p){ p.remove(); }
    input.removeAttribute("aria-invalid"); input.removeAttribute("aria-describedby");
  }
  function validar(){
    var exp = form.querySelector("input[name=operacao]:checked").value === "Exportação";
    var regras = [
      [form.elements.destino, exp ? "Informe o local de coleta (cidade e UF)." : "Informe a cidade e a UF de entrega."],
      [valor, "Informe o valor da mercadoria. Ele define o seguro da carga."],
      [form.elements.nome, "Informe o seu nome para a equipe saber com quem falar."]
    ];
    var primeiro = null;
    regras.forEach(function(r){
      var input = r[0];
      if(input.disabled || input.value.trim()){ limpa(input); return; }
      erro(input, r[1]);
      if(!primeiro){ primeiro = input; }
    });
    if(primeiro){ primeiro.focus(); }
    return !primeiro;
  }
  form.addEventListener("input", function(e){ if(e.target.getAttribute("aria-invalid")){ limpa(e.target); } });
  form.addEventListener("submit", function(e){
    e.preventDefault();
    var f = form.elements, v = function(n){ return (f[n].value || "").trim(); };
    status.textContent = "";
    if(!validar()){ return; }
    var mercadoria = [v("carga"), f.imo.checked ? "carga perigosa (IMO)" : ""].filter(Boolean).join(" · ");
    var linhas = [
      ["Operação", form.querySelector("input[name=operacao]:checked").value],
      ["Serviço", v("servico")],
      ["Contêiner", v("conteiner")],
      ["Terminal", v("terminal")],
      [destinoLbl.textContent, v("destino")],
      ["Mercadoria", mercadoria],
      ["Peso aproximado", /^[\d.,\s]+$/.test(v("peso")) ? v("peso") + " t" : v("peso")],
      ["Valor da mercadoria", valor.disabled || !v("valor") ? "" : v("moeda") + " " + v("valor")],
      ["Nome", [v("nome"), v("empresa")].filter(Boolean).join(" · ")]
    ].filter(function(l){ return l[1]; }); // campos vazios não entram na mensagem
    if(canal === "email"){
      var corpo = "Olá, vim pelo site e gostaria de uma cotação.\n\n" + linhas.map(function(l){ return l[0] + ": " + l[1]; }).join("\n") + "\n";
      var assunto = "Cotação · " + v("servico").split(" –")[0] + " · " + v("destino");
      status.textContent = "Abrimos o seu aplicativo de e-mail com a cotação. Se nada abriu, escreva para " + EMAIL + ".";
      openLink("mailto:" + EMAIL + "?subject=" + encodeURIComponent(assunto) + "&body=" + encodeURIComponent(corpo), false);
    } else {
      var msg = "Olá, vim pelo site e gostaria de uma cotação.\n\n" + linhas.map(function(l){ return "*" + l[0] + ":* " + l[1]; }).join("\n");
      status.textContent = "Abrimos o WhatsApp com a sua cotação. Se não abriu, chame (13) 97804-3399.";
      openLink("https://wa.me/" + WA_NUM + "?text=" + encodeURIComponent(msg), true);
    }
    track("cotacao_enviada", { canal:canal, servico:v("servico"), operacao:form.querySelector("input[name=operacao]:checked").value });
  });

  /* serviço já escolhido quando a pessoa chega de uma página de serviço (/contato?servico=fcl) */
  var servSelect = document.getElementById("qServico");
  var pedido = new URLSearchParams(location.search).get("servico");
  var opt = pedido && servSelect.querySelector('option[data-slug="' + pedido.replace(/[^a-z-]/g, "") + '"]');
  if(opt){
    servSelect.value = opt.value;
    if(pedido === "redex"){ // REDEX é sempre exportação
      var exp = form.querySelector('input[name=operacao][value="Exportação"]');
      exp.checked = true; setOperacao(true);
    }
    if(pedido === "carga-projeto"){ document.getElementById("qConteiner").value = "Sem contêiner (carga solta ou em prancha)"; }
    servSelect.classList.add("prefilled");
    track("servico_escolhido", { servico:opt.value });
  }
  } // fim do formulário

  /* ---------- terminais: abas Cheio | Vazio no celular ---------- */
  var tabsBox = document.getElementById("termTabs");
  if(tabsBox){
  var tabs = [document.getElementById("tabCheio"), document.getElementById("tabVazio")];
  var panels = [document.getElementById("panelCheio"), document.getElementById("panelVazio")];
  var tabAtual = 0;
  function selectTab(i, focar){
    tabAtual = i;
    tabs.forEach(function(t, j){
      t.setAttribute("aria-selected", j === i ? "true" : "false");
      t.tabIndex = j === i ? 0 : -1;
      panels[j].classList.toggle("tab-hidden", j !== i);
    });
    if(focar){ tabs[i].focus(); }
  }
  function setupTabs(celular){
    tabsBox.hidden = !celular;
    if(celular){
      tabsBox.setAttribute("role", "tablist");
      tabs.forEach(function(t, j){
        t.setAttribute("role", "tab");
        panels[j].setAttribute("role", "tabpanel");
        panels[j].setAttribute("aria-labelledby", t.id);
      });
      selectTab(tabAtual, false);
    } else {
      tabsBox.removeAttribute("role");
      tabs.forEach(function(t, j){
        t.removeAttribute("role"); t.removeAttribute("aria-selected"); t.removeAttribute("tabindex");
        panels[j].removeAttribute("role"); panels[j].removeAttribute("aria-labelledby");
        panels[j].classList.remove("tab-hidden");
      });
    }
  }
  tabs.forEach(function(t, j){
    t.addEventListener("click", function(){ selectTab(j, false); track("terminais_aba", { aba:j ? "vazio" : "cheio" }); });
  });
  tabsBox.addEventListener("keydown", function(e){ // setas, Home e End, como em abas nativas
    var i = { ArrowRight:(tabAtual + 1) % 2, ArrowLeft:(tabAtual + 1) % 2, Home:0, End:1 }[e.key];
    if(i === undefined) return;
    e.preventDefault(); selectTab(i, true);
  });
  var mqCelular = window.matchMedia("(max-width:820px)");
  setupTabs(mqCelular.matches);
  mqCelular.addEventListener("change", function(m){ setupTabs(m.matches); });
  }

  onScroll();
  doc.classList.add("booted"); // avisa a rede de segurança do <head> que o script rodou

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
      var first = t < T;
      t = ((t % T) + T) % T;
      var c = mixC(prop(t, "c"), prop(t, "o"));
      shape.style.width = prop(t, "w").toFixed(2) + "px";
      shape.style.height = prop(t, "h").toFixed(2) + "px";
      shape.style.borderRadius = prop(t, "r").toFixed(2) + "px";
      shape.style.background = c.bg; shape.style.boxShadow = c.ring;
      // conteúdo de cada estado: entra com um leve desfoque depois que a forma começa a mudar, sai antes da próxima
      for(var i = 0; i < S.length; i++){
        var a = S[i].t, z = i + 1 < S.length ? S[i + 1].t : T;
        var tout = 1 - ease((t - (z - 0.03)) / 0.12), op; // o texto sai junto com o início da mudança da forma
        if(i === 0) op = (t < z ? tout : 0) * (first ? 1 : ease((t - 0.14) / 0.22)); // no 1º ciclo já aparece; depois volta com a forma // o botão volta no fim do ciclo
        else op = Math.min(ease((t - a - 0.14) / 0.22), tout);
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
    function stop(){ if(!raf) return; cancelAnimationFrame(raf); raf = 0; if(t0) tAcc += (performance.now() - t0) / 1000; }
    frame(0);
    new IntersectionObserver(function(es){
      visible = es[0].isIntersecting;
      if(visible && !document.hidden) start(); else stop();
    }, { rootMargin:"0px 0px -10% 0px" }).observe(shape);
    document.addEventListener("visibilitychange", function(){ if(document.hidden) stop(); else if(visible) start(); });
  })();

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
        if(idx < o.strips.length - 1) st.c.style.opacity = Math.max(0, Math.min(1, v - (u - 1))).toFixed(3);
      });
    }
    function finish(o){ set(o, o.n); o.el.querySelector(".odo").outerHTML = '<span aria-hidden="true">' + o.n + '</span>'; }
    function run(o, delay){
      if(o.done) return; o.done = true;
      if(reduce){ finish(o); return; }
      set(o, 0);
      var t0 = null, dur = 1500 + o.n * 6;
      setTimeout(function(){
        requestAnimationFrame(function step(ts){
          if(!t0) t0 = ts;
          var p = (ts - t0) / dur;
          set(o, o.n * ease(p));
          if(p < 1) requestAnimationFrame(step); else finish(o);
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
      r.setAttribute("class", "rbox"); r.setAttribute("width", "8"); r.setAttribute("height", "3.4"); r.setAttribute("rx", ".6");
      r.setAttribute("x", "-4"); r.setAttribute("y", "-1.7");
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

  /* ---------- vídeos curtos: tocam em loop, sem som, só enquanto aparecem na tela ----------
     Com movimento reduzido (ou se o navegador bloquear), ficam parados no pôster, com os controles à mostra. */
  (function(){
    var vids = Array.prototype.slice.call(document.querySelectorAll("video[data-autoplay]"));
    if(!vids.length) return;
    function manual(v){ v.controls = true; v.preload = "metadata"; }
    if(reduce || !("IntersectionObserver" in window)){ vids.forEach(manual); return; }
    function play(v){ var p = v.play(); if(p && p.catch){ p.catch(function(){ manual(v); }); } }
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        var v = e.target; v._vis = e.isIntersecting;
        if(v._vis && !document.hidden){ play(v); } else { v.pause(); }
      });
    }, { threshold:0.35 });
    vids.forEach(function(v){ io.observe(v); });
    document.addEventListener("visibilitychange", function(){
      vids.forEach(function(v){ if(document.hidden){ v.pause(); } else if(v._vis){ play(v); } });
    });
  })();
})();

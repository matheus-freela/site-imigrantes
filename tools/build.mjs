// Gera as páginas do site (HTML estático, sem dependências): node tools/build.mjs
// Fonte: src/data.mjs (dados) + src/pages/*.mjs (conteúdo de cada página). Saída na raiz do projeto,
// que é o que a Vercel publica (com cleanUrls: /terminais serve terminais.html).
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { SITE, WA_LINK, NAV, TERMINAIS, FOTOS, VIDEOS, LICENCAS, FAQ, SERVICOS } from '../src/data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const ver = (p) => createHash('md5').update(read(p)).digest('hex').slice(0, 8); // quebra o cache a cada mudança

/* ---------- marca: caminhos do images/marca.svg (gerado por tools/trace-marca.py) ---------- */
const MARCA = read('images/marca.svg');
const markDefs = MARCA.match(/<defs>[\s\S]*?<\/defs>/)[0];
const markGray = MARCA.match(/id="seta-cinza" fill="url\(#mG\)" d="([^"]+)"/)[1];
const markRed = MARCA.match(/id="seta-vermelha" fill="url\(#mR\)" d="([^"]+)"/)[1];
const markView = MARCA.match(/viewBox="([^"]+)"/)[1];
// logo do cabeçalho: cada seta é revelada por um traço que corre pelo meio dela (corpo, depois a ponta)
const brandMark = `<svg class="brand-mark" viewBox="${markView}" width="169" height="183" aria-hidden="true" focusable="false">
        ${markDefs.replace(/\n/g, '')}
        <mask id="bmG" maskUnits="userSpaceOnUse" x="-60" y="-60" width="300" height="320"><path class="bm-s bm-gb" d="M76 50C46 80 14 122 22 156C30 184 84 180 112 156L130 140" pathLength="1"/><path class="bm-s bm-gh" d="M118 132L168 80" pathLength="1"/></mask>
        <mask id="bmR" maskUnits="userSpaceOnUse" x="-60" y="-60" width="300" height="320"><path class="bm-s bm-rb" d="M88 131C55 112 10 90 11 60C12 28 55 12 92 18C100 20 106 26 112 36" pathLength="1"/><path class="bm-s bm-rh" d="M100 44L170 58" pathLength="1"/></mask>
        <path fill="url(#mG)" mask="url(#bmG)" d="${markGray}"/>
        <path fill="url(#mR)" mask="url(#bmR)" d="${markRed}"/>
      </svg>`;

/* ---------- pedaços reutilizados ---------- */
const arr = (c = '→') => `<span class="arr" aria-hidden="true">${c}</span>`;
export const H = {
  SITE, WA_LINK, NAV, TERMINAIS, FOTOS, VIDEOS, LICENCAS, FAQ, SERVICOS, arr,

  // foto da frota em dois tamanhos
  pic(id, { sizes = '(max-width:900px) 100vw, 50vw', eager = false, cls = '', alt } = {}) {
    const f = FOTOS[id];
    return `<img${cls ? ` class="${cls}"` : ''} src="/images/fotos/${id}-1600.webp" srcset="/images/fotos/${id}-800.webp 800w, /images/fotos/${id}-1600.webp 1600w" sizes="${sizes}" width="${f.w}" height="${f.h}" alt="${alt ?? f.alt}"${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}>`;
  },

  // vídeo curto sem som: toca em loop só enquanto aparece na tela (main.js); sem JS, mostra o pôster com controles
  video(v, { cls = '' } = {}) {
    return `<video${cls ? ` class="${cls}"` : ''} data-autoplay muted loop playsinline preload="none" poster="/video/${v.id}-poster.webp" width="720" height="406" aria-label="${v.t}: ${v.d}"><source src="/video/${v.id}.mp4" type="video/mp4"></video>`;
  },

  // topo das páginas internas
  pageHero({ crumbs = [], tag, lines, lead, media = '', btns = '', id = 'phTitle', cls = '' }) {
    const trail = crumbs.map(([l, h]) => h ? `<a href="${h}">${l}</a>` : `<span aria-current="page">${l}</span>`).join('<span aria-hidden="true">/</span>');
    return `<section class="page-hero${media ? '' : ' no-media'}${cls ? ' ' + cls : ''}" aria-labelledby="${id}">
  <div class="ph-copy">
    <nav class="crumbs" aria-label="Você está em"><a href="/">Início</a><span aria-hidden="true">/</span>${trail}</nav>
    ${tag ? `<div class="tag">${tag}</div>` : ''}
    <h1 class="h-xl" id="${id}">${lines.map((l) => `<span class="ln"><span>${l}</span></span>`).join('')}</h1>
    ${lead ? `<p class="lead">${lead}</p>` : ''}
    ${btns}
  </div>
  ${media ? `<div class="ph-media"><div class="frame">${media}</div></div>` : ''}
</section>`;
  },

  // painel de partidas dos serviços (cada linha leva à página do serviço)
  board() {
    return `<div class="board" role="list">
      <div class="board-head" aria-hidden="true"><span>Código</span><span>Serviço</span><span>Como funciona</span><span></span></div>
${SERVICOS.map((s) => `      <div class="svc" role="listitem" data-reveal>
        <div class="flap" data-nosnippet data-text="${s.code}" aria-hidden="true"></div>
        <h3>${s.nome}</h3>
        <p>${s.resumo}</p>
        <span class="go" aria-hidden="true">→</span>
        <a class="cover" href="/servicos/${s.slug}"><span class="sr-only">${s.nome}: ver como funciona</span></a>
      </div>`).join('\n')}
    </div>`;
  },

  // passos numerados
  steps(list, { cls = '' } = {}) {
    return `<ol class="why steps${cls ? ' ' + cls : ''}">${list.map(([t, d], i) => `
      <li data-reveal><span class="n">${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}
    </ol>`;
  },

  faqList(items) {
    return `<div class="faq" data-reveal>${items.map((f) => `
      <details>
        <summary>${f.q}</summary>
        <div class="faq-a">${f.a}</div>
      </details>`).join('')}
    </div>`;
  },

  termCols() {
    const col = (k, id, titulo, sub, pre) => `<div class="term-col" id="${id}" data-reveal>
        <h3><span>${titulo}<small>${sub}</small></span><span class="count" aria-hidden="true" data-odo>${TERMINAIS[k].length}</span></h3>
        <ul class="term-list" aria-label="${TERMINAIS[k].length} terminais de ${titulo.toLowerCase()}">
${TERMINAIS[k].map((t, i) => `          <li><span>${pre}-${String(i + 1).padStart(2, '0')}</span>${t}</li>`).join('\n')}
        </ul>
      </div>`;
    return `<!-- abas só no celular (o JS liga); no desktop as duas colunas ficam lado a lado -->
    <div class="term-tabs" id="termTabs" aria-label="Tipo de contêiner" hidden>
      <button type="button" id="tabCheio" aria-controls="panelCheio">Cheio <span>${TERMINAIS.cheio.length}</span></button>
      <button type="button" id="tabVazio" aria-controls="panelVazio">Vazio <span>${TERMINAIS.vazio.length}</span></button>
    </div>
    <div class="term-grid">
      ${col('cheio', 'panelCheio', 'Contêiner cheio', 'Carregamento', 'C')}
      ${col('vazio', 'panelVazio', 'Contêiner vazio', 'Retirada e devolução', 'V')}
    </div>`;
  },

  // habilitações com o logo de cada órgão
  licGrid() {
    return `<ul class="lic-grid">${LICENCAS.map((l) => `
      <li data-reveal>
        <div class="lic-logo">${l.id ? `<img src="/images/licencas/${l.id}.png" alt="" loading="lazy" decoding="async">` : `<span class="lic-mono" aria-hidden="true">${l.nome}</span>`}</div>
        <h3>${l.nome}</h3><span class="lic-org">${l.org}</span>${l.d ? `<p>${l.d}</p>` : ""}
      </li>`).join('')}
      <li class="lic-more" data-reveal><h3>Demais autorizações</h3><p>Conforme a exigência de cada operação. Pergunte pela sua carga na cotação.</p></li>
    </ul>`;
  },

  // faixa de logos (início)
  licStrip() {
    return `<ul class="lic-strip" aria-label="Órgãos que nos habilitam">${LICENCAS.filter((l) => l.id).map((l) => `<li><img src="/images/licencas/${l.id}.png" alt="${l.nome}" title="${l.nome}" loading="lazy" decoding="async"></li>`).join('')}</ul>`;
  },

  // chamada final para a cotação (todas as páginas, menos a de contato)
  cta({ servico } = {}) {
    const href = servico ? `/contato?servico=${servico.slug}#cotacao` : '/contato#cotacao';
    return `<div class="hazard" aria-hidden="true"></div>
<section class="sec on-ink cta-band" data-wa-hide aria-labelledby="ctaTitle">
  <div class="wrap cta-grid">
    <h2 class="h-xl" id="ctaTitle" data-reveal>Tem carga<br>saindo do<br>porto?</h2>
    <div class="cta-copy" data-reveal>
      <p class="lead">${servico ? `Monte a cotação de ${servico.code === 'IMP·EXP' ? 'apoio logístico' : servico.code === 'PROJETO' ? 'carga projeto' : servico.code} em um minuto` : 'Monte a cotação em um minuto'} ou fale direto com a nossa equipe, de segunda a sexta, das 8h às 18h.</p>
      <div class="btn-row">
        <a class="btn btn-red" href="${href}">Montar cotação ${arr()}</a>
        <a class="btn btn-line-light" href="${WA_LINK}" target="_blank" rel="noopener">WhatsApp ${SITE.waTel} ${arr('↗')}</a>
      </div>
    </div>
  </div>
</section>`;
  },
};

/* ---------- página inteira ---------- */
function layout(p) {
  const url = SITE.base + (p.path === '/' ? '/' : p.path);
  const og = SITE.base + '/og-image-2.jpg';
  const navLinks = NAV.map((n) => `<a href="${n.href}"${p.nav === n.id ? ' class="active" aria-current="page"' : ''}>${n.label}</a>`).join('\n      ');
  const mmLinks = NAV.map((n, i) => `<a href="${n.href}"${p.nav === n.id ? ' aria-current="page"' : ''}>${n.label} <small>${String(i + 1).padStart(2, '0')}</small></a>`).join('\n    ');
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${p.title}</title>
<meta name="description" content="${p.description}">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#101215">
<link rel="canonical" href="${url}">

<meta property="og:type" content="website">
<meta property="og:site_name" content="Transportes Imigrantes">
<meta property="og:title" content="${p.ogTitle || p.title}">
<meta property="og:description" content="${p.description}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${p.ogTitle || p.title}">
<meta name="twitter:description" content="${p.description}">
<meta name="twitter:image" content="${og}">

<link rel="icon" type="image/png" href="/favicon.png">
<link rel="icon" type="image/svg+xml" href="/images/marca.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<!-- ANALYTICS (Vercel Web Analytics): depois de ativar em vercel.com > projeto > Analytics, descomente a linha abaixo
     (a fila "window.va" já é criada em js/boot.js).
<script defer src="/_vercel/insights/script.js"></script>
-->
<link rel="preload" href="/fonts/big-shoulders-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/ibm-plex-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/site.css?v=${ver('css/site.css')}">
<script src="/js/boot.js"></script>
${p.head || ''}
</head>
<body class="pg-${p.nav || 'inicio'}">
<a href="#conteudo" class="skip-link">Pular para o conteúdo</a>

<!-- ================= CABEÇALHO ================= -->
<header class="site-head" id="siteHead">
  <div class="wrap head-row">
    <a href="/" class="brand" aria-label="Transportes Imigrantes, página inicial">
      ${brandMark}
      <span class="word" translate="no"><small>Transportes</small>Imigrantes</span>
    </a>
    <nav class="nav" aria-label="Principal">
      ${navLinks}
      <a class="head-cta" href="${WA_LINK}" target="_blank" rel="noopener">Pedir cotação</a>
    </nav>
    <button class="burger" id="burger" aria-label="Abrir menu" aria-expanded="false" aria-controls="mobileMenu"><span></span><span></span><span></span></button>
  </div>
</header>

<div class="mobile-menu" id="mobileMenu" aria-hidden="true">
  <nav aria-label="Menu">
    ${mmLinks}
  </nav>
  <a class="btn btn-red" href="${WA_LINK}" target="_blank" rel="noopener">Pedir cotação no WhatsApp ${arr()}</a>
  <div class="mm-foot">
    <a href="tel:${SITE.tel}">${SITE.telTxt}</a>
    <a href="mailto:${SITE.email}">${SITE.email}</a>
  </div>
</div>

<main id="conteudo">
${p.body.trim()}
</main>

<!-- ================= RODAPÉ ================= -->
<footer class="foot">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <a href="/" class="brand" style="color:var(--on-ink);">
          <img src="/images/marca.svg" alt="" width="169" height="183" loading="lazy">
          <span class="word" translate="no"><small>Transportes</small>Imigrantes</span>
        </a>
        <p style="margin-top:14px; max-width:40ch;">Transporte rodoviário de contêineres de importação e exportação, com entregas no Sudeste, Sul e Mato Grosso do Sul.</p>
        <p class="legal">Transportes Rodoviários Imigrantes Ltda<br>CNPJ 45.062.080/0001-48 · RNTRC 00059000-9</p>
      </div>
      <div>
        <h4>Serviços</h4>
        <ul>
${SERVICOS.map((s) => `          <li><a href="/servicos/${s.slug}">${s.nome}</a></li>`).join('\n')}
        </ul>
      </div>
      <div>
        <h4>Navegação</h4>
        <ul>
          <li><a href="/">Início</a></li>
${NAV.map((n) => `          <li><a href="${n.href}">${n.label}</a></li>`).join('\n')}
        </ul>
      </div>
      <div>
        <h4>Contato</h4>
        <ul>
          <li><a href="https://wa.me/${SITE.wa}" target="_blank" rel="noopener">WhatsApp ${SITE.waTel}</a></li>
          <li><a href="tel:${SITE.tel}">Tel. ${SITE.telTxt}</a></li>
          <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
          <li><span class="foot-k">Endereço · sede própria</span>Av. Dr. Pedro Lessa, 3076 · Santos/SP</li>
          <li>Segunda a sexta, 8h às 18h</li>
        </ul>
      </div>
    </div>
  </div>
  <div class="giant" aria-hidden="true" data-nosnippet translate="no">Imigrantes</div>
  <div class="foot-bottom">
    <div class="wrap" style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; width:100%;">
      <span>© <span data-ano-atual>2026</span> Transportes Rodoviários Imigrantes · desde 1974</span>
      <a href="#conteudo">Voltar ao topo ↑</a>
    </div>
  </div>
</footer>

<a class="wa-float" id="waFloat" href="${WA_LINK}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19l-4 1z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 9.5c.3 2 2.2 4.2 4.6 4.8l1-1.2 2 .9c-.2 1-1 1.8-2.2 1.8-3 0-6.6-3.4-6.6-6.4 0-1.2.8-2 1.8-2.2l.9 2-1 1z" fill="currentColor"/></svg>
  <span>Pedir cotação</span>
</a>

<script src="/js/main.js?v=${ver('js/main.js')}" defer></script>
</body>
</html>
`;
}

/* ---------- gera tudo ---------- */
const pages = [];
for (const f of readdirSync(join(ROOT, 'src/pages')).filter((f) => f.endsWith('.mjs')).sort()) {
  const mod = await import(pathToFileURL(join(ROOT, 'src/pages', f)).href);
  const out = mod.default(H);
  pages.push(...(Array.isArray(out) ? out : [out]));
}
const today = new Date().toISOString().slice(0, 10);
for (const p of pages) {
  const file = p.path === '/' ? 'index.html' : p.path.slice(1) + '.html';
  mkdirSync(dirname(join(ROOT, file)), { recursive: true });
  writeFileSync(join(ROOT, file), layout(p));
  console.log('ok', file);
}
writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url>
    <loc>${SITE.base}${p.path === '/' ? '/' : p.path}</loc>
    <lastmod>${today}</lastmod>
    <priority>${p.path === '/' ? '1.0' : p.path.split('/').length > 2 ? '0.7' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>
`);
console.log('ok sitemap.xml (' + pages.length + ' páginas)');

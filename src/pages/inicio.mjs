// Início: resumo de tudo, com um caminho claro para cada página e para a cotação.
export default (h) => ({
  path: '/', nav: null,
  title: 'Transportes Imigrantes — Transporte de contêineres do Porto de Santos',
  ogTitle: 'Transportes Imigrantes — Do Porto de Santos até a sua porta',
  description: 'Transporte rodoviário de contêineres de importação e exportação desde 1974, com base no Porto de Santos/SP. FCL, LCL, DTA, REDEX, carga projeto e entregas no Sudeste, Sul e Mato Grosso do Sul.',
  head: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Transportes Imigrantes",
  "legalName": "Transportes Rodoviários Imigrantes Ltda",
  "alternateName": "Transportes Rod. Imigrantes",
  "url": "${h.SITE.base}/",
  "logo": "${h.SITE.base}/images/marca.svg",
  "image": "${h.SITE.base}/og-image-2.jpg",
  "telephone": "+551332197180",
  "email": "${h.SITE.email}",
  "foundingDate": "1974",
  "areaServed": [
    {"@type":"State","name":"São Paulo"},{"@type":"State","name":"Rio de Janeiro"},{"@type":"State","name":"Minas Gerais"},{"@type":"State","name":"Espírito Santo"},
    {"@type":"State","name":"Paraná"},{"@type":"State","name":"Santa Catarina"},{"@type":"State","name":"Rio Grande do Sul"},{"@type":"State","name":"Mato Grosso do Sul"}
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Av. Dr. Pedro Lessa, 3076 - Conj. 11",
    "addressLocality": "Santos",
    "addressRegion": "SP",
    "postalCode": "11025-016",
    "addressCountry": "BR"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "08:00",
    "closes": "18:30"
  },
  "description": "Transporte rodoviário de contêineres de importação e exportação desde 1974, com base no Porto de Santos/SP. FCL, LCL, DTA, REDEX e entregas no Sudeste, Sul e Mato Grosso do Sul."
}
</script>`,
  body: `
<!-- ================= HERO ================= -->
<section class="hero" id="topo" aria-labelledby="heroTitle">
  <div class="hero-copy">
    <span class="hero-code"><span class="box">Santos · SP</span> Transporte rodoviário de contêineres</span>
    <h1 class="h-xl" id="heroTitle">
      <span class="ln"><span>Do Porto de</span></span>
      <span class="ln"><span><em>Santos</em></span></span>
      <span class="ln"><span>até a sua</span></span>
      <span class="ln"><span>porta.</span></span>
    </h1>
    <p class="lead">Levamos contêineres de importação e exportação do cais até o destino final, em FCL, LCL, DTA e REDEX. A base é a mesma desde 1974: o Porto de Santos.</p>
    <div class="btn-row">
      <a class="btn btn-red" href="${h.WA_LINK}" target="_blank" rel="noopener">Pedir cotação no WhatsApp ${h.arr()}</a>
      <a class="btn btn-line-light" href="/contato#cotacao">Montar cotação ${h.arr()}</a>
    </div>
  </div>

  <div class="hero-media">
    <div class="frame" id="heroFrame">
      ${h.pic('frota-conteiner', { eager: true, sizes: '(max-width:940px) 100vw, 46vw' })}
    </div>
    <span class="stamp" aria-hidden="true" data-nosnippet>1974</span>
  </div>

  <div class="hero-facts">
    <div class="wrap">
      <div class="fact"><span class="v"><span data-anos data-odo>52</span> anos</span><span class="k">De estrada · desde 1974</span></div>
      <div class="fact"><span class="v"><span data-odo>27</span> terminais</span><span class="k">Cheios e vazios na Baixada Santista</span></div>
      <div class="fact"><span class="v">FCL · LCL</span><span class="k">DTA · REDEX · IMP/EXP</span></div>
      <div class="fact"><span class="v">IMO · ANVISA</span><span class="k">Cargas reguladas</span></div>
    </div>
  </div>
</section>

<!-- ================= SERVIÇOS ================= -->
<section class="sec" id="servicos" aria-labelledby="svcTitle">
  <div class="wrap">
    <div class="sec-head">
      <div class="tag" data-reveal><b>01</b> Serviços</div>
      <h2 class="h-l" id="svcTitle" data-reveal>Nossos<br>serviços</h2>
      <p class="lead" data-reveal>Cada modalidade tem sua documentação, seu prazo e seu tipo de carga. Escolha a sua para ver como funciona.</p>
    </div>
    ${h.board()}
  </div>
</section>

<!-- ================= TERMINAIS (resumo) ================= -->
<section class="sec" id="terminais" aria-labelledby="termTitle" style="background:var(--paper-2);">
  <div class="wrap teaser">
    <div class="teaser-copy">
      <div class="tag" data-reveal><b>02</b> Terminais</div>
      <h2 class="h-l" id="termTitle" data-reveal>Do terminal<br>ao seu destino</h2>
      <p class="lead" data-reveal>Retiramos e entregamos nos principais terminais e depósitos da Baixada Santista: carregamento do contêiner cheio, retirada e devolução do vazio.</p>
      <a class="btn btn-line-dark" href="/terminais" data-reveal>Ver os 27 terminais ${h.arr()}</a>
    </div>
    <div class="teaser-nums" data-reveal>
      <div class="tn"><span class="count" aria-hidden="true" data-odo>${h.TERMINAIS.cheio.length}</span><span class="sr-only">${h.TERMINAIS.cheio.length}</span><b>Contêiner cheio</b><small>Carregamento</small></div>
      <div class="tn"><span class="count" aria-hidden="true" data-odo>${h.TERMINAIS.vazio.length}</span><span class="sr-only">${h.TERMINAIS.vazio.length}</span><b>Contêiner vazio</b><small>Retirada e devolução</small></div>
    </div>
  </div>
</section>

<!-- ================= COBERTURA ================= -->
<section class="sec on-ink cover-sec" id="cobertura" aria-labelledby="covTitle">
  <div class="wrap cover-grid">
    <div class="cover-copy">
      <div class="tag" data-reveal><b>03</b> Cobertura</div>
      <h2 class="h-l" id="covTitle" data-reveal>Saiu de Santos,<br>chega onde<br>precisa chegar.</h2>
      <p class="lead" data-reveal>Retiramos o contêiner no terminal e seguimos pela estrada até o seu destino no Sudeste, Sul e Mato Grosso do Sul.</p>
      <div class="route-from" data-reveal><span class="dot"></span> Origem: Porto de Santos · SP</div>
      <ul class="city-list" id="cityList" data-reveal></ul>
    </div>
    <div class="map-box" id="mapBox">
      <svg id="brMap" viewBox="105 165 314 250" role="img" aria-label="Mapa do Sudeste e do Sul do Brasil com rotas partindo do Porto de Santos para cidades do Sudeste, do Sul e de Mato Grosso do Sul"></svg>
      <p class="map-note">Mapa ilustrativo</p>
    </div>
  </div>
</section>

<!-- ================= A EMPRESA (resumo) ================= -->
<section class="sec" id="historia" aria-labelledby="histTitle">
  <div class="wrap hist-grid">
    <div class="hist-copy">
      <div class="tag" data-reveal><b>04</b> A empresa</div>
      <div data-reveal style="margin-top:28px;">
        <div class="year-big" id="yearCounter" aria-hidden="true" data-nosnippet>1974</div>
        <div class="year-cap"><span>1974</span><span><span data-anos>52</span> anos de estrada</span><span data-ano-atual>2026</span></div>
      </div>
      <h2 class="h-l" id="histTitle" style="margin-top:40px; font-size:clamp(2rem,4vw,3rem);" data-reveal>Mesma base, outra estrada.</h2>
      <p data-reveal>A Transportes Rodoviários Imigrantes nasceu em 1974, encostada no Porto de Santos. A frota mudou, o porto cresceu e a papelada ficou mais complexa, mas o jeito de trabalhar continua o mesmo: perto do cliente, acompanhando cada contêiner até o destino.</p>
      <p data-reveal><a class="more" href="/empresa">Conheça a empresa ${h.arr()}</a></p>
    </div>

    <figure data-reveal>
      <div class="compare" id="compare">
        <img src="/images/entao-caminhao-44.jpg" alt="Caminhão antigo da frota, unidade 44, com as faixas vermelhas da marca Imigrantes" width="640" height="512" loading="lazy" decoding="async">
        <img class="after" src="/images/hoje-caminhao-selo-50anos.jpg" alt="Caminhão atual da frota com o selo de 50 anos" width="640" height="512" loading="lazy" decoding="async">
        <span class="lbl l">Antes · Nº 44</span>
        <span class="lbl r">Hoje</span>
        <input type="range" min="0" max="100" value="50" aria-label="Arraste para comparar o caminhão antigo com o atual">
        <span class="handle" aria-hidden="true"></span>
      </div>
      <figcaption class="compare-cap">← Arraste para comparar a frota de antes com a de hoje →</figcaption>
    </figure>
  </div>
</section>

<!-- ================= HABILITAÇÕES (faixa) ================= -->
<section class="sec lic-band" aria-labelledby="licTitle" style="background:var(--paper-2);">
  <div class="wrap">
    <div class="sec-head">
      <div class="tag" data-reveal><b>05</b> Habilitações</div>
      <h2 class="h-l" id="licTitle" data-reveal>Carga regulada<br>exige licença</h2>
      <p class="lead" data-reveal>Somos habilitados para transportar produtos controlados, perigosos, de saúde e em trânsito aduaneiro.</p>
    </div>
    <div data-reveal>${h.licStrip()}</div>
    <p class="lic-band-more" data-reveal><a class="more" href="/empresa#habilitacoes">Ver o que cada habilitação cobre ${h.arr()}</a></p>
  </div>
</section>

${h.cta()}
`,
});

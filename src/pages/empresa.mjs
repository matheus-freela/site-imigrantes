export default (h) => ({
  path: '/empresa', nav: 'empresa',
  title: 'A empresa — Transportes Imigrantes, desde 1974 no Porto de Santos',
  description: 'Desde 1974 no Porto de Santos. Conheça a história da Transportes Rodoviários Imigrantes, a homenagem do SINDISAN pelos 50 anos e as habilitações para cargas reguladas.',
  body: `
${h.pageHero({
  crumbs: [['A empresa']], tag: '<b>04</b> A empresa', lines: ['Desde 1974', 'no Porto', 'de Santos'],
  lead: 'Transporte rodoviário construído em cima de um porto que conhecemos de perto: importação, exportação e contêineres, com a mesma base há mais de cinco décadas.',
  media: h.pic('frota-patio', { eager: true }),
})}

<!-- ================= HISTÓRIA ================= -->
<section class="sec" id="historia" aria-labelledby="histTitle">
  <div class="wrap hist-grid">
    <div class="hist-copy">
      <div class="tag" data-reveal><b>→</b> História</div>
      <div data-reveal style="margin-top:28px;">
        <div class="year-big" id="yearCounter" aria-hidden="true" data-nosnippet>1974</div>
        <div class="year-cap"><span>1974</span><span><span data-anos>52</span> anos de estrada</span><span data-ano-atual>2026</span></div>
      </div>
      <h2 class="h-l" id="histTitle" style="margin-top:40px; font-size:clamp(2rem,4vw,3rem);" data-reveal>Mesma base, outra estrada.</h2>
      <p data-reveal>A Transportes Rodoviários Imigrantes nasceu em 1974, encostada no Porto de Santos. A frota mudou, o porto cresceu e a papelada ficou mais complexa, mas o jeito de trabalhar continua o mesmo: perto do cliente, acompanhando cada contêiner até o destino.</p>
      <p data-reveal>Conhecemos a complexidade da operação portuária e sabemos que cada carga tem as suas exigências. É por isso que cada viagem é planejada e acompanhada, da retirada no terminal à entrega.</p>
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

<!-- ================= HOMENAGEM SINDISAN ================= -->
<section class="sec on-ink" id="homenagem" aria-labelledby="homTitle">
  <div class="wrap tribute">
    <figure class="tr-portrait" data-reveal>
      <img src="/images/homenagem/sindisan-retrato.webp" alt="Marco, à frente da Imigrantes, recebe a placa comemorativa das mãos do presidente do SINDISAN" width="1000" height="1229" loading="lazy" decoding="async">
      <figcaption>Marco, à frente da Imigrantes, recebe a homenagem do presidente do SINDISAN.</figcaption>
    </figure>
    <div class="tr-copy">
      <div class="tag" data-reveal><b>→</b> Reconhecimento</div>
      <h2 class="h-l" id="homTitle" data-reveal>Homenageada<br>pelos 50 anos</h2>
      <p class="lead" data-reveal>Em agosto de 2024, o SINDISAN, Sindicato das Empresas de Transporte Comercial de Carga do Litoral Paulista, homenageou a Imigrantes com uma placa comemorativa pelos 50 anos de atuação no transporte rodoviário de cargas.</p>
      <p data-reveal>A homenagem aconteceu na celebração dos 87 anos da própria entidade, ao lado de outras cinco transportadoras que também completaram meio século de operação em 2024.</p>
      <div class="tr-date" data-reveal><img src="/images/homenagem/sindisan-selo.webp" alt="" width="480" height="480" loading="lazy" decoding="async"><span>Santos<br>21 de agosto de 2024</span></div>
    </div>
    <figure class="tr-plaque" data-reveal>
      <img src="/images/homenagem/sindisan-placa.webp" alt="Placa comemorativa do SINDISAN pelos 50 anos da Transportes Rodoviários Imigrantes" width="1200" height="1008" loading="lazy" decoding="async">
    </figure>
  </div>
</section>

<!-- ================= HABILITAÇÕES ================= -->
<section class="sec" id="habilitacoes" aria-labelledby="licTitle" style="background:var(--paper-2);">
  <div class="wrap">
    <div class="sec-head">
      <div class="tag" data-reveal><b>→</b> Habilitações</div>
      <h2 class="h-l" id="licTitle" data-reveal>Carga regulada<br>exige licença</h2>
      <p class="lead" data-reveal>Nem toda carga pode ser levada por qualquer transportadora. Estas são as autorizações por trás das nossas operações.</p>
    </div>
    ${h.licGrid()}
  </div>
</section>

<!-- ================= COMO TRABALHAMOS ================= -->
<section class="sec" id="como" aria-labelledby="comoTitle">
  <div class="wrap">
    <div class="sec-head">
      <div class="tag" data-reveal><b>→</b> Como trabalhamos</div>
      <h2 class="h-l" id="comoTitle" data-reveal>Da solicitação<br>à entrega</h2>
      <p class="lead" data-reveal>Toda operação passa pelas mesmas cinco etapas, do primeiro contato à entrega nas condições combinadas.</p>
    </div>
    ${h.steps([
      ['Solicitação', 'Você entra em contato e conta o que precisa transportar.'],
      ['Análise', 'A equipe avalia origem, destino, tipo de carga e as particularidades da operação.'],
      ['Planejamento', 'Definimos o veículo, o trajeto e a documentação da viagem.'],
      ['Operação', 'A carga segue com a frota rastreada e acompanhamento da nossa equipe.'],
      ['Entrega', 'A operação fecha nas condições acordadas, com o vazio devolvido quando for o caso.'],
    ], { cls: 'cols-5' })}
  </div>
</section>

${h.cta()}
`,
});

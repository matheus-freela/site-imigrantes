export default (h) => {
  const frota = ['frota-patio', 'patio-dois-caminhoes', 'frota-tres-eixos', 'prancha-urbana', 'carregamento-equipe', 'carregamento-guindaste'];
  const legenda = {
    'frota-patio': 'Pátio', 'patio-dois-caminhoes': 'Porta-contêineres', 'frota-tres-eixos': 'Caminhão e prancha',
    'prancha-urbana': 'Carga projeto', 'carregamento-equipe': 'Equipe', 'carregamento-guindaste': 'Carregamento',
  };
  return {
    path: '/operacao', nav: 'operacao',
    title: 'Operação e frota — Transportes Imigrantes',
    description: 'Desova de contêiner, movimentação com empilhadeira e guindaste, frota própria e carga projeto em prancha. Veja a operação da Transportes Imigrantes na estrada.',
    body: `
${h.pageHero({
  crumbs: [['Operação']], tag: '<b>03</b> Operação', lines: ['A estrutura', 'por trás', 'de cada viagem'],
  lead: 'Dos caminhões ao pessoal que acompanha a carga dentro do porto: desova, movimentação, carga projeto e estrada.',
  media: h.pic('carregamento-guindaste', { eager: true }),
})}

<section class="sec on-ink" id="desova" aria-labelledby="opsTitle">
  <div class="wrap ops-grid">
    <div>
      <div class="tag" data-reveal><b>→</b> Movimentação</div>
      <h2 class="h-l" id="opsTitle" style="margin:22px 0 36px; font-size:clamp(2.2rem,4.4vw,3.8rem);" data-reveal>Desova e<br>movimentação</h2>
      <ol class="ops-list">
        <li data-reveal><span class="n">OP-01</span><h3>Desova de contêiner</h3><p>Retirada organizada da carga, sem travar o fluxo e sem risco para a mercadoria.</p></li>
        <li data-reveal><span class="n">OP-02</span><h3>Empilhadeira e guindaste</h3><p>Equipamento para paletizados, volumes pesados e cargas especiais.</p></li>
        <li data-reveal><span class="n">OP-03</span><h3>Controle e segurança</h3><p>Cada etapa planejada e acompanhada, protegendo a carga e a equipe.</p></li>
      </ol>
    </div>
    <div class="reel" data-reveal>
      <figure><img src="/images/desova-conteiner.jpg" alt="Contêiner aberto com carga sendo desovada" width="480" height="360" loading="lazy" decoding="async"><figcaption><b>01</b>Desova</figcaption></figure>
      <figure><img src="/images/movimentacao-paletizada.jpg" alt="Carreta com contêiner e carga especial em área coberta" width="480" height="360" loading="lazy" decoding="async"><figcaption><b>02</b>Movimentação</figcaption></figure>
      <figure><img src="/images/apoio-guindaste.jpg" alt="Guindaste içando equipamento sobre carreta" width="480" height="360" loading="lazy" decoding="async"><figcaption><b>03</b>Guindaste</figcaption></figure>
      <figure><img src="/images/operacao-carga-especial.jpg" alt="Carreta com carga especial sinalizada como veículo longo" width="480" height="360" loading="lazy" decoding="async"><figcaption><b>04</b>Carga especial</figcaption></figure>
    </div>
  </div>
</section>

<section class="sec" id="frota" aria-labelledby="frotaTitle">
  <div class="wrap">
    <div class="sec-head">
      <div class="tag" data-reveal><b>→</b> Frota</div>
      <h2 class="h-l" id="frotaTitle" data-reveal>A nossa<br>frota</h2>
      <p class="lead" data-reveal>Cavalos mecânicos para contêineres de 20 e 40 pés e prancha para carga excedente, com todos os caminhões rastreados.</p>
    </div>
    <div class="photo-grid">
${frota.map((id, i) => `      <figure data-reveal>${h.pic(id, { sizes: '(max-width:620px) 100vw, (max-width:960px) 50vw, 33vw' })}<figcaption><b>${String(i + 1).padStart(2, '0')}</b>${legenda[id]}</figcaption></figure>`).join('\n')}
    </div>
  </div>
</section>

<section class="sec on-ink" id="estrada" aria-labelledby="estradaTitle">
  <div class="wrap">
    <div class="sec-head">
      <div class="tag" data-reveal><b>→</b> Na estrada</div>
      <h2 class="h-l" id="estradaTitle" data-reveal>Na<br>estrada</h2>
      <p class="lead" data-reveal>Da Serra do Mar às vias urbanas: trechos reais das nossas viagens, de Santos ao planalto.</p>
    </div>
    <div class="video-grid">
${h.VIDEOS.map((v, i) => `      <figure data-reveal>${h.video(v)}<figcaption><b>${String(i + 1).padStart(2, '0')}</b><span><strong>${v.t}</strong>${v.d}</span></figcaption></figure>`).join('\n')}
    </div>
  </div>
</section>

${h.cta()}
`,
  };
};

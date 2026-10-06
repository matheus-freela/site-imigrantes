export default (h) => ({
  path: '/terminais', nav: 'terminais',
  title: 'Terminais atendidos na Baixada Santista — Transportes Imigrantes',
  description: 'Retiramos e entregamos em 27 terminais e depósitos da Baixada Santista: 13 de contêiner cheio e 14 de retirada e devolução de vazio.',
  body: `
${h.pageHero({
  crumbs: [['Terminais']], tag: '<b>02</b> Terminais', lines: ['Do terminal', 'ao seu destino'],
  lead: 'Retiramos e entregamos nos principais terminais e depósitos da Baixada Santista: carregamento do contêiner cheio, retirada e devolução do vazio.',
  media: h.video(h.VIDEOS.find((v) => v.id === 'caminhao-rodovia')),
})}

<section class="sec" id="lista" aria-labelledby="listaTitle" style="background:var(--paper-2);">
  <div class="wrap">
    <div class="sec-head">
      <div class="tag" data-reveal><b>→</b> Onde operamos</div>
      <h2 class="h-l" id="listaTitle" data-reveal><span data-odo>27</span> terminais<br>e depósitos</h2>
      <p class="lead" data-reveal>Os terminais de contêiner cheio são onde a carga é carregada no caminhão; os depósitos de vazio são onde o contêiner é retirado antes da exportação ou devolvido depois da entrega.</p>
    </div>
    ${h.termCols()}
    <p class="term-note" data-reveal>O seu terminal não está na lista? <a href="https://wa.me/${h.SITE.wa}?text=Ol%C3%A1%2C%20vim%20pelo%20site.%20Voc%C3%AAs%20atendem%20o%20terminal%20" target="_blank" rel="noopener" data-origem="terminais">Pergunte pelo WhatsApp</a>.</p>
    <p class="term-legal" data-reveal>Os nomes dos terminais pertencem aos seus titulares e indicam apenas onde operamos; não representam parceria ou vínculo comercial.</p>
  </div>
</section>

${h.cta()}
`,
});

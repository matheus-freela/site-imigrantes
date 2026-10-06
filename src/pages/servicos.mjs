// /servicos (visão geral) e /servicos/<slug> (uma página por serviço, a partir de SERVICOS em src/data.mjs)
const COMO = [
  ['Cotação', 'Você conta a carga, o terminal e o destino. Respondemos com valor e prazo.'],
  ['Retirada', 'O caminhão retira o contêiner no terminal assim que a carga é liberada.'],
  ['Estrada', 'Viagem com a frota rastreada e a documentação emitida: CT-e, MDF-e e CIOT.'],
  ['Entrega', 'Descarga no endereço combinado, no Sudeste, no Sul ou em Mato Grosso do Sul.'],
  ['Vazio devolvido', 'Devolvemos o contêiner vazio no depósito do armador e a operação fecha.'],
];
const WHY = [
  ['Carga segurada', 'Cobertura por RCTR-C e RCF-DC durante o transporte e a movimentação.'],
  ['Rastreio da frota', 'Monitoramento contínuo dos caminhões. A nossa equipe informa a posição do seu contêiner quando você precisar.'],
  ['Do lado do porto', 'Sede em Santos, perto dos terminais e recintos alfandegados. Menos tempo entre a liberação e a estrada.'],
  ['Papelada em dia', 'Emissão e controle de toda a documentação de transporte da operação: CT-e, MDF-e e CIOT.'],
  ['Operação sob medida', 'Planejamos cada viagem conforme a carga, o prazo e as exigências do seu processo.'],
  ['Cargas reguladas', 'Habilitações para transportar produtos controlados, perigosos, de saúde e em trânsito aduaneiro.'],
];

export default (h) => {
  const visao = {
    path: '/servicos', nav: 'servicos',
    title: 'Serviços — Transportes Imigrantes',
    description: 'FCL, LCL, DTA, REDEX, apoio logístico e carga projeto: transporte rodoviário de contêineres do Porto de Santos para o Sudeste, Sul e Mato Grosso do Sul.',
    body: `
${h.pageHero({
  crumbs: [['Serviços']], tag: '<b>01</b> Serviços', lines: ['Nossos', 'serviços'],
  lead: 'Seis formas de levar a sua carga do Porto de Santos até o destino, ou do seu endereço até o embarque. Cada uma com a sua documentação, o seu prazo e o seu tipo de carga.',
  media: h.pic('frota-tres-eixos', { eager: true }),
})}

<section class="sec" aria-labelledby="svcTitle">
  <div class="wrap">
    <h2 class="sr-only" id="svcTitle">Escolha o serviço</h2>
    ${h.board()}
  </div>
</section>

<section class="sec" aria-labelledby="comoTitle" style="background:var(--paper-2);">
  <div class="wrap">
    <div class="sec-head">
      <div class="tag" data-reveal><b>→</b> Como funciona</div>
      <h2 class="h-l" id="comoTitle" data-reveal>Da cotação<br>ao vazio devolvido</h2>
      <p class="lead" data-reveal>Uma importação típica em contêiner completo. Nos outros serviços as etapas mudam, mas o acompanhamento é o mesmo.</p>
    </div>
    ${h.steps(COMO, { cls: 'cols-5' })}
  </div>
</section>

<section class="sec" aria-labelledby="whyTitle">
  <div class="wrap">
    <div class="sec-head">
      <div class="tag" data-reveal><b>→</b> Diferenciais</div>
      <h2 class="h-l" id="whyTitle" data-reveal>Sua carga<br>em boas mãos</h2>
      <p class="lead" data-reveal>Seguro, rastreio e documentação em dia em todas as viagens. É o que o comércio exterior exige, e é o que entregamos.</p>
    </div>
    ${h.steps(WHY)}
  </div>
</section>

${h.cta()}
`,
  };

  const detalhes = h.SERVICOS.map((s, idx) => {
    const faqs = h.FAQ.filter((f) => f.tags.includes(s.slug === 'apoio-logistico' ? 'apoio' : s.slug === 'carga-projeto' ? 'projeto' : s.slug)).slice(0, 4);
    const outros = h.SERVICOS.filter((o) => o !== s);
    const cotar = `/contato?servico=${s.slug}#cotacao`;
    return {
      path: '/servicos/' + s.slug, nav: 'servicos',
      title: `${s.code === 'IMP·EXP' || s.code === 'PROJETO' ? s.nome : s.code + ' · ' + s.nome} — Transportes Imigrantes`,
      description: s.lead,
      body: `
${h.pageHero({
  crumbs: [['Serviços', '/servicos'], [s.nome]],
  tag: `<b>${String(idx + 1).padStart(2, '0')}</b> ${s.code === 'IMP·EXP' ? 'Importação e exportação' : s.code === 'PROJETO' ? 'Operações especiais' : s.code}`,
  lines: s.titulo, lead: s.lead,
  btns: `<div class="btn-row"><a class="btn btn-red" href="${cotar}">Cotar ${s.nome.toLowerCase()} ${h.arr()}</a><a class="btn btn-line-light" href="${h.WA_LINK}" target="_blank" rel="noopener">WhatsApp ${h.arr('↗')}</a></div>`,
  media: h.pic(s.foto, { eager: true }),
})}

<section class="sec" aria-labelledby="sobreTitle">
  <div class="wrap sd-grid">
    <div class="sd-main">
      <div class="tag" data-reveal><b>→</b> O que é</div>
      <h2 class="h-l sd-h" id="sobreTitle" data-reveal>${s.nome}</h2>
      <p class="sd-text" data-reveal>${s.sobre}</p>
    </div>
    <aside class="sd-side" data-reveal aria-label="Resumo">
      <div class="flap" data-nosnippet data-text="${s.code}" aria-hidden="true"></div>
      <h3>Indicado para</h3>
      <ul class="ticks">${s.indicado.map((i) => `<li>${i}</li>`).join('')}</ul>
      ${s.tipos ? `<h3>Contêineres</h3><ul class="chips">${s.tipos.map((t) => `<li>${t}</li>`).join('')}</ul>` : ''}
      <a class="btn btn-red" href="${cotar}">Montar cotação ${h.arr()}</a>
    </aside>
  </div>
</section>

<section class="sec" aria-labelledby="passosTitle" style="background:var(--paper-2);">
  <div class="wrap">
    <div class="sec-head">
      <div class="tag" data-reveal><b>→</b> Como funciona</div>
      <h2 class="h-l" id="passosTitle" data-reveal>Passo<br>a passo</h2>
    </div>
    ${h.steps(s.passos, { cls: 'cols-4' })}
  </div>
</section>

${faqs.length ? `<section class="sec" aria-labelledby="faqTitle">
  <div class="wrap faq-grid">
    <div class="faq-head">
      <div class="tag" data-reveal><b>→</b> Dúvidas</div>
      <h2 class="h-l" id="faqTitle" data-reveal>Perguntas<br>frequentes</h2>
      <p class="faq-more" data-reveal><a href="/duvidas">Ver todas as dúvidas</a></p>
    </div>
    ${h.faqList(faqs)}
  </div>
</section>` : ''}

<section class="sec others" aria-labelledby="outrosTitle" style="padding-top:0;">
  <div class="wrap">
    <div class="tag" id="outrosTitle" data-reveal><b>→</b> Outros serviços</div>
    <ul class="other-svc" data-reveal>${outros.map((o) => `<li><a href="/servicos/${o.slug}"><b>${o.code}</b>${o.nome}<span aria-hidden="true">→</span></a></li>`).join('')}</ul>
  </div>
</section>

${h.cta({ servico: s })}
`,
    };
  });
  return [visao, ...detalhes];
};

export default (h) => ({
  path: '/duvidas', nav: 'duvidas',
  title: 'Perguntas frequentes — Transportes Imigrantes',
  description: 'Regiões atendidas, terminais, FCL e LCL, DTA, carga perigosa, seguro, rastreio e o que informar para a cotação de transporte de contêineres.',
  head: `<script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: h.FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') } })),
}, null, 1)}
</script>`,
  body: `
${h.pageHero({
  crumbs: [['Dúvidas']], tag: '<b>05</b> Dúvidas', lines: ['Perguntas', 'frequentes'],
  lead: 'O que importadores, exportadores e despachantes mais perguntam antes de fechar o transporte.',
})}

<section class="sec" id="duvidas" aria-labelledby="faqTitle">
  <div class="wrap faq-grid">
    <div class="faq-head">
      <h2 class="h-l" id="faqTitle" data-reveal>Antes de<br>fechar</h2>
      <p class="faq-more" data-reveal>Não achou sua dúvida? <a href="https://wa.me/${h.SITE.wa}?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20tenho%20uma%20d%C3%BAvida." target="_blank" rel="noopener" data-origem="duvidas">Pergunte pelo WhatsApp</a>.</p>
    </div>
    ${h.faqList(h.FAQ)}
  </div>
</section>

${h.cta()}
`,
});

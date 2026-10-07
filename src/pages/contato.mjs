export default (h) => ({
  path: '/contato', nav: 'contato',
  title: 'Contato e cotação — Transportes Imigrantes',
  description: 'Monte a cotação de transporte de contêineres em um minuto e envie pelo WhatsApp ou por e-mail. Santos/SP, de segunda a sexta, das 8h às 18h.',
  body: `
<section class="sec on-ink contact-page" id="contato" aria-labelledby="ctTitle">
  <div class="wrap contact-grid">
    <div>
      <nav class="crumbs" aria-label="Você está em"><a href="/">Início</a><span aria-hidden="true">/</span><span aria-current="page">Contato</span></nav>
      <div class="tag" style="margin-top:22px;"><b>06</b> Contato</div>
      <h1 class="h-xl" id="ctTitle" style="margin-top:22px;">Tem carga<br>saindo do<br>porto?</h1>
      <p class="lead" style="margin-top:22px;">Monte a cotação e envie pelo WhatsApp ou por e-mail. Se preferir, fale direto com a nossa equipe pelos contatos abaixo.</p>

      <div class="contact-rows" data-reveal>
        <div class="c-row"><span class="k">WhatsApp</span><a class="v" href="https://wa.me/${h.SITE.wa}" target="_blank" rel="noopener">${h.SITE.waTel}</a></div>
        <div class="c-row"><span class="k">Telefone</span><a class="v" href="tel:${h.SITE.tel}">${h.SITE.telTxt}</a></div>
        <div class="c-row"><span class="k">E-mail</span><a class="v" href="mailto:${h.SITE.email}">${h.SITE.email}</a></div>
        <div class="c-row"><span class="k">Endereço</span><span class="v">Av. Dr. Pedro Lessa, 3076, conj. 11<span class="sub">Santos/SP · CEP 11025-016 · <a href="https://www.google.com/maps/search/?api=1&query=Av.+Dr.+Pedro+Lessa%2C+3076+-+Santos+-+SP" target="_blank" rel="noopener" style="color:var(--red-light);">ver no mapa ↗</a></span></span></div>
        <div class="c-row"><span class="k">Horário</span><span class="v">Segunda a sexta, 8h às 18h<span class="sub">Fora do horário, respondemos no próximo dia útil.</span></span></div>
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
    </div>

    <form class="quote" id="cotacao" novalidate data-reveal data-wa-hide aria-labelledby="quoteTitle">
      <div class="quote-head"><h2 id="quoteTitle">Cotação rápida</h2><span>1 minuto</span></div>
      <div class="q-grid">
        <div class="q-field q-full">
          <span class="q-lbl" id="qOpLbl">Operação</span>
          <div class="seg" role="radiogroup" aria-labelledby="qOpLbl">
            <label><input type="radio" name="operacao" value="Importação" checked>Importação</label>
            <label><input type="radio" name="operacao" value="Exportação">Exportação</label>
          </div>
        </div>
        <div class="q-field">
          <label for="qServico">Serviço</label>
          <select id="qServico" name="servico" required>
${h.SERVICOS.map((s) => `            <option value="${s.form}" data-slug="${s.slug}">${s.code === 'IMP·EXP' || s.code === 'PROJETO' ? s.nome : s.code + ' · ' + s.nome.toLowerCase()}</option>`).join('\n')}
            <option value="Não sei / outro">Não sei / outro</option>
          </select>
        </div>
        <div class="q-field">
          <label for="qConteiner">Contêiner</label>
          <select id="qConteiner" name="conteiner">
            <option value="20' Dry">20' Dry</option>
            <option value="40' Dry">40' Dry</option>
            <option value="40' High Cube">40' High Cube</option>
            <option value="Reefer (refrigerado)">Reefer (refrigerado)</option>
            <option value="Flat rack / Open top">Flat rack / Open top</option>
            <option value="Sem contêiner (carga solta ou em prancha)">Sem contêiner (carga solta ou em prancha)</option>
            <option value="Não sei">Não sei</option>
          </select>
        </div>
        <div class="q-field">
          <label for="qTerminal">Terminal <span class="opt">(opcional)</span></label>
          <input id="qTerminal" name="terminal" list="qTerminais" autocomplete="off" placeholder="Ex.: BTP">
          <datalist id="qTerminais">${[...h.TERMINAIS.cheio, ...h.TERMINAIS.vazio].map((t) => `<option value="${t}">`).join('')}</datalist>
        </div>
        <div class="q-field">
          <label for="qDestino" id="qDestinoLbl">Destino</label>
          <input id="qDestino" name="destino" required autocomplete="address-level2" placeholder="Cidade / UF">
        </div>
        <div class="q-field">
          <label for="qCarga">Mercadoria <span class="opt">(opcional)</span></label>
          <input id="qCarga" name="carga" placeholder="Ex.: peças automotivas">
        </div>
        <div class="q-field">
          <label for="qPeso">Peso em toneladas <span class="opt">(opcional)</span></label>
          <input id="qPeso" name="peso" inputmode="decimal" placeholder="Ex.: 18">
        </div>
        <!-- só na importação: o valor entra no cálculo do seguro da carga -->
        <div class="q-field q-full" id="qValorWrap">
          <label for="qValor">Valor da mercadoria <span class="opt">(para o seguro da carga)</span></label>
          <div class="q-money">
            <select id="qMoeda" name="moeda" aria-label="Moeda">
              <option value="US$">US$</option>
              <option value="R$">R$</option>
              <option value="€">€</option>
            </select>
            <input id="qValor" name="valor" inputmode="decimal" autocomplete="off" placeholder="Ex.: 85.000,00" required>
          </div>
        </div>
        <div class="q-field q-full">
          <label class="q-check"><input type="checkbox" name="imo" value="sim"> Carga perigosa (IMO)</label>
        </div>
        <div class="q-field">
          <label for="qNome">Seu nome</label>
          <input id="qNome" name="nome" required autocomplete="name">
        </div>
        <div class="q-field">
          <label for="qEmpresa">Empresa <span class="opt">(opcional)</span></label>
          <input id="qEmpresa" name="empresa" autocomplete="organization">
        </div>
      </div>
      <div class="q-actions">
        <button class="btn btn-red" type="submit" data-canal="whatsapp">Enviar pelo WhatsApp ${h.arr()}</button>
        <button class="btn btn-line-dark" type="submit" data-canal="email">Enviar por e-mail ${h.arr()}</button>
      </div>
      <p class="q-status" id="qStatus" role="status"></p>
      <p class="q-note">Nada fica salvo neste site: os dados vão só na mensagem que você envia para a nossa equipe. Atendemos de segunda a sexta, das 8h às 18h; fora desse horário, respondemos no próximo dia útil.</p>
    </form>
  </div>
</section>
`,
});

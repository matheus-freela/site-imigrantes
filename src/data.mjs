// Dados do site num lugar só: o build (tools/build.mjs) monta as páginas a partir daqui e de src/pages/.

export const SITE = {
  base: 'https://site-imigrantes-gamma.vercel.app', // TROCAR quando o domínio próprio estiver no ar
  wa: '5513978043399',
  waTxt: 'Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20solicitar%20uma%20cota%C3%A7%C3%A3o.',
  tel: '+551332197180', telTxt: '(13) 3219-7180', waTel: '(13) 97804-3399',
  email: 'administrativo@transportesimigrantes.com.br',
};
export const WA_LINK = `https://wa.me/${SITE.wa}?text=${SITE.waTxt}`;

// menu principal (a ordem vale para o cabeçalho, o menu do celular e o rodapé)
export const NAV = [
  { id: 'servicos', href: '/servicos', label: 'Serviços' },
  { id: 'terminais', href: '/terminais', label: 'Terminais' },
  { id: 'operacao', href: '/operacao', label: 'Operação' },
  { id: 'empresa', href: '/empresa', label: 'A empresa' },
  { id: 'duvidas', href: '/duvidas', label: 'Dúvidas' },
  { id: 'contato', href: '/contato', label: 'Contato' },
];

export const TERMINAIS = {
  cheio: ['BTP (Brasil Terminal Portuário)', 'Santos Brasil', 'DP World', 'Transbrasa', 'Ecoporto', 'Multilog',
    'Bandeirantes / Deicmar', 'Eudmarco', 'Localfrio T1', 'Localfrio T2', 'Marimex', 'EADI Aurora', 'Embragen'],
  vazio: ['Lechman', 'Atlantis', 'CCIS', 'Fassina', 'Depotce', 'Depotainer', 'Delta', 'Ziran', 'Mafro',
    'Personnalite', 'Medlog', 'Rasio Terminais', 'Transtec World', 'Perlog'],
};

// fotos da frota e da operação (images/fotos/<id>-800.webp e -1600.webp)
export const FOTOS = {
  'frota-conteiner': { w: 1600, h: 1200, alt: 'Cavalo mecânico da Imigrantes engatado em contêiner azul de 40 pés' },
  'frota-patio': { w: 1600, h: 1200, alt: 'Cavalo mecânico Actros e carretas no pátio, entre operações' },
  'frota-tres-eixos': { w: 1600, h: 900, alt: 'Cavalo mecânico engatado à prancha usada no transporte de carga excedente' },
  'patio-dois-caminhoes': { w: 1384, h: 1132, alt: 'Dois cavalos mecânicos engatados em contêineres no pátio' },
  'prancha-urbana': { w: 1600, h: 900, alt: 'Prancha sinalizada com placas de comprimento e largura para carga excedente' },
  'carregamento-equipe': { w: 1600, h: 1200, alt: 'Equipe acompanhando o carregamento de equipamento industrial dentro do galpão' },
  'carregamento-guindaste': { w: 1600, h: 1200, alt: 'Guindaste içando equipamento industrial sobre a prancha' },
};

// vídeos curtos do site oficial (video/<id>.mp4 + poster .webp), 720 px, sem som
export const VIDEOS = [
  { id: 'caminhao-rodovia', t: 'Em trânsito pela rodovia', d: 'Contêiner de 40 pés no trajeto entre Santos e o planalto.' },
  { id: 'tunel-serra', t: 'Subida da serra', d: 'Comboio no túnel, no trecho de serra entre Santos e o planalto.' },
  { id: 'rodovia-comboio', t: 'Rodovia', d: 'Comboio em trânsito com a Serra do Mar ao fundo.' },
  { id: 'patio-conteineres', t: 'Carga excedente', d: 'Saída de carga fora de medida em prancha estendida.' },
  { id: 'manobra-urbana', t: 'Manobra acompanhada', d: 'Carga fora de medida em via urbana, com apoio em solo.' },
];

// habilitações (logos em images/licencas/)
export const LICENCAS = [
  { id: 'anvisa', nome: 'ANVISA', org: 'Agência Nacional de Vigilância Sanitária', d: 'Produtos para saúde e correlatos; cosméticos, perfumes e produtos de higiene; domissanitários e saneantes.' },
  { id: 'exercito', nome: 'Exército Brasileiro', org: 'Certificado de Registro', d: 'Transporte de produtos controlados pelo Exército.' },
  { id: 'policia-civil', nome: 'Polícia Civil', org: 'Estado de São Paulo', d: 'Licença para o transporte de produtos químicos controlados.' },
  { id: 'imo', nome: 'IMO', org: 'International Maritime Organization', d: 'Mercadorias perigosas.' },
  { id: 'dta', nome: 'DTA', org: 'Receita Federal', d: 'Habilitação para o trânsito aduaneiro de mercadorias ainda não nacionalizadas.' },
  { id: 'ibama', nome: 'IBAMA', org: 'Instituto Brasileiro do Meio Ambiente e dos Recursos Naturais Renováveis', d: 'Transporte de produtos e cargas sujeitos ao controle ambiental.' },
  { id: 'sivisa', nome: 'SIVISA', org: 'Vigilância Sanitária do Estado de São Paulo', d: 'Alimentos e embalagens.' },
  { id: null, nome: 'CRF-SP', org: 'Conselho Regional de Farmácia de São Paulo', d: 'Certidão de Regularidade para o transporte de produtos farmacêuticos, cosméticos e correlatos.' },
];

// perguntas frequentes; "tags" escolhe em quais páginas de serviço cada uma aparece
export const FAQ = [
  { q: 'Para quais regiões vocês transportam?', a: '<p>Saímos do Porto de Santos para o Sudeste, o Sul e Mato Grosso do Sul: São Paulo, Rio de Janeiro, Minas Gerais, Espírito Santo, Paraná, Santa Catarina, Rio Grande do Sul e Mato Grosso do Sul.</p>', tags: ['fcl', 'lcl', 'dta'] },
  { q: 'Em quais terminais vocês retiram e entregam?', a: '<p>Atendemos 27 terminais e depósitos da Baixada Santista: 13 para carregamento de contêiner cheio e 14 para retirada e devolução de vazio. A lista completa está na página <a href="/terminais">Terminais</a>. Se o seu não estiver lá, pergunte.</p>', tags: ['fcl', 'redex'] },
  { q: 'Qual a diferença entre FCL e LCL?', a: '<p>No <strong>FCL</strong> o contêiner inteiro é da sua carga, com transporte dedicado do terminal ao destino. No <strong>LCL</strong> a carga é fracionada e divide o espaço com outras, então você paga só pelo que usa.</p>', tags: ['fcl', 'lcl'] },
  { q: 'O que é DTA e quando eu preciso?', a: '<p>DTA (Declaração de Trânsito Aduaneiro) é a remoção de uma mercadoria ainda não nacionalizada de um recinto alfandegado para outro, por exemplo do porto para um porto seco no interior. Somos habilitados na Receita Federal e cuidamos do transporte com a documentação em ordem e o caminhão monitorado.</p>', tags: ['dta'] },
  { q: 'Vocês transportam carga perigosa ou controlada?', a: '<p>Sim. Temos habilitação IMO para mercadorias perigosas e autorização do Exército e da Polícia Civil para cargas controladas. Também atendemos produtos regulados pela ANVISA, CRF-SP, SIVISA e IBAMA. Na cotação, marque “Carga perigosa (IMO)”.</p>', tags: ['fcl', 'lcl', 'apoio'] },
  { q: 'A carga tem seguro durante o transporte?', a: '<p>Sim, com cobertura RCTR-C e RCF-DC no transporte e na movimentação. Por isso a cotação de importação pede o valor da mercadoria.</p>', tags: ['fcl', 'lcl', 'dta', 'projeto'] },
  { q: 'Consigo saber onde está o meu contêiner?', a: '<p>Sim. A frota é monitorada continuamente durante a viagem. Fale com a nossa equipe para acompanhar a sua carga.</p>', tags: ['fcl', 'dta', 'redex'] },
  { q: 'Vocês fazem só o trecho do porto?', a: '<p>Não. Fazemos do terminal até a entrega final e ligamos porto, aeroporto e interior numa operação só. Também fazemos desova de contêiner e movimentação com empilhadeira e guindaste.</p>', tags: ['apoio', 'lcl'] },
  { q: 'Vocês transportam carga fora de medida?', a: '<p>Sim. Transportamos cargas excedentes e indivisíveis em prancha, com sinalização, planejamento de rota e as autorizações que cada operação exige. Conte as medidas e o peso na cotação.</p>', tags: ['projeto', 'apoio'] },
  { q: 'Quais documentos de transporte vocês emitem?', a: '<p>Emitimos e controlamos toda a documentação da viagem, incluindo CT-e, MDF-e e CIOT.</p>', tags: ['redex', 'dta'] },
  { q: 'O que preciso informar para receber uma cotação?', a: '<p>Operação (importação ou exportação), serviço, tipo de contêiner, terminal, destino ou local de coleta, mercadoria e, na importação, o valor da carga. A <a href="/contato#cotacao">cotação rápida</a> monta a mensagem para você em um minuto.</p>', tags: ['projeto', 'redex', 'apoio'] },
  { q: 'Qual o horário de atendimento?', a: '<p>Segunda a sexta, das 8h30 às 18h, pelo WhatsApp (13) 97804-3399, pelo telefone (13) 3219-7180 ou por e-mail.</p>', tags: [] },
];

/* serviços: a lista do painel (início e /servicos) e as páginas /servicos/<slug>.
   "form" é o valor da opção no formulário de cotação (tem que existir lá). */
export const SERVICOS = [
  {
    slug: 'fcl', code: 'FCL', nome: 'Contêiner completo', form: 'FCL – contêiner completo', foto: 'frota-conteiner',
    resumo: 'O contêiner inteiro é da sua carga. Transporte dedicado do terminal ao destino, para grandes volumes e menos manuseio.',
    titulo: ['Contêiner', 'completo'],
    lead: 'O contêiner inteiro é da sua carga. Retiramos no terminal e levamos direto ao seu endereço, com o caminhão dedicado à sua viagem.',
    sobre: 'No FCL (full container load) a carga ocupa o contêiner sozinha, do terminal até a porta. Sem dividir espaço e sem passar por armazém no caminho, a mercadoria é menos manuseada e o prazo depende só da sua operação.',
    passos: [
      ['Cotação', 'Você informa terminal, tipo de contêiner, destino e mercadoria. Confirmamos o valor e a janela de retirada.'],
      ['Retirada no terminal', 'Depois da liberação, o caminhão retira o contêiner cheio em um dos terminais da Baixada Santista.'],
      ['Viagem monitorada', 'Transporte dedicado, com a frota rastreada e a documentação emitida: CT-e, MDF-e e CIOT.'],
      ['Entrega e vazio', 'Entregamos no endereço combinado e devolvemos o contêiner vazio no depósito indicado pelo armador.'],
    ],
    indicado: ['Volumes que ocupam um contêiner de 20 ou 40 pés', 'Cargas que pedem menos manuseio', 'Prazos firmes, sem esperar consolidação', 'Importação e exportação'],
    tipos: ["20' Dry", "40' Dry", "40' High Cube", 'Reefer (refrigerado)', 'Flat rack / Open top'],
  },
  {
    slug: 'lcl', code: 'LCL', nome: 'Carga fracionada', form: 'LCL – carga fracionada', foto: 'carregamento-equipe',
    resumo: 'Para volumes menores, que dividem o contêiner com outras cargas. Você paga pelo espaço que usa.',
    titulo: ['Carga', 'fracionada'],
    lead: 'Para volumes menores, que dividem o contêiner com outras cargas. Você paga pelo espaço que usa, e nós levamos a sua parte até o destino.',
    sobre: 'No LCL (less than container load) a sua mercadoria viaja no mesmo contêiner que a de outros embarcadores. Depois que o contêiner é desovado no recinto, retiramos a sua parte e seguimos para a entrega.',
    passos: [
      ['Cotação', 'Você informa volumes, peso, medidas e destino. Com isso definimos o veículo certo para a sua carga.'],
      ['Retirada no recinto', 'Retiramos a sua parte da carga no armazém onde o contêiner foi desovado, já liberada.'],
      ['Transporte', 'Viagem com a frota rastreada e a documentação de transporte emitida.'],
      ['Entrega', 'Descarga no endereço combinado, com conferência dos volumes.'],
    ],
    indicado: ['Volumes que não enchem um contêiner', 'Remessas frequentes e menores', 'Quem quer pagar só pelo espaço usado'],
  },
  {
    slug: 'dta', code: 'DTA', nome: 'Trânsito aduaneiro', form: 'DTA – trânsito aduaneiro', foto: 'frota-patio',
    resumo: 'Remoção de mercadoria ainda não nacionalizada entre recintos alfandegados, com a documentação em ordem e rastreio no caminho.',
    titulo: ['Trânsito', 'aduaneiro'],
    lead: 'Remoção de mercadoria ainda não nacionalizada entre recintos alfandegados, como do porto para um porto seco no interior. Somos habilitados na Receita Federal.',
    sobre: 'Na DTA (Declaração de Trânsito Aduaneiro) a carga deixa o porto ainda sob controle aduaneiro e é desembaraçada no recinto de destino. O transporte só pode ser feito por transportador habilitado, com a carga lacrada e o percurso controlado.',
    passos: [
      ['Trânsito registrado', 'O seu despachante registra o trânsito aduaneiro; entramos como transportador habilitado.'],
      ['Retirada com lacre', 'O contêiner sai do terminal lacrado, acompanhado da documentação do trânsito.'],
      ['Percurso controlado', 'Trajeto e prazo definidos para a operação, com o caminhão monitorado o tempo todo.'],
      ['Chegada ao recinto', 'Entrega no recinto alfandegado de destino, onde a carga é desembaraçada.'],
    ],
    indicado: ['Desembaraço em porto seco ou EADI no interior', 'Cargas que seguem para outro recinto alfandegado', 'Importadores que precisam liberar espaço no porto'],
  },
  {
    slug: 'redex', code: 'REDEX', nome: 'Exportação via REDEX', form: 'REDEX – exportação', foto: 'patio-dois-caminhoes',
    resumo: 'Levamos a carga de exportação até recintos habilitados e damos suporte ao despacho até o embarque.',
    titulo: ['Exportação', 'via REDEX'],
    lead: 'Levamos a sua carga de exportação até o REDEX, onde é feito o despacho, e depois ao terminal de embarque no Porto de Santos.',
    sobre: 'O REDEX (Recinto Especial para Despacho Aduaneiro de Exportação) é onde a carga de exportação passa pelo despacho antes de seguir para o porto. Cuidamos do transporte em cada trecho, do vazio até o embarque.',
    passos: [
      ['Retirada do vazio', 'Retiramos o contêiner vazio no depósito indicado pelo armador.'],
      ['Coleta', 'O contêiner vai até a sua empresa para ser carregado, ou retiramos a carga para estufagem.'],
      ['REDEX', 'Entregamos no recinto habilitado, onde a carga é despachada para exportação.'],
      ['Embarque', 'Levamos o contêiner até o terminal de embarque no Porto de Santos.'],
    ],
    indicado: ['Exportadores do Sudeste, Sul e MS', 'Cargas que precisam de despacho antes do porto', 'Quem quer um só transportador em todos os trechos'],
  },
  {
    slug: 'apoio-logistico', code: 'IMP·EXP', nome: 'Apoio logístico', form: 'Apoio logístico', foto: 'carregamento-guindaste',
    resumo: 'Ligamos porto, aeroporto e interior numa operação só, da retirada no terminal à entrega na sua porta.',
    titulo: ['Apoio', 'logístico'],
    lead: 'Ligamos porto, aeroporto e interior numa operação só: retirada, desova, movimentação e entrega, com uma equipe acompanhando cada etapa.',
    sobre: 'Nem toda operação de comércio exterior cabe num trecho só. Quando a carga precisa ser desovada, movimentada ou levada entre porto, aeroporto e interior, coordenamos as etapas para você falar com um só fornecedor.',
    passos: [
      ['Planejamento', 'Entendemos a carga, os prazos e as exigências do seu processo antes de mover qualquer coisa.'],
      ['Retirada', 'Retiramos no terminal, no aeroporto ou no recinto em que a carga estiver.'],
      ['Desova e movimentação', 'Desova de contêiner e movimentação com empilhadeira e guindaste, conforme a carga.'],
      ['Entrega', 'Levamos até o destino final, com a documentação de transporte em dia.'],
    ],
    indicado: ['Importação e exportação com várias etapas', 'Cargas paletizadas ou pesadas', 'Operações entre porto, aeroporto e interior'],
  },
  {
    slug: 'carga-projeto', code: 'PROJETO', nome: 'Carga projeto', form: 'Carga projeto (fora de medida)', foto: 'prancha-urbana',
    resumo: 'Cargas fora de medida e indivisíveis, em prancha, com planejamento de rota, sinalização e apoio em solo.',
    titulo: ['Carga', 'projeto'],
    lead: 'Cargas fora de medida e indivisíveis, em prancha, com planejamento de rota, sinalização e as autorizações que cada operação exige.',
    sobre: 'Máquinas, equipamentos industriais e peças que não cabem num contêiner pedem uma operação desenhada para elas. Avaliamos medidas e peso, planejamos o trajeto e acompanhamos a carga do içamento à entrega.',
    passos: [
      ['Levantamento', 'Medidas, peso, pontos de içamento e condições de acesso na origem e no destino.'],
      ['Planejamento', 'Definição do veículo, da rota e das autorizações exigidas para a carga.'],
      ['Carregamento', 'Içamento com guindaste e amarração da carga na prancha.'],
      ['Transporte acompanhado', 'Prancha sinalizada e trajeto acompanhado, com apoio em solo nas manobras.'],
    ],
    indicado: ['Máquinas e equipamentos industriais', 'Cargas excedentes em largura, altura ou comprimento', 'Peças indivisíveis e pesadas'],
  },
];

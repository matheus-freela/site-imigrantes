/*
 * timeline.js — fonte única de tempo do explicador (quadros, grade de 120 BPM a 60 fps).
 * film.html desenha a partir destes números; sync.mjs exporta out/cues.json para a trilha.
 * Um tempo = 30 f, um compasso = 120 f. b(compasso, tempo, dezesseis avos).
 */
(function (root) {
  'use strict';
  const MOTION = root.MOTION || (typeof require === 'function' ? require('./motion.js') : null);
  if (!MOTION) throw new Error('timeline.js: carregue motion.js antes');
  const { b, E, FPS, BPM, BAR, peak, settleOf, delayTo, SPR } = MOTION;

  const TOTAL = b(17); // 16 compassos = 1920 f = 32 s (os últimos 120 f são o cartão final + cauda)

  // Atos contíguos, alinhados ao compasso.
  const ACT = {
    porto: { from: 0, dur: b(4) },              // 1–3: pilha, contador de dias, retirada
    passos: { from: b(4), dur: b(10) - b(4) },  // 4–9: terminal → porta → vazio
    prova: { from: b(10), dur: b(14) - b(10) }, // 10–11: mapa (Sudeste, Sul, MS); 12–13: 52 anos
    promessa: { from: b(14), dur: BAR },        // 14: do porto até a sua porta
    marca: { from: b(15), dur: TOTAL - b(15) }, // 15–16: logo e cauda
  };

  // ---- geometria do mundo (px) ----
  const G = {
    ground: 828, cw: 520, ch: 124, wheel: 32,
    deck: 828 - 64 - 14,                 // topo do chassi
    stackCols: [180, 720, 1260],
    rows: [704, 580, 456],               // y do topo: fileira de baixo, meio, cima
    gateX: 2000,
    house: { x: 3480, w: 1180 },         // armazém do cliente (atrás do caminhão parado)
    depotX: 6720,                        // pilha de vazios, alinhada ao caminhão parado
  };
  G.onDeck = G.deck - G.ch;              // y do contêiner sobre o chassi

  // ---- deslocamentos do caminhão e da câmera (x do canto esquerdo do chassi, câmera em px) ----
  const DRIVE = [
    { from: b(4, 1), to: b(6, 0, 2), a: 720, z: 3720 },    // terminal → porta  (≈ 25 px/f no pico)
    { from: b(7, 2, 2), to: b(9, 0), a: 3720, z: 6720 },   // porta → depósito de vazios
  ];
  const CAM_LAG = 3; // a câmera segue o caminhão com 6 quadros de atraso: ele puxa, ela alcança

  // Pausa planejada (quase parada) na promessa, sobre o breakdown, seguida do movimento grande do logo.
  const HOLD = { from: b(14, 1), to: b(15) };

  // ---- cues (todos na grade de 16 avos) ----
  const CUE = {
    leave: [b(1, 0), b(1, 2), b(2, 1), b(2, 3)], // vizinhos saem da pilha; os dois últimos junto com os dias 2 e 4
    day: [b(2, 0), b(2, 1), b(2, 2), b(2, 3)],               // DIA 1..4
    grab: b(3),                    // spreader trava no contêiner (contato)
    liftFrom: b(3, 0, 2), liftTo: b(3, 1, 2),
    truckFrom: b(3, 0, 1), truckTo: b(3, 2, 2),
    seat: b(3, 3),                 // contêiner encosta no chassi: a trava
    lowerFrom: b(3, 2, 2),
    release: b(3, 3, 1),
    barrier: b(4, 0, 2),           // cancela sobe
    step1: b(4, 1, 2),             // nó 1 do trilho
    door: b(6, 1),                 // porta do armazém sobe
    drainFrom: b(6, 2), drainTo: b(7, 0, 2),
    step2: b(7, 0, 2),             // contêiner vazio
    grab2: b(9, 1),                // spreader no vazio
    lift2From: b(9, 1, 2), stack2: b(9, 3), // pousa na pilha de vazios
    step3: b(9, 3),
    pull: b(10),                   // câmera recua — DROP (payoff)
    gridIn: b(10, 0, 2),
    grid: b(10, 2),                // grade completa
    legend: b(10, 2, 2),
    implode: b(12),                // o mapa sai, o contêiner cresce a partir de Santos
    hero: b(12, 1, 2),             // nosso contêiner grande no centro
    underline: b(12, 2),           // odômetro 1974 → 2026
    refill: b(14),
    line: b(14, 0, 2),
    lock: b(15),                   // contêiner vai até a marca
    redArrow: b(15, 1),
    grayArrow: b(15, 1, 2),
    word: b(15, 2, 2),
    phone: b(15, 3, 2),
    settle: b(16),                 // marca completa: resolução
  };

  const DUR = {
    leave: 40, day: 10, spreaderIn: 28, lift: 30, truck: 66, lower: 30, release: 30,
    barrier: 30, door: 30, wordIn: 26, wordOut: 14, pull: 60, tile: 24, implode: 18,
    hero: 48, underline: 168, refill: 30, line: 40, lock: 44, arrow: 44, word: 30,
  };

  // Texto: in = primeiro quadro, out = início da saída. hi = palavras em vermelho.
  const COPY = [
    { id: 't1', low: true, lines: ['CONTÊINER PARADO EM SANTOS.'], in: b(1, 0, 2), out: b(1, 3, 2) },
    { id: 't2', low: true, lines: ['CADA DIA CUSTA.'], in: b(2, 0, 1), out: b(2, 3, 3) },
    { id: 't3', low: true, lines: ['A IMIGRANTES RESOLVE.'], hi: ['IMIGRANTES'], in: b(3, 0, 3), out: b(3, 3, 3) },
    { id: 's1', low: true, lines: ['RETIRA NO TERMINAL.'], in: b(4, 0, 1), out: b(5, 3, 2) },
    { id: 's2', low: true, lines: ['ENTREGA NA SUA PORTA.'], in: b(6, 0, 1), out: b(7, 3, 3) },
    { id: 's3', low: true, lines: ['DEVOLVE O VAZIO.'], in: b(8, 0, 2), out: b(9, 3, 3) },
    { id: 't7', mid: true, lines: ['SUDESTE,', 'SUL E MS.'], in: b(10, 1), out: b(11, 3, 2) },
    { id: 't8', lines: ['52 ANOS.'], in: b(12, 1), out: b(13, 3, 2) },
    { id: 't9', lines: ['DO PORTO DE SANTOS', 'ATÉ A SUA PORTA.'], in: b(14, 0, 1), out: b(15), big: true },
  ];

  /** Quadro inteiro em que o contador de anos mostra 2026 pela primeira vez (é ali que a trava soa). */
  function yearLock() {
    for (let f = CUE.underline; f < CUE.underline + 200; f++) {
      const p = Math.min(1, Math.max(0, (f - CUE.underline) / DUR.underline));
      if (52 * E.smooth(p) >= 51.6) return f; // o odômetro chega a 2026 (a coluna das unidades encaixa)
    }
    return CUE.underline + DUR.underline;
  }

  /** Quadro em que o odômetro vira de 1999 para 2000 (as quatro colunas giram juntas). */
  function carry2000() {
    for (let f = CUE.underline; f < CUE.underline + DUR.underline; f++) if (1974 + 52 * E.smooth((f - CUE.underline) / DUR.underline) >= 1999.5) return f;
    return CUE.underline;
  }

  /** Eventos de som para out/cues.json — calculados das mesmas curvas da imagem. */
  function cues() {
    const ev = [];
    const add = (o) => ev.push(o);
    CUE.day.forEach((f, i) => add({ f, kind: 'tick', weight: 0.75 + i * 0.08, pan: -0.05, id: `dia${i + 1}` }));
    add({ f: CUE.grab, kind: 'snap', weight: 0.7, pan: 0, id: 'porto:spreader' });
    add({ f: peak(CUE.truckFrom, CUE.truckFrom + DUR.truck, E.glide), kind: 'whoosh', weight: 0.8, pan: -0.6, dur: DUR.truck, apexFrac: 0.4, id: 'porto:caminhao' });
    add({ f: CUE.seat, kind: 'land', weight: 1.1, pan: 0, id: 'porto:trava' });
    add({ f: CUE.seat, kind: 'snap', weight: 1.0, pan: 0.05, id: 'porto:twistlock' });
    add({ f: CUE.barrier, kind: 'click', weight: 0.8, pan: 0.3, id: 'passos:cancela' });
    add({ f: CUE.step1, kind: 'pop', weight: 1.2, pan: 0.5, id: 'step1' });
    DRIVE.forEach((d, i) => add({ f: peak(d.from, d.to, E.smooth), kind: 'whoosh', weight: 1.1, pan: 0.6, dur: d.to - d.from, apexFrac: 0.5, id: `passos:estrada${i + 1}` }));
    add({ f: settleOf(CUE.door, CUE.door + DUR.door, E.out), kind: 'tick', variant: 'crisp', weight: 0.7, pan: 0.1, id: 'passos:porta' });
    add({ f: CUE.step2, kind: 'pop', weight: 1.2, pan: 0.5, id: 'step2' });
    add({ f: CUE.grab2, kind: 'snap', weight: 0.7, pan: 0, id: 'passos:spreader2' });
    add({ f: CUE.stack2, kind: 'land', weight: 0.9, pan: 0.1, id: 'passos:pilha' });
    add({ f: CUE.step3, kind: 'pop', weight: 1.2, pan: 0.5, id: 'step3' });
    add({ f: CUE.pull, kind: 'drop', weight: 1.2, pan: 0, id: 'prova:drop' });
    for (let i = 0; i < 9; i++) add({ f: ROUTE.start + i * ROUTE.step + ROUTE.dur - 4, kind: 'pop', weight: i < 3 ? 1.6 : 1.0, pan: 0.2 + i * 0.05, id: `prova:rota${i + 1}` }); // cada destino acende
    add({ f: peak(CUE.implode, CUE.implode + DUR.hero, E.inOut), kind: 'whoosh', weight: 1.1, pan: 0, dur: DUR.hero, apexFrac: 0.5, id: 'prova:hero' });
    add({ f: carry2000(), kind: 'tick', variant: 'crisp', weight: 1.0, pan: 0, id: 'prova:2000' }); // a virada do milênio no odômetro
    add({ f: yearLock(), kind: 'tick', variant: 'crisp', weight: 1.3, pan: 0, id: 'prova:2026' }); // contador trava no ano atual
    add({ f: peak(CUE.lock, CUE.lock + DUR.lock, E.inOut), kind: 'whoosh', weight: 1.4, pan: 0.2, dur: DUR.lock, apexFrac: 0.5, id: 'marca:encaixe' });
    add({ f: CUE.settle, kind: 'bell', variant: 'motif', weight: 0.9, pan: 0, id: 'marca:logo' });
    ev.sort((p, q) => p.f - q.f);
    return { fps: FPS, bpm: BPM, total: TOTAL, acts: ACT, cue: Object.fromEntries(Object.entries(CUE).filter(([, v]) => typeof v === 'number')), events: ev };
  }

  const ROUTE = { start: b(10, 0, 3), step: 12, dur: 44, n: 9 }; // 9 rotas, da mais curta à mais longa

  const FILM = { FPS, BPM, TOTAL, ACT, G, DRIVE, CAM_LAG, HOLD, ROUTE, yearLock, CUE, DUR, COPY, cues };
  root.FILM = FILM;
  if (typeof module === 'object' && module.exports) module.exports = FILM;
})(typeof window !== 'undefined' ? window : globalThis);

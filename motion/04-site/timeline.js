/*
 * timeline.js — vinheta do site (28 s, 120 BPM, 60 fps). Um compasso = 120 f.
 * O site real (capturas em assets/cap/) rola dentro de uma janela de navegador; depois um celular
 * mostra a cotação; fecha no logo com o endereço.
 */
(function (root) {
  'use strict';
  const MOTION = root.MOTION || (typeof require === 'function' ? require('./motion.js') : null);
  const { b, E, FPS, BPM, BAR, peak, settleOf } = MOTION;

  const TOTAL = b(15); // 1680 f = 28 s
  const ACT = { desktop: { from: 0, dur: b(11) }, celular: { from: b(11), dur: b(13) - b(11) }, marca: { from: b(13), dur: TOTAL - b(13) } };

  // rolagens do navegador: posição (px CSS da página) e quadro em que chegam (na batida)
  const K = 0.82; // escala do site dentro da janela (1440 → 1181 px)
  const SCROLL = [
    { id: 'servicos', at: b(3) }, { id: 'terminais', at: b(5) }, { id: 'cobertura', at: b(7) }, { id: 'historia', at: b(9) },
  ];
  const SCROLL_DUR = 60;

  const CUE = {
    rise: 0, swap: b(11), phone: b(11, 0, 2), phoneScroll: b(12) - 36, phoneScrollTo: b(12) + 24,
    exit: b(13), red: b(13, 0, 2), gray: b(13, 1), word: b(13, 2), url: b(13, 3), settle: b(14),
  };
  const DUR = { rise: 60, swapOut: 40, phoneIn: 56, wordIn: 26, wordOut: 14, arrow: 46, word: 30 };

  const COPY = [
    { id: 'c1', lines: ['O NOVO SITE', 'DA IMIGRANTES.'], in: 14, out: b(3) - 36 },
    { id: 'c2', lines: ['SERVIÇOS', 'EM UM OLHAR.'], in: b(3) - 6, out: b(5) - 36 },
    { id: 'c3', lines: ['TERMINAIS DE', 'CHEIO E VAZIO.'], in: b(5) - 6, out: b(7) - 36 },
    { id: 'c4', lines: ['SUDESTE,', 'SUL E MS.'], in: b(7) - 6, out: b(9) - 36 },
    { id: 'c5', lines: ['52 ANOS', 'DE ESTRADA.'], in: b(9) - 6, out: b(11) - 30 },
    { id: 'c6', lines: ['NO CELULAR', 'TAMBÉM.'], in: b(11, 0, 3), out: b(12) - 36 },
    { id: 'c7', lines: ['COTAÇÃO EM', '1 MINUTO.'], in: b(12) - 6, out: b(12, 3, 3) },
  ];

  function cues() {
    const ev = [
      { f: peak(0, DUR.rise, E.out), kind: 'whoosh', weight: 0.8, pan: 0, dur: DUR.rise, apexFrac: 0.2, id: 'janela' },
      ...SCROLL.map((s, i) => ({ f: settleOf(s.at - 36, s.at + 24, E.smooth), kind: 'land', variant: 'light', weight: 1.5, pan: 0.3, id: `rola${i + 1}` })),
      { f: peak(CUE.swap - 10, CUE.swap + DUR.swapOut, MOTION.bez(0.55, 0.055, 0.675, 0.19)), kind: 'whoosh', weight: 1.5, pan: -0.5, dur: DUR.swapOut, apexFrac: 0.7, id: 'troca' },
      { f: settleOf(CUE.phone, CUE.phone + DUR.phoneIn, E.glide), kind: 'land', weight: 1.3, pan: 0.3, id: 'celular' },
      { f: settleOf(CUE.phoneScroll, CUE.phoneScrollTo, E.smooth), kind: 'land', variant: 'light', weight: 1.5, pan: 0.3, id: 'cotacao' },
      { f: CUE.settle, kind: 'bell', variant: 'motif', weight: 1.0, pan: 0, id: 'logo' },
    ].sort((p, q) => p.f - q.f);
    return { fps: FPS, bpm: BPM, total: TOTAL, acts: ACT, cue: CUE, events: ev };
  }

  const FILM = { FPS, BPM, TOTAL, ACT, K, SCROLL, SCROLL_DUR, CUE, DUR, COPY, cues };
  root.FILM = FILM;
  if (typeof module === 'object' && module.exports) module.exports = FILM;
})(typeof window !== 'undefined' ? window : globalThis);

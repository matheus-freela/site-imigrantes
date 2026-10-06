/*
 * timeline.js — vinheta do logo (6 s, 120 BPM, 60 fps). Um compasso = 120 f.
 * Gesto: o contêiner cinza chega, o vermelho desce e trava em cima (o encaixe do item 1),
 * e os dois viram as duas setas da marca.
 */
(function (root) {
  'use strict';
  const MOTION = root.MOTION || (typeof require === 'function' ? require('./motion.js') : null);
  const { b, E, FPS, BPM, peak, settleOf } = MOTION;

  const TOTAL = b(4); // 360 f = 6 s
  const ACT = { encaixe: { from: 0, dur: b(2) }, marca: { from: b(2), dur: TOTAL - b(2) } };

  const CUE = {
    slideTo: b(1, 1, 2),     // cinza chega (fim do deslize)
    seat: b(1, 2),           // vermelho trava em cima: o encaixe
    release: b(1, 2, 2),
    morph: b(2),             // os dois contêineres viram setas
    gray: b(2, 0, 3),
    red: b(2, 1, 1),
    word: b(2, 2, 2),
    since: b(2, 3, 2),
    settle: b(3),            // marca completa: o toque final
  };
  const DUR = { slide: 52, lower: 30, release: 30, morph: 44, arrow: 46, word: 30 };

  function cues() {
    const ev = [
      { f: settleOf(0, DUR.slide, E.out), kind: 'land', variant: 'light', weight: 0.7, pan: -0.2, id: 'cinza' },
      { f: CUE.seat, kind: 'snap', weight: 1.1, pan: 0, id: 'trava' },
      { f: CUE.seat, kind: 'land', weight: 0.9, pan: 0, id: 'trava-peso' },
      { f: peak(CUE.morph, CUE.morph + DUR.morph, E.inOut), kind: 'whoosh', weight: 1.0, pan: 0.2, dur: DUR.morph, apexFrac: 0.5, id: 'vira-seta' },
      { f: CUE.settle, kind: 'bell', variant: 'motif', weight: 1.0, pan: 0, id: 'logo' },
    ].sort((p, q) => p.f - q.f);
    return { fps: FPS, bpm: BPM, total: TOTAL, acts: ACT, cue: CUE, events: ev };
  }

  const FILM = { FPS, BPM, TOTAL, ACT, CUE, DUR, cues };
  root.FILM = FILM;
  if (typeof module === 'object' && module.exports) module.exports = FILM;
})(typeof window !== 'undefined' ? window : globalThis);

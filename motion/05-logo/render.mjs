// render.mjs — renderiza o filme HTML quadro a quadro pelo Chrome (DevTools Protocol), sem dependências.
//
//   node render.mjs frames  [--from 0] [--to TOTAL] [--sub 1] [--out out/frames] [--page film.html]
//   node render.mjs stills  --at 0,120,300 [--out out/stills] [--page film.html]
//
// A página precisa expor window.FILM_READY (Promise) e window.seek(f) (f em quadros, fracionário ok).
// --sub N grava N subquadros por quadro (obturador de 180°) para o desfoque de movimento no ffmpeg.
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const mode = args[0];
const opt = (k, d) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : d; };
const page = resolve(opt('--page', 'sting.html'));
const out = resolve(opt('--out', mode === 'stills' ? 'out/stills' : 'out/frames'));
const sub = Math.max(1, +opt('--sub', 1));
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);
if (!CHROME) throw new Error('Chrome não encontrado');
mkdirSync(out, { recursive: true });

const port = 9300 + Math.floor(Math.random() * 500);
const profile = resolve('out/.chrome-profile');
const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
  '--hide-scrollbars', '--mute-audio', '--force-color-profile=srgb', '--disable-gpu-vsync',
  '--allow-file-access-from-files', '--window-size=1920,1080', 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 100 && !target; i++) {
  await sleep(100);
  try {
    const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    target = list.find((t) => t.type === 'page');
  } catch {}
}
if (!target) { chrome.kill(); throw new Error('sem conexão com o Chrome'); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map();
ws.addEventListener('message', (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { const { ok, ko } = pending.get(m.id); pending.delete(m.id); m.error ? ko(new Error(m.error.message)) : ok(m.result); }
});
const send = (method, params = {}) => new Promise((ok, ko) => { const i = ++id; pending.set(i, { ok, ko }); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};

try {
  await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await send('Page.enable');
  await send('Page.navigate', { url: pathToFileURL(page).href + '?render' });
  for (let i = 0; i < 100; i++) { await sleep(100); if (await evaluate('!!window.FILM_READY').catch(() => false)) break; }
  const total = await evaluate('window.FILM_READY.then(() => window.FILM.TOTAL)');
  const shot = async (f, file) => {
    await evaluate(`window.seek(${f}); new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))`);
    const { data } = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1920, height: 1080, scale: 1 }, captureBeyondViewport: false });
    writeFileSync(file, Buffer.from(data, 'base64'));
  };
  if (mode === 'stills') {
    for (const f of opt('--at', '0').split(',').map(Number)) await shot(f, join(out, `f${String(f).padStart(5, '0')}.png`));
    console.log(`stills -> ${out}`);
  } else {
    const from = +opt('--from', 0), to = +opt('--to', total);
    const t0 = Date.now(); let n = 0;
    for (let f = from; f < to; f++) {
      for (let k = 0; k < sub; k++) {
        // 180° shutter: sub-samples spread over half a frame, centred on f
        const off = sub === 1 ? 0 : ((k + 0.5) / sub - 0.5) * 0.5;
        await shot(f + off, join(out, `${String(n++).padStart(6, '0')}.png`));
      }
      if (f % 120 === 0) console.log(`frame ${f}/${to}  ${((Date.now() - t0) / 1000).toFixed(0)} s`);
    }
    console.log(`${n} images (${sub}/frame) -> ${out}  in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
} finally {
  ws.close(); chrome.kill();
}

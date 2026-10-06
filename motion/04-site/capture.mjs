// capture.mjs — fotografa o site inteiro (desktop e celular) e anota onde começa cada seção.
//   node capture.mjs [url]   (padrão: o servidor local http://localhost:5510/)
// Saída: assets/cap/desktop.png, assets/cap/mobile.png, assets/cap/sections.js
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const URL = process.argv[2] || 'http://localhost:5510/';
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
const IDS = ['topo', 'servicos', 'terminais', 'cobertura', 'historia', 'diferenciais', 'operacao', 'duvidas', 'contato', 'cotacao'];
mkdirSync('assets/cap', { recursive: true });
const port = 9800 + Math.floor(Math.random() * 100);
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${resolve('out/.chrome-cap')}`, '--hide-scrollbars', '--force-color-profile=srgb', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 100 && !target; i++) { await sleep(100); try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page'); } catch {} }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pend = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.ko(new Error(m.error.message)) : p.ok(m.result); } });
const send = (method, params = {}) => new Promise((ok, ko) => { const i = ++id; pend.set(i, { ok, ko }); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result.value;

const out = {};
try {
  for (const [name, w, h, mobile, dpr] of [['desktop', 1440, 900, false, 1], ['mobile', 390, 844, true, 2]]) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile });
    // movimento reduzido: tudo que aparece ao rolar já fica visível na foto
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await send('Page.enable');
    await send('Page.navigate', { url: URL });
    await sleep(2500);
    // rola até o fim para disparar imagens preguiçosas e revelações, depois volta ao topo
    await ev(`(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}scrollTo(0,0);await new Promise(r=>setTimeout(r,800));document.querySelectorAll('[data-reveal]').forEach(e=>e.classList.add('in','is-in','revealed'));return 1})()`);
    await sleep(800);
    const info = await ev(`({H: document.documentElement.scrollHeight, s: Object.fromEntries(${JSON.stringify(IDS)}.map(i=>{const e=document.getElementById(i);return [i, e? Math.round(e.getBoundingClientRect().top + scrollY):null]}))})`);
    // cabeçalho fixo: esconde na foto (o filme desenha a janela do navegador por cima)
    await ev(`(()=>{const h=document.getElementById('siteHead'); if(h) h.style.position='absolute'; const w=document.getElementById('waFloat'); if(w) w.style.display='none'; return 1})()`);
    // celular: só o trecho de Contato/cotação (a página inteira em 2x passa do limite de textura do Chrome)
    const y0 = mobile ? info.s.contato - 60 : 0, hh = mobile ? Math.min(info.H - y0, 2600) : info.H;
    const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: y0, width: w, height: hh, scale: 1 } });
    info.y0 = y0;
    writeFileSync(`assets/cap/${name}.png`, Buffer.from(data, 'base64'));
    out[name] = { w, h, dpr, H: info.H, s: info.s, y0: info.y0 };
    console.log(name, info.H, JSON.stringify(info.s));
  }
  writeFileSync('assets/cap/sections.js', '// gerado por capture.mjs\nwindow.CAP = ' + JSON.stringify(out, null, 1) + ';\n');
} finally { ws.close(); chrome.kill(); }

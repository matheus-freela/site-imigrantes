// shoot.mjs — capturas do site local num Chrome headless (sem a pausa do painel).
//   node shoot.mjs <seletor> <ms1,ms2,...> <saida-prefixo> [largura] [reduce]
// Rola até o seletor, e tira uma captura em cada instante (ms depois de rolar).
import { spawn } from 'node:child_process';
import { writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const [sel = 'body', times = '0', prefix = 'out/qa/shot', width = '1440', reduce] = process.argv.slice(2);
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe'].find(existsSync);
const port = 9900 + Math.floor(Math.random() * 90);
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${resolve('out/.chrome-shoot')}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target; for (let i = 0; i < 100 && !target; i++) { await sleep(100); try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page'); } catch {} }
const ws = new WebSocket(target.webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pend = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.ko(new Error(m.error.message)) : p.ok(m.result); } });
const send = (method, params = {}) => new Promise((ok, ko) => { const i = ++id; pend.set(i, { ok, ko }); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result.value;
try {
  const w = +width, mobile = w < 600;
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: mobile ? 844 : 900, deviceScaleFactor: 1, mobile });
  if (reduce) await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await send('Page.enable'); await send('Page.navigate', { url: 'http://localhost:5510/' }); await sleep(1200);
  const errs = [];
  await send('Runtime.enable');
  ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.method === 'Runtime.exceptionThrown') errs.push(m.params.exceptionDetails.exception?.description); });
  if (sel !== 'body') await ev(`(()=>{document.documentElement.style.scrollBehavior='auto';const e=document.querySelector(${JSON.stringify(sel)});scrollTo(0,e.getBoundingClientRect().top+scrollY-250);return 1})()`);
  let t = 0;
  for (const ms of times.split(',').map(Number)) {
    await sleep(ms - t); t = ms;
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(`${prefix}-${ms}.png`, Buffer.from(data, 'base64'));
  }
  console.log('ok', errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros');
} finally { ws.close(); chrome.kill(); }

// Servidor local que imita a Vercel: URLs limpas (/terminais → terminais.html), 404.html e os
// cabeçalhos do vercel.json (inclusive a CSP, para pegar violações antes de publicar).
// uso: node tools/serve.mjs [porta]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = +process.argv[2] || 5510;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2',
  '.mp4': 'video/mp4', '.xml': 'application/xml', '.txt': 'text/plain', '.ico': 'image/x-icon' };
const vercel = JSON.parse(await readFile(join(ROOT, 'vercel.json'), 'utf8'));
const isFile = async (p) => { try { return (await stat(p)).isFile(); } catch { return false; } };

createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (url.includes('..')) { res.writeHead(400).end(); return; }
  let file = null;
  for (const c of url === '/' ? ['index.html'] : [url, url + '.html', join(url, 'index.html')]) {
    if (await isFile(join(ROOT, c))) { file = join(ROOT, c); break; }
  }
  const status = file ? 200 : 404;
  file = file || join(ROOT, '404.html');
  const headers = { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' };
  for (const rule of vercel.headers || []) {
    if (new RegExp('^' + rule.source.replace(/\(\.\*\)/g, '.*') + '$').test(url)) {
      for (const h of rule.headers) if (!/Strict-Transport|Cache-Control/.test(h.key)) headers[h.key] = h.value.replace(/; upgrade-insecure-requests/, '');
    }
  }
  const body = await readFile(file);
  // vídeos: o navegador pede por partes (Range)
  const range = req.headers.range && /bytes=(\d+)-(\d*)/.exec(req.headers.range);
  if (range && status === 200) {
    const a = +range[1], z = range[2] ? +range[2] : body.length - 1;
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${a}-${z}/${body.length}`, 'Accept-Ranges': 'bytes', 'Content-Length': z - a + 1 });
    res.end(body.subarray(a, z + 1)); return;
  }
  res.writeHead(status, { ...headers, 'Accept-Ranges': 'bytes' });
  res.end(body);
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));

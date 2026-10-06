# 04 — Vinheta do site (28 s)

O site real rolando dentro de uma janela de navegador (Início → Serviços → Terminais → Cobertura →
História), depois o celular com a cotação, e fecha no logo com o endereço do site.
Grade: 120 BPM, 60 fps, 14 compassos.

| Arquivo | O que é |
|---|---|
| `capture.mjs` | fotografa o site (desktop inteiro + trecho de Contato no celular) em `assets/cap/` |
| `film.html` | o filme (abra no navegador e clique para tocar) |
| `timeline.js` | tempos, legendas e sons |
| `out/film.mp4` | **vídeo final** |

## Refazer depois de mudar o site
```bash
node capture.mjs                     # com o servidor local do site rodando (porta 5510)
python -c "from PIL import Image; Image.open('assets/cap/desktop.png').crop((0,0,1440,5200)).save('assets/cap/desktop-crop.png')"
node sync.mjs
bash build.sh master
```
O endereço mostrado (`site-imigrantes-gamma.vercel.app`) está em `film.html` (barra do navegador e
cartão final): troque quando o domínio próprio estiver no ar.

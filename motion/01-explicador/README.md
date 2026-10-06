# 01 — Explicador Transportes Imigrantes (28 s)

**Ideia:** a Imigrantes cuida do contêiner ida e volta.
**Device:** o contêiner vermelho 40' HC — preso na pilha, retirado, esvazia na porta, volta à
pilha de vazios, vira o ponto de Santos no mapa (Sudeste, Sul e MS), mostra 1974 → 2026 num odômetro
em estêncil e termina virando a seta do logo.
**Grade:** 120 BPM, 60 fps, 14 compassos (1 compasso = 2 s). Roteiro completo em `TREATMENT.md`.

## Arquivos
| Arquivo | O que é |
|---|---|
| `film.html` | o filme. Abra no navegador: clique/espaço toca, ←/→ pula 1 s, 0 volta ao início |
| `timeline.js` | todos os tempos (fonte única para imagem e som) |
| `motion.js` | curvas, molas e utilitários (kit da skill cinetic) |
| `assets/mark.svg`, `assets/mark.js` | logo vetorizado a partir de `images/logo.png` |
| `score.json` | trilha: tom, acordes, seções |
| `render.mjs`, `build.sh`, `sync.mjs` | render pelo Chrome, codificação e exportação das marcações de som |
| `out/film.mp4` | **vídeo final** (1920×1080, 60 fps, com som, desfoque de movimento) |
| `out/preview.mp4` | prévia sem desfoque |
| `out/soundtrack.wav` | trilha sintetizada (−14 LUFS) |

## Como refazer
```bash
node sync.mjs                         # marcações de som a partir da timeline
python ~/.claude/skills/cinetic/scripts/audio/score.py --cues out/cues.json --score score.json --out out/soundtrack.wav
bash build.sh preview                 # ~4 min
bash build.sh master                  # ~14 min (4 subquadros por quadro)
```
`out/` fica fora do Git; `motion/` inteira fica fora do deploy da Vercel.

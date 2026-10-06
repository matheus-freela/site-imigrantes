# BRIEF — Explicador Transportes Imigrantes (item 1)

**Spec:** `1920x1080@60, 28s, 120BPM, audio: synthesized`
**Formato:** explicador / filme de produto (regras de launch film para contagem de palavras e arco)
**Motor:** HTML puro + SVG, cada quadro é função pura de `seek(f)` (sem GSAP, sem CSS transitions).
Render pelo Chrome instalado via DevTools Protocol (`render.mjs`), desfoque de movimento por subquadros
no ffmpeg. Segue as regras HyperFrames do cinetic (determinístico, fromTo implícito, fontes locais).

**Produto:** Transportes Rodoviários Imigrantes — transporte rodoviário de contêineres a partir do
Porto de Santos desde 1974. Retira o contêiner cheio no terminal, entrega na porta do cliente e
devolve o vazio. 27 terminais atendidos (13 de cheio, 14 de vazio).
**Público e uso:** importadores/exportadores; topo do site, LinkedIn/Instagram, apresentação ao dono.

**Pedido original (item 1):** 30 s, 5 cenas — problema do cliente, o que fazemos, como funciona em
3 passos, prova (52 anos, 27 terminais), marca no fim com WhatsApp. Texto forte, transições suaves e
desaceleradas, cores e fontes do site.

**Suposições:**
- 28 s (14 compassos a 120 BPM) em vez de 30: o cartão final não pode ficar parado > 2,5 s.
- Prova usa só dados do site: área atendida (Sudeste, Sul e MS) e 1974 → 2026 (52 anos). Destinos do mapa sem nome (o site diz que são ilustrativos).
- A marca é a do site (`images/logo.png`), vetorizada em `assets/mark.svg`. O PNG original já vem
  cortado embaixo (seta cinza reta na base) — mantido como está no site.
- Área atendida nunca aparece como "Brasil inteiro".

## Hard bans (contrato da revisão)
- Palavras: sem rótulos/eyebrows acima do título, sem "Apresentamos…", sem taglines empilhadas,
  sem texto decorativo, sem métricas falsas.
- Tipo: sem serifa, sem itálico.
- Cor: sem laranja/âmbar/bege/creme como acento, sem neon/brilho/halo, sem roxo/violeta/índigo,
  sem degradê multicor, sem glassmorphism.
- Decoração: sem emoji, ícones de banco, partículas, confete, lens flare; sem quique fora de pouso.

## Exceções da marca (brand-supplied)
- **Big Shoulders** (display condensada, maiúsculas): fonte de títulos do site.
- **Papel #F3F2EF** (off-white levemente quente): fundo do site.
- **Amarelo hazard #F2B705**: só nas listras da cancela do terminal, como no site.
- **Cinza da marca #8D8D8D** na seta cinza do logo.

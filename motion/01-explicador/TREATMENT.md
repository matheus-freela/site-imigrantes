# TREATMENT: O contêiner vermelho

**Spec:** `1920x1080@60, 28s, 120BPM, audio: synthesized` · **Formato:** explicador · **Motor:** HTML/SVG puro
**Produto:** transporte rodoviário de contêineres do Porto de Santos até a porta do cliente, ida e volta.
**Viewer:** importador/exportador; site, LinkedIn, apresentação.

## 1. Inventário
| Lista | Itens |
|---|---|
| Nome | "Imigrantes": quem chega pelo porto; a Rodovia dos Imigrantes liga Santos a SP. O logo é um ciclo (duas setas em volta). |
| Comportamento não óbvio | Diferente de "um caminhão que leva carga", ela fecha o ciclo do contêiner: retira cheio no terminal, entrega, e devolve o vazio em outro terminal (13 de cheio, 14 de vazio). |
| Valor | Antes: contêiner parado no porto, custando por dia. Depois: chega na porta e o vazio volta sozinho. |
| Objetos do produto | contêiner 40', código 40' HC (o site usa; contém 1974), chassi, cancela de terminal, spreader, porta do armazém, pilha de vazios. |
| Clichês proibidos aqui | mapa do Brasil inteiro com pins, aperto de mão, globo girando, caminhão em estrada ao pôr do sol, "logística inteligente". |
| Som do mundo | trava twistlock (clique metálico), motor, cancela, apito de ré. |

## 2. Três conceitos
| Lente | Logline | Device | Especificidade |
|---|---|---|---|
| (a) verbo literal: "retirar" | Um contêiner preso na pilha é retirado e levado até a porta. | o contêiner | médio: qualquer transportadora |
| (b) dor visível | Os vizinhos saem da pilha, o seu fica; o contador de dias sobe. | contador de dias | só o gancho |
| (c) forma: o ciclo | O mesmo contêiner faz a volta completa: cheio → porta → vazio → vira o logo (as setas do ciclo). | o contêiner vermelho, cheio e depois vazio | alto: mostra a devolução do vazio, que um "frete simples" não faz |

**Escolhido:** (c), com o gancho de (b) (vizinhos saindo + contador de dias) no compasso 1–2.

## 3. Conceito
- **Ideia:** a Imigrantes cuida do contêiner ida e volta.
- **Device:** o contêiner vermelho 40' HC. Está em todo plano: preso na pilha → no chassi → esvazia na porta (vira contorno) → volta à pilha de vazios → é um dos 27 terminais → mostra 1974 no código → anda sob a promessa → vira a seta vermelha do logo.
- **Gramática:** vista lateral, chapada, sem perspectiva; o mundo rola para a direita; o vermelho é sempre "o seu contêiner".
- **Logline:** O contêiner vermelho sai da pilha, chega à porta e volta vazio.
- **Personalidade:** sólida, pontual, portuária → Big Shoulders 900 maiúsculas (marca) + IBM Plex Sans 500 + Plex Mono 600 para código/números; palco claro (papel), tinta #101215; movimento firme, sem quique.
- **Acento:** #BE0205 (vermelho do logo) = "o seu contêiner / Imigrantes".
- **Movimento-assinatura:** encaixe vertical com trava (spreader desce, trava, sobe) — abertura (retirada), meio (devolução do vazio), fecho (o contêiner encaixa no logo).
- **Easings:** `contact` (descidas que travam), `glide`/`smooth` (caminhão), `cam` (câmera), `out` (texto).
- **Assinatura sonora:** a trava twistlock (snap metálico) afinada na tônica.
- **Som:** linha "Raw, mechanical" + "Fast, exact, confident": ticks, travas, kick firme; drop com sub no payoff (27 terminais); fecho resolvido e mais baixo.

## 3b. Técnicas sorteadas
`<!-- pick.py --seed 2904476225 --format feature --energy medium --seconds 30 -->`

| Pick | Beat | Adaptação |
|---|---|---|
| oh-quiet-intro-drop | 1–3 | intro esparsa (pilha, contador) e o groove entra quando o caminhão encaixa |
| pd-device-rise-on-cut | 3 | o caminhão entra já em movimento sob o contêiner suspenso |
| tr-motion-masked-swap | 4–9 | as trocas de estação acontecem enquanto o caminhão anda (o movimento esconde a troca) |
| ui-container-morph | 6, 13 | o contêiner muda de papel: cheio → vazio (contorno); depois vira a seta do logo |
| cl-accent-on-newest | 4–9 | o nó mais recente do trilho de passos acende em vermelho |
| cam-pull-lands-event | 10 | a câmera recua da pilha de vazios e pousa na grade dos 27 terminais |
| ui-card-grid-arrival | 10 | os 26 outros terminais chegam em volta do nosso, em ordem de coluna |
| dn-hero-bar-pullback | 11 | close no código, "1974" sublinhado, depois recua |
| lc-gap-open-insert | 12 | a promessa abre espaço e o contêiner passa por baixo da linha |
| le-bookend-replay | 13 | o encaixe da abertura (desce e trava) se repete no logo |

**Drops:** `mi-cursor-glyph-context` — não há interface nem cursor neste filme. `ty-line-rebreak-glide` — linhas curtas (≤ 5 palavras) não precisam quebrar de novo.

## 4. Arco
gancho 1–2 → virada 3 → prova (3 passos) 4–9 → prova (27 terminais, 1974) 10–11 → promessa 12 → marca 13–14 (inclui cauda).

## 5. Beat sheet
| Compasso | Tempo | Imagem | Texto | Som |
|---|---|---|---|---|
| 1 | 0–2 s | pilha de contêineres escuros; os vizinhos sobem e saem, o vermelho fica | CONTÊINER PARADO EM SANTOS. | drone, intro |
| 2 | 2–4 s | etiqueta DIA 1→4 no contêiner, pulsa a cada tempo; câmera aproxima | CADA DIA CUSTA. | tick por dia |
| 3 | 4–6 s | spreader desce e trava; caminhão entra; contêiner desce no chassi | A IMIGRANTES RESOLVE. | snap, land, trava |
| 4–5 | 6–10 s | cancela sobe, caminhão sai do terminal; trilho 1/3 | RETIRA NO TERMINAL. | click, whoosh, pop (passo 1) |
| 6–7 | 10–14 s | porta do armazém sobe; o contêiner esvazia (vira contorno); trilho 2/3 | ENTREGA NA SUA PORTA. | pop (passo 2) |
| 8–9 | 14–18 s | estrada até o depósito de vazios; spreader leva o vazio para a pilha; trilho 3/3 | DEVOLVE O VAZIO. | snap, land, pop (passo 3) |
| 10 | 18–20 s | câmera recua; o caminhão vira o ponto de Santos no mapa; 9 rotas se desenham (Sudeste, Sul, MS) | SUDESTE, / SUL E MS. | DROP (payoff), um plim por destino |
| 11 | 20–22 s | o contêiner cresce a partir de Santos; odômetro em estêncil na lateral roda 1974 → 2026 | 52 ANOS. | whoosh, tique na trava |
| 12 | 22–24 s | o contêiner se enche de novo e passa sob a promessa | DO PORTO DE SANTOS / ATÉ A SUA PORTA. | breakdown |
| 13 | 24–26 s | o contêiner encaixa e vira a seta vermelha; seta cinza; nome | TRANSPORTES IMIGRANTES / WhatsApp | resolve, sino |
| 14 | 26–28 s | marca parada com leve aproximação | | cauda |

## 6. Texto (33 palavras)
CONTÊINER PARADO EM SANTOS. · CADA DIA CUSTA. · A IMIGRANTES RESOLVE. · RETIRA NO TERMINAL. ·
ENTREGA NA SUA PORTA. · DEVOLVE O VAZIO. · SUDESTE, SUL E MS. · 52 ANOS. ·
DO PORTO DE SANTOS / ATÉ A SUA PORTA. · Transportes Imigrantes · (13) 97804-3399

Dentro do limite de 35.

## 7. Quadro final
Marca (setas) + TRANSPORTES / IMIGRANTES como no cabeçalho do site + "WhatsApp (13) 97804-3399".

## 8. Testes
- Deleção: sem os passos, "parado → resolve → 27 terminais → até a sua porta" ainda vende. Sem o valor, sobra um tour de caminhão. ✔
- Especificidade: um frete simples não mostra a devolução do vazio nem a separação cheio/vazio dos terminais. ✔
- Mudo: contêiner preso → contador → retirado → esvazia → volta → logo. Lê sem som. ✔

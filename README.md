# Transportes Imigrantes — site institucional

Site da Transportes Rodoviários Imigrantes (Santos/SP), publicado na Vercel:
https://site-imigrantes-gamma.vercel.app

HTML, CSS e JavaScript puros. As páginas são **geradas** por um script Node sem dependências
(`node tools/build.mjs`) e o HTML gerado fica na raiz, que é o que a Vercel publica. Todo envio
para a branch `main` vai para produção.

## Páginas

`/` início · `/servicos` e `/servicos/<fcl|lcl|dta|redex|apoio-logistico|carga-projeto>` ·
`/terminais` · `/operacao` · `/empresa` · `/duvidas` · `/contato` (cotação)

## Estrutura

| Arquivo | O que tem |
|---|---|
| `src/data.mjs` | Dados em um lugar só: serviços, terminais, perguntas, habilitações, fotos, vídeos, menu |
| `src/pages/*.mjs` | Conteúdo de cada página |
| `tools/build.mjs` | Monta as páginas (cabeçalho, rodapé, metatags, sitemap) |
| `tools/serve.mjs` | Servidor local igual à Vercel (URLs limpas e CSP): `node tools/serve.mjs` → http://localhost:5510 |
| `tools/trace-marca.py` | Vetoriza a marca (`images/marca.svg`) a partir do PNG oficial |
| `css/site.css` | Todos os estilos |
| `js/boot.js` / `js/main.js` | Scripts (o mesmo `main.js` serve todas as páginas) |
| `images/`, `video/`, `fonts/` | Fotos, logos, vídeos curtos e fontes |
| `*.html`, `servicos/`, `sitemap.xml` | **Gerados** — não edite à mão |

## Onde mexer

- **Textos, serviços, terminais, dúvidas:** em `src/`, depois rode `node tools/build.mjs`.
- **Cidades do mapa:** array `CITIES` em `js/main.js`.
- **Domínio próprio:** `SITE.base` em `src/data.mjs` (canonical, OG e sitemap).
- **Trocar fotos:** use um **nome de arquivo novo** (o navegador guarda as imagens em cache).

## Segurança

A CSP em `vercel.json` só permite scripts do próprio domínio. Não coloque `<script>` com código dentro do HTML nem scripts de outros sites: eles serão bloqueados. Para adicionar algo, crie um arquivo em `js/`.

## Analytics

Preparado, mas desligado. Para ativar o Vercel Web Analytics, habilite no painel da Vercel e descomente a linha indicada no `<head>` do `index.html`.

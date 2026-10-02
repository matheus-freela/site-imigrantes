# Transportes Imigrantes — site institucional

Site one-page da Transportes Rodoviários Imigrantes (Santos/SP), publicado na Vercel:
https://site-imigrantes-gamma.vercel.app

HTML, CSS e JavaScript puros, sem build. Todo envio para a branch `main` é publicado automaticamente em produção.

## Estrutura

| Arquivo | O que tem |
|---|---|
| `index.html` | Página inteira: textos, estrutura e estilos |
| `js/boot.js` | Script mínimo carregado no `<head>` (animações de entrada e rede de segurança) |
| `js/main.js` | Comportamento: menu, letreiro, mapa, slider, formulário de cotação e analytics |
| `404.html` | Página de endereço não encontrado |
| `fonts/` | Fontes hospedadas no próprio site (Big Shoulders e IBM Plex) |
| `images/` | Fotos e logo |
| `vercel.json` | Cabeçalhos de segurança (CSP) e cache |

## Onde mexer

- **Textos:** direto no `index.html`.
- **Terminais atendidos:** seção `id="terminais"` do `index.html` — a lista do formulário de cotação é lida dali.
- **Cidades do mapa:** array `CITIES` em `js/main.js`.
- **WhatsApp e e-mail do formulário:** `WA_NUM` e `EMAIL` em `js/main.js` (os links do HTML também usam o número).
- **Trocar fotos:** use um **nome de arquivo novo** (o navegador guarda as imagens em cache).

## Segurança

A CSP em `vercel.json` só permite scripts do próprio domínio. Não coloque `<script>` com código dentro do HTML nem scripts de outros sites: eles serão bloqueados. Para adicionar algo, crie um arquivo em `js/`.

## Analytics

Preparado, mas desligado. Para ativar o Vercel Web Analytics, habilite no painel da Vercel e descomente a linha indicada no `<head>` do `index.html`.

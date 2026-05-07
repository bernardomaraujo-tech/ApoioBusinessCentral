# ApoioBusinessCentral — Versão simples

Aplicação estática para GitHub Pages com apenas 2 páginas:

1. `index.html` — Pesquisa de soluções.
2. `configuracao.html` — Importação/exportação da base de conhecimento, protegida por password.

A página principal permite escrever detalhe adicional que será refletido no email de suporte.

## Base carregada

- Artigos importados: 72
- Disponíveis para utilizador: 46
- Disponíveis para agente: 72

## Password da configuração

Password inicial:

```text
ApoioBC2026
```

Nota: como isto corre em GitHub Pages, a password é apenas uma barreira simples de interface. Não é segurança forte, porque o código é público no browser.

## Publicação

No GitHub Pages:

```text
Settings → Pages
Source: Deploy from branch
Branch: main
Folder: / root
```

## Ficheiros principais

```text
index.html
configuracao.html
assets/app.css
assets/app.js
assets/kb-data.js
```


## Identidade visual

Esta versão usa uma identidade visual inspirada em ferramentas empresariais colaborativas:
- barra lateral vertical;
- topo com nome da app e utilizador;
- cartões arredondados;
- tons azul/violeta;
- área de pesquisa central;
- sugestões à esquerda;
- artigo selecionado à direita.

Não utiliza logótipos Microsoft/Teams.

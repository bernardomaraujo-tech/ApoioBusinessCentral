# ApoioBusinessCentral — GitHub Pages Edition

Versão simplificada da **ApoioBusinessCentral**, desenhada para funcionar apenas com **GitHub + GitHub Pages**, sem backend, sem servidores externos e sem integrações reais.

## O que esta versão faz

- Funciona como aplicação web estática.
- Corre diretamente no GitHub Pages.
- Gere uma base de conhecimento local.
- Permite criar, editar e pesquisar artigos KB.
- Permite criar pedidos internos de apoio.
- Sugere artigos com base no texto do pedido.
- Quando não encontra artigo aplicável, indica encaminhamento para agente.
- Guarda dados no browser via `localStorage`.
- Permite exportar/importar dados em JSON.
- Permite exportar artigos em Markdown.

## O que foi removido

- FastAPI/backend.
- Workers.
- Azure/App Service.
- Integração real com Jira Service Management.
- Integração real com Confluence.
- Integração real com Business Central.
- Webhooks.
- OAuth.
- Secrets.
- GitHub Actions obrigatório.
- Infraestrutura Bicep/Terraform.

## Limitação principal

Como o GitHub Pages é hosting estático, esta app **não tem base de dados central**.  
Os dados ficam guardados no browser de cada utilizador.

Para partilhar/guardar dados entre pessoas, usar:

1. **Exportar JSON**;
2. guardar o ficheiro no repositório ou numa pasta partilhada;
3. outro utilizador faz **Importar JSON**.

## Publicação no GitHub Pages

Configuração recomendada:

```text
Settings → Pages
Source: Deploy from a branch
Branch: main
Folder: / (root)
```

A aplicação abre em:

```text
https://<utilizador>.github.io/ApoioBusinessCentral/
```

## Estrutura

```text
.
├── index.html
├── README.md
├── docs/
│   ├── github-pages-architecture.md
│   ├── user-guide.md
│   └── limitations.md
├── templates/
│   └── kb-article-template.md
└── data/
    └── sample-export.json
```

## Regra de IA/sugestão

Esta versão **não usa IA generativa real**.  
Usa apenas pesquisa e scoring local sobre os artigos da KB.

Regra:

```text
Se existir artigo KB relevante → sugere artigo.
Se não existir artigo relevante → encaminhar para agente.
```

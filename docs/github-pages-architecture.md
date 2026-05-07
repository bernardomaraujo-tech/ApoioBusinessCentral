# Arquitetura GitHub Pages

## Decisão

A versão simplificada da ApoioBusinessCentral passa a ser uma aplicação 100% estática.

## Componentes

| Componente | Tecnologia | Função |
|---|---|---|
| Interface | HTML/CSS/JavaScript | App principal. |
| Hosting | GitHub Pages | Publicação da app. |
| Persistência | localStorage | Dados guardados no browser. |
| Exportação | JSON/Markdown | Backup e partilha manual. |
| Sugestões KB | Scoring local | Pesquisa sem IA externa. |

## Diagrama

```mermaid
flowchart LR
    A[Utilizador] --> B[GitHub Pages]
    B --> C[index.html]
    C --> D[localStorage]
    C --> E[Export JSON]
    C --> F[Export Markdown]
    E --> G[GitHub / pasta partilhada]
    G --> H[Import JSON]
    H --> C
```

## Fluxo de pedido

```mermaid
flowchart TD
    A[Novo pedido] --> B[Texto do resumo e descrição]
    B --> C[Pesquisa local na KB]
    C --> D{Artigo relevante?}
    D -->|Sim| E[Sugerir artigo]
    D -->|Não| F[Encaminhar para agente]
    E --> G[Guardar pedido]
    F --> G
```

## Implicação

Esta abordagem é ideal para um primeiro protótipo funcional porque:

- não exige infraestrutura;
- não exige orçamento adicional;
- não exige tokens;
- não expõe segredos;
- permite validar o modelo funcional antes de integrar Jira/Confluence/BC.

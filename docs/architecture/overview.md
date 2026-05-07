# Arquitetura — ApoioBusinessCentral

## Visão geral

A ApoioBusinessCentral é uma plataforma interna para centralizar suporte, conhecimento e automação sobre Business Central.

## Camadas

| Camada | Componente | Responsabilidade |
|---|---|---|
| Entrada | Portal, e-mail, widget, chat | Receção de pedidos internos. |
| Service Management | Jira Service Management | Tickets, workflow, filas, SLAs e dashboards. |
| Conhecimento | Confluence | KB ApoioBusinessCentral. |
| Integração | Integration API + workers | Contexto BC, webhooks, migração KB e automações. |
| ERP | Business Central | Dados transacionais e contexto operacional. |
| IA | Atlassian AI ou camada externa futura | Resposta assistida restrita à KB. |

## Diagrama

```mermaid
flowchart LR
    A[Utilizadores internos] --> B[Portal ApoioBusinessCentral]
    A --> C[Email / Widget / Chat]
    B --> D[Jira Service Management]
    C --> D
    D <--> E[Confluence - KB ApoioBusinessCentral]
    D --> F[Automation Rules]
    F --> G[Integration API]
    G <--> H[Business Central API v2.0]
    G <--> I[Custom APIs AL]
    H --> J[Business Central Webhooks]
    J --> G
    G --> K[AI Layer - KB only]
    K --> E
    K --> D
    L[Microsoft Entra ID + Atlassian Guard opcional] --> D
    L --> E
    M[Logs / Monitoring] <-- G
```

## Princípios

- Native-first.
- Custom apenas onde existe valor real.
- IA restrita à KB.
- Human-in-the-loop.
- Sem multi-tenant forte no MVP.
- Sem auditoria avançada no MVP.
- Medir antes de otimizar.

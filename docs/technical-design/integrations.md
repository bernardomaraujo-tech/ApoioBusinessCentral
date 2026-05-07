# Integrações

## Jira Service Management

### Responsabilidades

- Criar e atualizar tickets.
- Consultar request types e campos.
- Adicionar comentários internos.
- Atualizar campos de contexto BC.
- Aplicar labels e transições.

### Endpoints de referência

```http
POST /rest/servicedeskapi/request
GET  /rest/servicedeskapi/servicedesk/{serviceDeskId}/requesttype/{requestTypeId}/field
```

## Confluence

### Responsabilidades

- Criar páginas de KB.
- Atualizar artigos.
- Gerir labels.
- Criar drafts para revisão.

### Endpoints de referência

```http
POST /wiki/api/v2/pages
PUT  /wiki/api/v2/pages/{id}
GET  /wiki/api/v2/pages/{id}
```

## Business Central

### Responsabilidades MVP

- Listar empresas.
- Consultar contexto de cliente/documento, se aplicável.
- Receber webhooks, se configurado.
- Não executar alterações críticas automaticamente.

### Endpoints de referência

```http
GET  /api/v2.0/companies
POST /api/v2.0/subscriptions
PATCH /api/v2.0/subscriptions({id})
```

## Webhooks BC

Requisitos:

- suportar handshake com `validationToken`;
- validar `clientState`;
- aplicar idempotência;
- registar logs;
- ter mecanismo de retry/dead-letter.

## Segurança

- Usar app registration/service account.
- Evitar tokens pessoais em produção.
- Secrets fora do GitHub.
- Permissões mínimas.
- Logs sem dados sensíveis sempre que possível.

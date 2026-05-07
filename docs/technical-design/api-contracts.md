# API Contracts — Integration API

## GET /health

Resposta:

```json
{
  "status": "ok",
  "service": "ApoioBusinessCentral Integration API"
}
```

## POST /webhooks/jira/ticket-created

Payload esperado:

```json
{
  "issue_id": "ABC-123",
  "summary": "Erro ao registar fatura",
  "description": "Mensagem de erro...",
  "company_code": "EMPRESA01",
  "bc_environment": "Production",
  "document_reference": "FV/2026/00001",
  "request_type": "ABC-FINANCE"
}
```

## POST /webhooks/business-central

Suporta dois modos:

1. handshake de validação;
2. receção de notificações.

Payload exemplo:

```json
{
  "value": [
    {
      "subscriptionId": "00000000-0000-0000-0000-000000000000",
      "clientState": "configured-secret",
      "resource": "companies(id)/salesInvoices(id)",
      "changeType": "updated",
      "lastModifiedDateTime": "2026-05-07T10:00:00Z"
    }
  ]
}
```

## POST /kb/draft-from-ticket

Payload:

```json
{
  "issue_id": "ABC-123",
  "summary": "Erro ao comunicar documento",
  "resolution": "Foi necessário executar a fila de tarefas...",
  "category": "Integrações",
  "visibility": "agent"
}
```

Regra:

- criar draft, não publicar automaticamente.

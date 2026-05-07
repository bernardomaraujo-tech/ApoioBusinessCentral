# Integration API — ApoioBusinessCentral

API leve para orquestrar integrações entre Jira Service Management, Confluence, Business Central e a camada de IA/KB.

## Endpoints

| Endpoint | Método | Objetivo |
|---|---|---|
| `/health` | GET | Healthcheck. |
| `/webhooks/jira/ticket-created` | POST | Receber evento de ticket criado. |
| `/webhooks/business-central` | GET/POST | Handshake e receção de webhook BC. |
| `/kb/draft-from-ticket` | POST | Criar draft KB a partir de ticket resolvido. |

## Executar localmente

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8080
```

## Testes

```bash
pytest
```

# BC Webhook Worker

Worker para processar eventos Business Central de forma assíncrona.

## Responsabilidades futuras

- Ler eventos da fila.
- Validar idempotência.
- Consultar recurso BC.
- Encontrar tickets relacionados.
- Atualizar Jira.
- Registar erros em dead-letter queue.

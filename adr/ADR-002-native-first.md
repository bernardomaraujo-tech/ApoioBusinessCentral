# ADR-002 — Estratégia native-first, custom-where-it-matters

## Estado

Aceite

## Decisão

Usar capacidades nativas Atlassian sempre que possível e desenvolver custom apenas onde exista lacuna clara.

## Aplicação

Nativo:

- portal;
- tickets;
- workflows;
- SLAs;
- filas;
- dashboards;
- Confluence KB;
- sugestões de artigos;
- automações.

Custom:

- Integration API;
- contexto Business Central;
- webhooks;
- migração programática da KB;
- validações custom;
- IA externa futura, se necessário.

## Justificação

Reduz custo, risco e tempo de implementação.

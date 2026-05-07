# ADR-004 — Integração Business Central

## Estado

Aceite

## Decisão

O Business Central será usado como fonte de contexto, não como motor de suporte.

## MVP

- Listar empresas.
- Consultar contexto relevante.
- Receber webhooks se necessário.
- Atualizar tickets com dados contextuais.

## Fora do MVP

- Correções automáticas em documentos.
- Registos automáticos sensíveis.
- Alterações de dados sem validação humana.

## Justificação

Mantém separação de responsabilidades e reduz risco sobre dados transacionais.

# Workflow e SLAs

## Workflow mínimo

```text
Novo → Triagem → A aguardar informação → Em análise → Em execução → Em validação → Resolvido → Fechado
```

## Estados

| Estado | Uso |
|---|---|
| Novo | Pedido criado. |
| Triagem | Classificação inicial. |
| A aguardar informação | Falta informação do utilizador. |
| Em análise | Diagnóstico funcional/técnico. |
| Em execução | Intervenção ou preparação da resposta. |
| Em validação | Solução aplicada ou resposta enviada. |
| Resolvido | Pedido resolvido. |
| Fechado | Encerramento final. |

## SLA MVP

| Prioridade | Primeira resposta |
|---|---:|
| P1 | Até 24h |
| P2 | Até 24h |
| P3 | Até 24h |
| P4 | Até 24h |

## Pausa SLA

Pausar em:

- A aguardar informação;
- A aguardar validação do utilizador;
- A aguardar terceiro/parceiro, se aplicável.

## Revisão após 30-60 dias

Rever:

- volume real de tickets;
- % de P1/P2;
- tempo médio de resposta;
- tempo médio de resolução;
- backlog por estado;
- necessidade de diferenciar SLA por prioridade.

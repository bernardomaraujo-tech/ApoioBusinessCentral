# Governance de IA

## Regra principal

A IA da ApoioBusinessCentral deve responder apenas com base na KB ApoioBusinessCentral validada.

## Comportamento esperado

| Situação | Comportamento |
|---|---|
| Existe artigo relevante | Sugerir resposta com referência ao artigo. |
| Artigo existe mas confiança baixa | Encaminhar para agente com artigos candidatos. |
| Não existe artigo | Encaminhar para agente. |
| Pedido envolve alteração em BC | Não executar; sugerir validação humana. |
| Pedido envolve dados sensíveis | Evitar exposição e sinalizar para agente. |

## Proibido no MVP

- Respostas baseadas em conhecimento externo.
- Inventar procedimentos.
- Publicar artigos automaticamente.
- Executar alterações no Business Central.
- Tomar decisões de negócio sem agente.

## Métricas

- drafts gerados;
- drafts aceites;
- drafts rejeitados;
- temas sem artigo;
- tickets resolvidos com apoio de KB.

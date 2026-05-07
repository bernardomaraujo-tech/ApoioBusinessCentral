from app.models import KbDraftRequest, KbDraftResponse


def build_kb_draft(request: KbDraftRequest) -> KbDraftResponse:
    title = f"{request.summary}".strip()

    if not request.resolution.strip():
        return KbDraftResponse(
            status="rejected",
            reason="Não é possível criar draft sem resolução documentada.",
        )

    labels = ["abc", "apoio-business-central", *request.labels]

    body = f'''
# {title}

## Metadados

| Campo | Valor |
|---|---|
| ID | A atribuir |
| Categoria | {request.category} |
| Visibilidade | {request.visibility} |
| Estado | Rascunho |
| Ticket origem | {request.issue_id} |

## Problema

{request.summary}

## Diagnóstico

A completar pelo agente/editor com base no ticket {request.issue_id}.

## Solução

{request.resolution}

## Procedimento

1. Validar o contexto do pedido.
2. Confirmar empresa e ambiente BC.
3. Aplicar o procedimento documentado na solução.
4. Confirmar resultado com o utilizador.

## Validação final

- Confirmar que o problema ficou resolvido.
- Confirmar que o utilizador validou.
- Associar este artigo a pedidos futuros semelhantes.

## Notas

Draft gerado automaticamente a partir de ticket resolvido. Requer revisão humana antes de publicação.
'''.strip()

    return KbDraftResponse(
        status="draft_created",
        title=title,
        body_markdown=body,
        metadata={"labels": labels, "source_issue": request.issue_id},
    )

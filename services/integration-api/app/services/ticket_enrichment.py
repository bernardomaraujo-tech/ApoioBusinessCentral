from app.models import TicketCreatedPayload
from app.services.priority import calculate_priority
from app.services.kb_policy import evaluate_kb_answer_policy


async def enrich_ticket(payload: TicketCreatedPayload) -> dict:
    priority = calculate_priority(payload.impact, payload.urgency)

    # Placeholder: no futuro, procurar artigos reais no Confluence/KB index.
    kb_articles: list[dict] = []
    kb_decision = evaluate_kb_answer_policy(kb_articles)

    return {
        "issue_id": payload.issue_id,
        "priority": priority,
        "kb_decision": {
            "can_answer": kb_decision.can_answer,
            "reason": kb_decision.reason,
            "confidence": kb_decision.confidence,
        },
        "next_action": "route_to_agent" if not kb_decision.can_answer else "draft_reply",
    }

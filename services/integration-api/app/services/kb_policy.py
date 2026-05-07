from dataclasses import dataclass


@dataclass(frozen=True)
class KbDecision:
    can_answer: bool
    reason: str
    confidence: float = 0.0


def evaluate_kb_answer_policy(kb_articles: list[dict], min_confidence: float = 0.75) -> KbDecision:
    """Decide se a IA pode responder.

    Regra MVP:
    - Só pode responder se existir pelo menos um artigo KB aplicável.
    - A confiança do melhor artigo tem de ser >= min_confidence.
    - Caso contrário, encaminhar para agente.
    """
    if not kb_articles:
        return KbDecision(False, "Sem artigo KB aplicável.", 0.0)

    best = max(kb_articles, key=lambda item: float(item.get("confidence", 0.0)))
    confidence = float(best.get("confidence", 0.0))

    if confidence < min_confidence:
        return KbDecision(False, "Confiança KB insuficiente; encaminhar para agente.", confidence)

    return KbDecision(True, "Resposta permitida com base na KB.", confidence)

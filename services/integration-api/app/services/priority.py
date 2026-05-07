PRIORITY_MATRIX = {
    "individual": {"baixa": "P4", "media": "P4", "alta": "P3", "imediata": "P3"},
    "equipa": {"baixa": "P4", "media": "P3", "alta": "P2", "imediata": "P2"},
    "operacao": {"baixa": "P3", "media": "P2", "alta": "P2", "imediata": "P1"},
    "empresa": {"baixa": "P2", "media": "P2", "alta": "P1", "imediata": "P1"},
    "legal_fiscal_critico": {"baixa": "P2", "media": "P1", "alta": "P1", "imediata": "P1"},
}


def calculate_priority(impact: str | None, urgency: str | None) -> str:
    if not impact or not urgency:
        return "P3"

    normalized_impact = impact.strip().lower().replace(" ", "_")
    normalized_urgency = urgency.strip().lower().replace("é", "e")

    return PRIORITY_MATRIX.get(normalized_impact, {}).get(normalized_urgency, "P3")

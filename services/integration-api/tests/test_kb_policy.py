from app.services.kb_policy import evaluate_kb_answer_policy


def test_policy_blocks_without_articles():
    decision = evaluate_kb_answer_policy([])
    assert decision.can_answer is False


def test_policy_blocks_low_confidence():
    decision = evaluate_kb_answer_policy([{"title": "X", "confidence": 0.5}], min_confidence=0.75)
    assert decision.can_answer is False


def test_policy_allows_high_confidence():
    decision = evaluate_kb_answer_policy([{"title": "X", "confidence": 0.9}], min_confidence=0.75)
    assert decision.can_answer is True

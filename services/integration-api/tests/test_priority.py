from app.services.priority import calculate_priority


def test_priority_defaults_to_p3_when_missing_values():
    assert calculate_priority(None, None) == "P3"


def test_priority_operacao_imediata_is_p1():
    assert calculate_priority("operacao", "imediata") == "P1"


def test_priority_equipa_media_is_p3():
    assert calculate_priority("equipa", "media") == "P3"

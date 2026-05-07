from app.models import KbDraftRequest
from app.services.kb_draft import build_kb_draft


def test_build_kb_draft_requires_resolution():
    response = build_kb_draft(KbDraftRequest(issue_id="ABC-1", summary="Erro", resolution=""))
    assert response.status == "rejected"


def test_build_kb_draft_creates_markdown():
    response = build_kb_draft(
        KbDraftRequest(issue_id="ABC-1", summary="Erro ao comunicar", resolution="Executar fila de tarefas.")
    )
    assert response.status == "draft_created"
    assert "Erro ao comunicar" in response.body_markdown

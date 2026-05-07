from fastapi import FastAPI, Query, Request, HTTPException
from fastapi.responses import PlainTextResponse
from app.core.settings import get_settings
from app.models import (
    HealthResponse,
    TicketCreatedPayload,
    BusinessCentralWebhookPayload,
    KbDraftRequest,
    KbDraftResponse,
)
from app.services.ticket_enrichment import enrich_ticket
from app.services.kb_draft import build_kb_draft
from app.clients.confluence import ConfluenceClient

settings = get_settings()

app = FastAPI(
    title="ApoioBusinessCentral Integration API",
    version="0.1.0",
    description="API de integração para Jira Service Management, Confluence e Business Central.",
)


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        service="ApoioBusinessCentral Integration API",
        environment=settings.app_env,
    )


@app.post("/webhooks/jira/ticket-created")
async def jira_ticket_created(payload: TicketCreatedPayload) -> dict:
    result = await enrich_ticket(payload)
    return {"status": "processed", "result": result}


@app.get("/webhooks/business-central", response_class=PlainTextResponse)
async def business_central_validation(validationToken: str | None = Query(default=None)) -> str:
    if validationToken:
        return validationToken
    return "ApoioBusinessCentral webhook endpoint"


@app.post("/webhooks/business-central")
async def business_central_webhook(payload: BusinessCentralWebhookPayload) -> dict:
    processed = []

    for event in payload.value:
        if settings.bc_webhook_client_state and event.clientState != settings.bc_webhook_client_state:
            raise HTTPException(status_code=401, detail="Invalid clientState")

        processed.append(
            {
                "subscription_id": event.subscriptionId,
                "resource": event.resource,
                "change_type": event.changeType,
                "status": "accepted",
            }
        )

    return {"status": "processed", "events": processed}


@app.post("/kb/draft-from-ticket", response_model=KbDraftResponse)
async def kb_draft_from_ticket(payload: KbDraftRequest) -> KbDraftResponse:
    draft = build_kb_draft(payload)

    if draft.status != "draft_created":
        return draft

    # Scaffold: se Confluence estiver configurado, tenta criar página draft.
    confluence = ConfluenceClient()
    await confluence.create_page(
        title=draft.title or payload.summary,
        body_markdown=draft.body_markdown or "",
        labels=draft.metadata.get("labels", []),
    )

    return draft

from typing import Any, Literal
from pydantic import BaseModel, Field


class TicketCreatedPayload(BaseModel):
    issue_id: str
    summary: str
    description: str | None = None
    company_code: str | None = None
    bc_environment: str | None = None
    document_reference: str | None = None
    request_type: str | None = None
    impact: str | None = None
    urgency: str | None = None


class BusinessCentralWebhookEvent(BaseModel):
    subscriptionId: str | None = None
    clientState: str | None = None
    resource: str | None = None
    changeType: str | None = None
    lastModifiedDateTime: str | None = None


class BusinessCentralWebhookPayload(BaseModel):
    value: list[BusinessCentralWebhookEvent] = Field(default_factory=list)


class KbDraftRequest(BaseModel):
    issue_id: str
    summary: str
    resolution: str
    category: str = "Erros conhecidos"
    visibility: Literal["user", "agent", "internal"] = "agent"
    labels: list[str] = Field(default_factory=list)


class KbDraftResponse(BaseModel):
    status: Literal["draft_created", "needs_agent", "rejected"]
    title: str | None = None
    body_markdown: str | None = None
    reason: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class HealthResponse(BaseModel):
    status: str
    service: str
    environment: str

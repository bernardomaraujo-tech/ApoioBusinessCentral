import httpx
from app.core.settings import get_settings


class BusinessCentralClient:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def list_companies(self) -> dict:
        if not all([self.settings.bc_tenant_id, self.settings.bc_environment]):
            return {"status": "skipped", "reason": "Business Central not configured", "value": []}

        # Nota: este scaffold não implementa ainda aquisição OAuth token.
        # Implementar via Microsoft Entra ID antes de usar em produção.
        return {"status": "not_implemented", "reason": "OAuth token acquisition required"}

    async def get_resource_by_url(self, resource_url: str | None) -> dict:
        if not resource_url:
            return {"status": "ignored", "reason": "No resource URL"}

        return {
            "status": "placeholder",
            "resource": resource_url,
            "message": "Implementar leitura autenticada do recurso BC.",
        }

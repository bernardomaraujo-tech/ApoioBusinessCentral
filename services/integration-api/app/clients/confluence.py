import httpx
from app.core.settings import get_settings


class ConfluenceClient:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def create_page(self, title: str, body_markdown: str, labels: list[str] | None = None) -> dict:
        if not self.settings.confluence_base_url:
            return {
                "status": "skipped",
                "reason": "CONFLUENCE_BASE_URL not configured",
                "title": title,
                "body_markdown": body_markdown,
                "labels": labels or [],
            }

        url = f"{self.settings.confluence_base_url}/api/v2/pages"
        payload = {
            "spaceId": self.settings.confluence_space_id,
            "status": "draft",
            "title": title,
            "parentId": self.settings.confluence_kb_parent_id or None,
            "body": {
                "representation": "storage",
                "value": f"<ac:structured-macro ac:name='markdown'><ac:plain-text-body><![CDATA[{body_markdown}]]></ac:plain-text-body></ac:structured-macro>",
            },
        }

        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                url,
                json=payload,
                auth=(self.settings.confluence_email, self.settings.confluence_api_token),
                headers={"Accept": "application/json", "Content-Type": "application/json"},
            )
            response.raise_for_status()
            page = response.json()

        return page

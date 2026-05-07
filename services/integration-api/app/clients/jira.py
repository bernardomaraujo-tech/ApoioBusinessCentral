import httpx
from app.core.settings import get_settings


class JiraClient:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def add_internal_comment(self, issue_id: str, body: str) -> dict:
        if not self.settings.jira_base_url:
            return {"status": "skipped", "reason": "JIRA_BASE_URL not configured"}

        url = f"{self.settings.jira_base_url}/rest/api/3/issue/{issue_id}/comment"
        payload = {
            "body": {
                "type": "doc",
                "version": 1,
                "content": [
                    {
                        "type": "paragraph",
                        "content": [{"type": "text", "text": body}],
                    }
                ],
            }
        }

        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                url,
                json=payload,
                auth=(self.settings.jira_email, self.settings.jira_api_token),
                headers={"Accept": "application/json", "Content-Type": "application/json"},
            )
            response.raise_for_status()
            return response.json() if response.content else {"status": "ok"}

    async def update_issue_fields(self, issue_id: str, fields: dict) -> dict:
        if not self.settings.jira_base_url:
            return {"status": "skipped", "reason": "JIRA_BASE_URL not configured"}

        url = f"{self.settings.jira_base_url}/rest/api/3/issue/{issue_id}"
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.put(
                url,
                json={"fields": fields},
                auth=(self.settings.jira_email, self.settings.jira_api_token),
                headers={"Accept": "application/json", "Content-Type": "application/json"},
            )
            response.raise_for_status()
            return {"status": "ok"}

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "ApoioBusinessCentral"
    app_env: str = "local"
    log_level: str = "INFO"

    jira_base_url: str = ""
    jira_email: str = ""
    jira_api_token: str = ""
    jira_service_desk_id: str = ""
    jira_project_key: str = "ABC"

    confluence_base_url: str = ""
    confluence_email: str = ""
    confluence_api_token: str = ""
    confluence_space_id: str = ""
    confluence_kb_parent_id: str = ""

    bc_tenant_id: str = ""
    bc_client_id: str = ""
    bc_client_secret: str = ""
    bc_environment: str = "Production"
    bc_api_base: str = "https://api.businesscentral.dynamics.com/v2.0"

    bc_webhook_client_state: str = ""
    public_webhook_base_url: str = ""

    ai_mode: str = "kb_only"
    ai_provider: str = "none"
    ai_min_confidence: float = 0.75

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()

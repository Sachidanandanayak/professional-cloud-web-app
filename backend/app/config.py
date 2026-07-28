from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union

class Settings(BaseSettings):
    PROJECT_NAME: str = "Professional Cloud Web App API"
    API_V1_STR: str = "/api"

    SECRET_KEY: str = "dev_secret_key_override_in_production"
    JWT_SECRET: str = "dev_jwt_secret_override_in_production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    @field_validator("SECRET_KEY", "JWT_SECRET", mode="after")
    @classmethod
    def validate_secrets(cls, v: str, info) -> str:
        if "change_me" in v or "override_in_production" in v:
            import warnings
            warnings.warn(
                f"[SECURITY WARNING] Default {info.field_name} is in use. "
                "Ensure environment variable is set for production deployment."
            )
        return v

    # Database — defaults to SQLite for local development
    # Set MYSQL_HOST env var to switch to MySQL (required for production)
    MYSQL_HOST: str = ""
    MYSQL_PORT: int = 3306
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = "password"
    MYSQL_DATABASE: str = "nexuscloud"

    # Accepts comma-separated string from .env or env var
    CORS_ORIGINS: Union[List[str], str] = (
        "http://localhost:5173,http://localhost:3000,"
        "http://127.0.0.1:5173,http://127.0.0.1:3000"
    )

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    @property
    def DATABASE_URL(self) -> str:
        if self.MYSQL_HOST:
            return (
                f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
                f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"
            )
        return "sqlite:///./nexus.db"

    model_config = {"env_file": ".env", "case_sensitive": True}

settings = Settings()


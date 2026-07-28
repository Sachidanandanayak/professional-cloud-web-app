from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

from app.config import settings
from app.routers import auth, api
from app.core.exceptions import (
    AppException,
    app_exception_handler,
    validation_exception_handler,
    sqlalchemy_exception_handler,
    general_exception_handler
)
from app.database import engine, Base
from app.models import domain  # noqa: F401 — ensures models are registered

# Create tables on startup (use Alembic migrations in production)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Enterprise-grade Backend for Professional Cloud Web Application",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(api.api_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health"])
def health_check():
    return {"success": True, "message": "API is healthy", "version": "1.0.0"}

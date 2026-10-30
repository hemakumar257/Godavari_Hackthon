from typing import Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime


class DatabaseHealth(BaseModel):
    connected: bool
    configured: bool
    type: str
    message: str
    database_name: str | None = None


class HealthResponse(BaseModel):
    status: str = Field(..., description="Overall health status: 'ok' or 'degraded'")
    service: str
    version: str
    environment: str
    database: DatabaseHealth
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")

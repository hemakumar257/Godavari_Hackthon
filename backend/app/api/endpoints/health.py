from fastapi import APIRouter
from app.core.config import settings
from app.database.session import db_manager
from app.schemas.health import HealthResponse, DatabaseHealth
from datetime import datetime

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
async def get_health():
    """
    Application health-check endpoint.
    Reports operational status and live database availability.
    """
    db_status = await db_manager.check_status()
    db_health = DatabaseHealth(**db_status)

    # If database is configured but disconnected, mark status as degraded.
    # If not configured in Phase 1 skeleton, platform core still operates as 'ok (demo/skeleton)'.
    status = "ok" if (db_health.connected or not db_health.configured) else "degraded"

    return HealthResponse(
        status=status,
        service=settings.PROJECT_NAME,
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        database=db_health,
        timestamp=datetime.utcnow().isoformat() + "Z",
    )

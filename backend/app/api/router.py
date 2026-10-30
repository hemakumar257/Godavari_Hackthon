from fastapi import APIRouter
from app.api.endpoints import (
    health,
    events,
    ghats,
    temples,
    parking,
    facilities,
    medical,
    police,
    reports,
    live_streams,
    heritage_and_yatras,
)

api_router = APIRouter()

# Attach all Phase 1 to Phase 5 endpoints
api_router.include_router(health.router)
api_router.include_router(events.router)
api_router.include_router(ghats.router)
api_router.include_router(temples.router)
api_router.include_router(parking.router)
api_router.include_router(facilities.router)
api_router.include_router(medical.router)
api_router.include_router(police.router)
api_router.include_router(reports.router)
api_router.include_router(live_streams.router)
api_router.include_router(heritage_and_yatras.heritage_router)
api_router.include_router(heritage_and_yatras.yatras_router)


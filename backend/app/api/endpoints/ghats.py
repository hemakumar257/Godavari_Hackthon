"""Bathing Ghats API Endpoints."""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.schemas.phase2 import GhatBase
from app.data.demo_data import DEMO_GHATS

router = APIRouter(prefix="/ghats", tags=["Ghats"])


@router.get("", response_model=List[GhatBase])
async def list_ghats(
    status: Optional[str] = Query(None, description="Filter by status (open, restricted, closed)"),
    crowd: Optional[str] = Query(None, description="Filter by crowd level"),
    search: Optional[str] = Query(None, description="Search term in name or landmark"),
):
    results = DEMO_GHATS
    if status and status != "all":
        results = [g for g in results if g.get("status") == status]
    if crowd and crowd != "all":
        results = [g for g in results if g.get("crowdStatus") == crowd]
    if search:
        s = search.lower()
        results = [
            g
            for g in results
            if s in g.get("nameEn", "").lower()
            or s in g.get("nameTe", "").lower()
            or s in g.get("nearbyLandmark", "").lower()
        ]
    return results


@router.get("/{ghat_id}", response_model=GhatBase)
async def get_ghat(ghat_id: str):
    for ghat in DEMO_GHATS:
        if ghat["id"] == ghat_id:
            return ghat
    raise HTTPException(status_code=404, detail="Bathing ghat not found")

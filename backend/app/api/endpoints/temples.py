"""Temples API Endpoints."""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.schemas.phase2 import TempleBase
from app.data.demo_data import DEMO_TEMPLES

router = APIRouter(prefix="/temples", tags=["Temples"])


@router.get("", response_model=List[TempleBase])
async def list_temples(
    search: Optional[str] = Query(None, description="Search term in name or deity"),
):
    results = DEMO_TEMPLES
    if search:
        s = search.lower()
        results = [
            t
            for t in results
            if s in t.get("nameEn", "").lower()
            or s in t.get("nameTe", "").lower()
            or s in t.get("deity", "").lower()
        ]
    return results


@router.get("/{temple_id}", response_model=TempleBase)
async def get_temple(temple_id: str):
    for temple in DEMO_TEMPLES:
        if temple["id"] == temple_id:
            return temple
    raise HTTPException(status_code=404, detail="Temple not found")

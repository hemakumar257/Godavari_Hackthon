"""Police Assistance Endpoints."""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.schemas.phase3 import PoliceDeskBase
from app.data.demo_phase3 import DEMO_POLICE_DESKS

router = APIRouter(tags=["Police Assistance"])


@router.get("/police-desks", response_model=List[PoliceDeskBase])
async def list_police_desks(
    search: Optional[str] = Query(None, description="Search term in name or address"),
):
    results = DEMO_POLICE_DESKS
    if search:
        s = search.lower()
        results = [
            d
            for d in results
            if s in d.get("nameEn", "").lower()
            or s in d.get("nameTe", "").lower()
            or s in d.get("addressEn", "").lower()
        ]
    return results


@router.get("/police-desks/{desk_id}", response_model=PoliceDeskBase)
async def get_police_desk(desk_id: str):
    for desk in DEMO_POLICE_DESKS:
        if desk["id"] == desk_id:
            return desk
    raise HTTPException(status_code=404, detail="Police help desk not found")

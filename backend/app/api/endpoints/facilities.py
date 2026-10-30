"""Facilities API Endpoints."""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.schemas.phase2 import FacilityBase
from app.data.demo_data import DEMO_FACILITIES

router = APIRouter(prefix="/facilities", tags=["Facilities"])


@router.get("", response_model=List[FacilityBase])
async def list_facilities(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search in name or address"),
):
    results = DEMO_FACILITIES
    if category and category != "all":
        results = [f for f in results if f.get("category") == category]
    if search:
        s = search.lower()
        results = [
            f
            for f in results
            if s in f.get("nameEn", "").lower()
            or s in f.get("nameTe", "").lower()
            or s in f.get("addressEn", "").lower()
        ]
    return results


@router.get("/{facility_id}", response_model=FacilityBase)
async def get_facility(facility_id: str):
    for fac in DEMO_FACILITIES:
        if fac["id"] == facility_id:
            return fac
    raise HTTPException(status_code=404, detail="Facility not found")

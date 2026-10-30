"""Parking API Endpoints."""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.schemas.phase2 import ParkingBase
from app.data.demo_data import DEMO_PARKING

router = APIRouter(prefix="/parking", tags=["Parking"])


@router.get("", response_model=List[ParkingBase])
async def list_parking(
    status: Optional[str] = Query(None, description="Filter by status (available, filling, full)"),
    search: Optional[str] = Query(None, description="Search term in name or address"),
):
    results = DEMO_PARKING
    if status and status != "all":
        results = [p for p in results if p.get("status") == status]
    if search:
        s = search.lower()
        results = [
            p
            for p in results
            if s in p.get("nameEn", "").lower()
            or s in p.get("nameTe", "").lower()
            or s in p.get("addressEn", "").lower()
        ]
    return results


@router.get("/{parking_id}", response_model=ParkingBase)
async def get_parking(parking_id: str):
    for parking in DEMO_PARKING:
        if parking["id"] == parking_id:
            return parking
    raise HTTPException(status_code=404, detail="Parking location not found")

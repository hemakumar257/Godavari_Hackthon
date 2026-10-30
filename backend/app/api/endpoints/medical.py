"""Medical Camps & Hospital Endpoints."""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.schemas.phase3 import MedicalCampBase, HospitalBase
from app.data.demo_phase3 import DEMO_MEDICAL_CAMPS, DEMO_HOSPITALS

router = APIRouter(tags=["Medical Assistance"])


@router.get("/medical-camps", response_model=List[MedicalCampBase])
async def list_medical_camps(
    status: Optional[str] = Query(None, description="Filter by status"),
    search: Optional[str] = Query(None, description="Search term in name or address"),
):
    results = DEMO_MEDICAL_CAMPS
    if status and status != "all":
        results = [c for c in results if c.get("status") == status]
    if search:
        s = search.lower()
        results = [
            c
            for c in results
            if s in c.get("nameEn", "").lower()
            or s in c.get("nameTe", "").lower()
            or s in c.get("addressEn", "").lower()
        ]
    return results


@router.get("/medical-camps/{camp_id}", response_model=MedicalCampBase)
async def get_medical_camp(camp_id: str):
    for camp in DEMO_MEDICAL_CAMPS:
        if camp["id"] == camp_id:
            return camp
    raise HTTPException(status_code=404, detail="Medical camp not found")


@router.get("/hospitals", response_model=List[HospitalBase])
async def list_hospitals(
    search: Optional[str] = Query(None, description="Search term in name or address"),
):
    results = DEMO_HOSPITALS
    if search:
        s = search.lower()
        results = [
            h
            for h in results
            if s in h.get("nameEn", "").lower()
            or s in h.get("nameTe", "").lower()
            or s in h.get("addressEn", "").lower()
        ]
    return results


@router.get("/hospitals/{hospital_id}", response_model=HospitalBase)
async def get_hospital(hospital_id: str):
    for h in DEMO_HOSPITALS:
        if h["id"] == hospital_id:
            return h
    raise HTTPException(status_code=404, detail="Hospital not found")

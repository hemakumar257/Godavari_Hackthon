"""Events API Endpoints."""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.schemas.phase2 import EventBase
from app.data.demo_data import DEMO_EVENTS

router = APIRouter(prefix="/events", tags=["Events"])


@router.get("", response_model=List[EventBase])
async def list_events(
    category: Optional[str] = Query(None, description="Filter by event category"),
    search: Optional[str] = Query(None, description="Search term in title or venue"),
):
    results = DEMO_EVENTS
    if category and category != "all":
        results = [e for e in results if e.get("category") == category]
    if search:
        s = search.lower()
        results = [
            e
            for e in results
            if s in e.get("titleEn", "").lower()
            or s in e.get("titleTe", "").lower()
            or s in e.get("venueEn", "").lower()
        ]
    return results


@router.get("/{event_id}", response_model=EventBase)
async def get_event(event_id: str):
    for event in DEMO_EVENTS:
        if event["id"] == event_id:
            return event
    raise HTTPException(status_code=404, detail="Event not found")

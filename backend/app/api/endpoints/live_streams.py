"""Live Streams & Recordings Endpoints for Phase 4."""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from app.schemas.phase4 import LiveStreamBase
from app.data.demo_phase4 import DEMO_LIVE_STREAMS

router = APIRouter(prefix="/live-streams", tags=["Live Pushkaralu"])


class ReminderRequest(BaseModel):
    streamId: str
    streamTitleTe: Optional[str] = None
    streamTitleEn: Optional[str] = None
    scheduledStart: Optional[str] = None


@router.get("", response_model=List[LiveStreamBase])
async def list_live_streams(
    category: Optional[str] = Query(None, description="Category filter"),
    status: Optional[str] = Query(None, description="Status filter (LIVE, UPCOMING, ENDED)"),
    search: Optional[str] = Query(None, description="Search term in title or venue"),
):
    results = DEMO_LIVE_STREAMS
    if status and status != "all":
        results = [s for s in results if s.get("status") == status]
    if category and category != "all":
        results = [s for s in results if s.get("category") == category]
    if search:
        s = search.lower()
        results = [
            st
            for st in results
            if s in st.get("titleEn", "").lower()
            or s in st.get("titleTe", "").lower()
            or s in st.get("venueEn", "").lower()
            or s in st.get("venueTe", "").lower()
        ]
    return results


@router.get("/upcoming", response_model=List[LiveStreamBase])
async def list_upcoming_streams():
    return [s for s in DEMO_LIVE_STREAMS if s.get("status") == "UPCOMING"]


@router.get("/recordings", response_model=List[LiveStreamBase])
async def list_recordings():
    return [s for s in DEMO_LIVE_STREAMS if s.get("status") == "ENDED"]


@router.get("/{stream_id}", response_model=LiveStreamBase)
async def get_live_stream(stream_id: str):
    for s in DEMO_LIVE_STREAMS:
        if s["id"] == stream_id:
            return s
    raise HTTPException(status_code=404, detail="Stream not found")


@router.post("/{stream_id}/reminders")
async def toggle_stream_reminder(stream_id: str, payload: Optional[ReminderRequest] = None):
    # Check stream exists
    for s in DEMO_LIVE_STREAMS:
        if s["id"] == stream_id:
            return {"status": "success", "streamId": stream_id, "message": "Reminder state updated"}
    raise HTTPException(status_code=404, detail="Stream not found")

"""Pydantic schemas for Phase 4: Live Pushkaralu & Video Streaming."""

from typing import Optional
from pydantic import BaseModel


class LiveStreamBase(BaseModel):
    id: str
    slug: str
    titleTe: str
    titleEn: str
    descTe: str
    descEn: str
    category: str
    categoryLabelTe: str
    categoryLabelEn: str
    venueTe: str
    venueEn: str
    locationReference: Optional[str] = None
    thumbnailUrl: str
    videoProvider: str = "youtube"
    videoId: str
    embedUrl: Optional[str] = None
    language: str = "all"
    scheduledStart: str
    scheduledEnd: str
    status: str
    viewerCount: Optional[str] = None
    isPublished: bool = True
    isAuthorized: bool = True
    isDemo: bool = True
    featured: Optional[bool] = False
    duration: Optional[str] = None
    recordingDate: Optional[str] = None

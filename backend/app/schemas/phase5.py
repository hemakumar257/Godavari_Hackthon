"""Pydantic schemas for Phase 5: Heritage Explorer & Yatra Planner."""

from typing import List, Optional
from pydantic import BaseModel, Field


class Coordinates(BaseModel):
    lat: float
    lng: float


class VisitingInfo(BaseModel):
    bestTimeToVisitTe: str
    bestTimeToVisitEn: str
    timingsTe: str
    timingsEn: str
    entryFeeTe: str
    entryFeeEn: str
    dressCodeTe: Optional[str] = None
    dressCodeEn: Optional[str] = None
    photographyAllowed: Optional[bool] = True


class NearbyReference(BaseModel):
    id: str
    nameTe: str
    nameEn: str


class HeritageLocationBase(BaseModel):
    id: str
    slug: str
    nameTe: str
    nameEn: str
    category: str
    categoryLabelTe: str
    categoryLabelEn: str
    shortDescTe: str
    shortDescEn: str
    fullDescTe: str
    fullDescEn: str
    historicalSignificanceTe: str
    historicalSignificanceEn: str
    spiritualSignificanceTe: str
    spiritualSignificanceEn: str
    culturalSignificanceTe: str
    culturalSignificanceEn: str
    storiesAndLegendsTe: List[str] = []
    storiesAndLegendsEn: List[str] = []
    imageUrl: str
    gallery: List[str] = []
    coordinates: Coordinates
    addressTe: str
    addressEn: str
    visitingInfo: VisitingInfo
    nearbyGhats: Optional[List[NearbyReference]] = []
    nearbyTemples: Optional[List[NearbyReference]] = []
    isFeatured: Optional[bool] = False
    isVerified: bool = True
    isDemo: bool = True


class HeritageStoryBase(BaseModel):
    id: str
    slug: str
    titleTe: str
    titleEn: str
    category: str
    categoryLabelTe: str
    categoryLabelEn: str
    introductionTe: str
    introductionEn: str
    contentTe: List[str] = []
    contentEn: List[str] = []
    coverImage: str
    readingTimeMinutes: int = 4
    relatedLocations: Optional[List[str]] = []
    isPublished: bool = True
    isDemo: bool = True


# ─── Yatra Itinerary Schemas ───

class YatraStopBase(BaseModel):
    stopId: str
    referenceType: str
    referenceId: str
    nameTe: str
    nameEn: str
    categoryLabelTe: str
    categoryLabelEn: str
    thumbnailUrl: str
    coordinates: Coordinates
    sequence: int
    plannedArrivalTime: Optional[str] = None
    estimatedDurationMinutes: int = 60
    customNotes: Optional[str] = None
    addressTe: Optional[str] = None
    addressEn: Optional[str] = None


class YatraPreferences(BaseModel):
    categories: List[str] = []
    pace: str = "moderate"
    interests: Optional[List[str]] = []


class YatraItineraryBase(BaseModel):
    id: str
    title: str
    description: str
    startDate: str
    endDate: Optional[str] = None
    startingLocation: str
    preferences: YatraPreferences
    stops: List[YatraStopBase] = []
    totalDurationHours: Optional[float] = 8.0
    isTemplate: Optional[bool] = False
    isDemo: Optional[bool] = True
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None


class SuggestedYatraTemplateBase(BaseModel):
    id: str
    slug: str
    titleTe: str
    titleEn: str
    descTe: str
    descEn: str
    durationLabelTe: str
    durationLabelEn: str
    badgeTe: str
    badgeEn: str
    thumbnailUrl: str
    tagsTe: List[str] = []
    tagsEn: List[str] = []
    totalStops: int
    stops: List[YatraStopBase] = []

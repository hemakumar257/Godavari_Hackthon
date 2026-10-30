"""Pydantic schemas for Phase 2: Events, Ghats, Temples, Parking, Facilities."""

from typing import List, Optional
from pydantic import BaseModel, Field


class Coordinates(BaseModel):
    lat: float
    lng: float


# --- Event Schemas ---
class EventBase(BaseModel):
    id: str
    titleTe: str
    titleEn: str
    descTe: str
    descEn: str
    date: str
    startTime: str
    endTime: str
    venueTe: str
    venueEn: str
    category: str
    categoryLabelTe: str
    categoryLabelEn: str
    coordinates: Coordinates
    status: str
    imageUrl: str
    isDemo: bool = True
    isFeatured: Optional[bool] = False


# --- Ghat Schemas ---
class GhatBase(BaseModel):
    id: str
    nameTe: str
    nameEn: str
    descTe: str
    descEn: str
    addressTe: str
    addressEn: str
    coordinates: Coordinates
    status: str
    crowdStatus: str
    crowdPercentage: int
    isAccessible: bool
    hasChangingRooms: bool
    hasMedicalCamp: bool
    imageUrl: str
    amenities: List[str] = []
    nearbyLandmark: str
    safeDepthInfo: str
    isDemo: bool = True


# --- Temple Schemas ---
class TempleBase(BaseModel):
    id: str
    nameTe: str
    nameEn: str
    descTe: str
    descEn: str
    addressTe: str
    addressEn: str
    coordinates: Coordinates
    timings: str
    deity: str
    imageUrl: str
    isDemo: bool = True


# --- Parking Schemas ---
class ParkingBase(BaseModel):
    id: str
    nameTe: str
    nameEn: str
    addressTe: str
    addressEn: str
    coordinates: Coordinates
    status: str
    totalCapacity: int
    availableSlots: int
    vehicleTypes: List[str] = []
    distanceToGhatKm: float
    nearestGhatEn: str
    imageUrl: str
    isDemo: bool = True


# --- Facility Schemas ---
class FacilityBase(BaseModel):
    id: str
    nameTe: str
    nameEn: str
    category: str
    categoryLabelTe: str
    categoryLabelEn: str
    addressTe: str
    addressEn: str
    coordinates: Coordinates
    isOpen: bool
    operatingHours: str
    contactNumber: Optional[str] = None
    imageUrl: str
    isDemo: bool = True

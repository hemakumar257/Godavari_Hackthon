"""Pydantic schemas for Phase 3: Medical Camps, Hospitals, Police Desks, and Reports."""

from typing import List, Optional
from pydantic import BaseModel, Field


class Coordinates(BaseModel):
    lat: float
    lng: float


# --- Medical Camp Schemas ---
class MedicalCampBase(BaseModel):
    id: str
    nameTe: str
    nameEn: str
    descTe: str
    descEn: str
    addressTe: str
    addressEn: str
    coordinates: Coordinates
    phone: str
    services: List[str] = []
    serviceLabelsTe: List[str] = []
    serviceLabelsEn: List[str] = []
    status: str
    operatingHours: str
    lastUpdated: str
    isVerified: bool = True
    isDemo: bool = True
    doctorInCharge: Optional[str] = None
    ambulanceAvailable: bool = False
    imageUrl: str


# --- Hospital Schemas ---
class HospitalBase(BaseModel):
    id: str
    nameTe: str
    nameEn: str
    descTe: str
    descEn: str
    addressTe: str
    addressEn: str
    coordinates: Coordinates
    phone: str
    emergencyPhone: str
    services: List[str] = []
    hasEmergency: bool = True
    bedCapacity: int
    isGovernment: bool = True
    isDemo: bool = True
    imageUrl: str


# --- Police Help Desk Schemas ---
class PoliceDeskBase(BaseModel):
    id: str
    nameTe: str
    nameEn: str
    descTe: str
    descEn: str
    addressTe: str
    addressEn: str
    coordinates: Coordinates
    phone: str
    operatingHours: str
    status: str
    services: List[str] = []
    serviceLabelsTe: List[str] = []
    serviceLabelsEn: List[str] = []
    isVerified: bool = True
    lastUpdated: str
    isDemo: bool = True
    officerInCharge: Optional[str] = None
    imageUrl: str


# --- Lost & Found Schemas ---
class LostFoundCreate(BaseModel):
    type: str  # 'lost' | 'found'
    category: str
    itemName: str
    description: str
    approximateDateTime: str
    locationName: str
    contactName: str
    contactPhone: str
    contactEmail: Optional[str] = None
    imageBase64: Optional[str] = None


class LostFoundResponse(BaseModel):
    reportId: str
    status: str
    message: str


# --- Missing Person Schemas ---
class MissingPersonCreate(BaseModel):
    personName: str
    ageRange: str
    gender: str
    description: Optional[str] = ""
    clothingDescription: str
    lastKnownLocation: str
    approximateDateTime: str
    reporterName: str
    reporterPhone: str
    reporterRelation: str
    imageBase64: Optional[str] = None


class MissingPersonResponse(BaseModel):
    reportId: str
    status: str
    message: str


# --- Incident Report Schemas ---
class IncidentReportCreate(BaseModel):
    category: str
    title: str
    description: str
    locationName: str
    coordinates: Optional[Coordinates] = None
    incidentDateTime: str
    reporterName: str
    reporterPhone: str
    reporterEmail: Optional[str] = None
    imageBase64: Optional[str] = None


class IncidentReportResponse(BaseModel):
    reportId: str
    status: str
    message: str


# --- Public-Safe Tracking Schemas ---
class StatusTimelineEvent(BaseModel):
    status: str
    statusLabelTe: str
    statusLabelEn: str
    timestamp: str
    publicNotesTe: str
    publicNotesEn: str


class ReportTrackingResponse(BaseModel):
    reportId: str
    reportType: str
    categoryLabelTe: str
    categoryLabelEn: str
    title: str
    submissionDate: str
    currentStatus: str
    statusTimeline: List[StatusTimelineEvent] = []
    lastUpdated: str
    publicMessageTe: str
    publicMessageEn: str

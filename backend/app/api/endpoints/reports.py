"""Reports, Lost & Found, Missing Persons, and Incident Tracking Endpoints."""

import random
from datetime import datetime
from fastapi import APIRouter, HTTPException
from app.schemas.phase3 import (
    LostFoundCreate,
    LostFoundResponse,
    MissingPersonCreate,
    MissingPersonResponse,
    IncidentReportCreate,
    IncidentReportResponse,
    ReportTrackingResponse,
)
from app.data.demo_phase3 import REPORTS_DB

router = APIRouter(tags=["Reports & Safety Tracking"])


@router.post("/lost-found", response_model=LostFoundResponse)
async def submit_lost_found(report: LostFoundCreate):
    report_id = f"LF-2027-{random.randint(100000, 999999)}"
    now = datetime.now().strftime("%Y-%m-%d %I:%M %p")

    # Store in reports store with public-safe timeline
    REPORTS_DB[report_id] = {
        "reportId": report_id,
        "reportType": "lost_found",
        "categoryLabelTe": report.category,
        "categoryLabelEn": report.category,
        "title": f"{report.type.upper()}: {report.itemName}",
        "submissionDate": now,
        "currentStatus": "submitted",
        "statusTimeline": [
            {
                "status": "submitted",
                "statusLabelTe": "సమర్పించబడింది",
                "statusLabelEn": "Report Submitted",
                "timestamp": now,
                "publicNotesTe": "మీ వస్తువు నివేదిక డిజిటల్ సిస్టమ్‌లో నమోదైంది.",
                "publicNotesEn": "Your item report has been logged and queued for property verification.",
            }
        ],
        "lastUpdated": now,
        "publicMessageTe": "నివేదిక నమోదు చేయబడింది. సరిపోలిన వివరాలు లభిస్తే పరిశీలిస్తాము.",
        "publicMessageEn": "Logged in registry. We will match with turned-in properties.",
    }

    return LostFoundResponse(
        reportId=report_id,
        status="submitted",
        message="Lost and found report successfully submitted",
    )


@router.post("/missing-person-reports", response_model=MissingPersonResponse)
async def submit_missing_person(report: MissingPersonCreate):
    report_id = f"MP-2027-{random.randint(100000, 999999)}"
    now = datetime.now().strftime("%Y-%m-%d %I:%M %p")

    REPORTS_DB[report_id] = {
        "reportId": report_id,
        "reportType": "missing_person",
        "categoryLabelTe": "తప్పిపోయిన వ్యక్తి సహాయం",
        "categoryLabelEn": "Missing Person Assistance",
        "title": f"Missing: {report.personName} ({report.ageRange})",
        "submissionDate": now,
        "currentStatus": "submitted",
        "statusTimeline": [
            {
                "status": "submitted",
                "statusLabelTe": "అత్యవసర సమాచారం అందింది",
                "statusLabelEn": "High Priority Alert Received",
                "timestamp": now,
                "publicNotesTe": "వివరాలు ఘాట్ పబ్లిక్ అనౌన్స్‌మెంట్ టీమ్‌కు పంపబడ్డాయి.",
                "publicNotesEn": "Particulars relayed to pushkaralu field dispatch & announcement staff.",
            }
        ],
        "lastUpdated": now,
        "publicMessageTe": "అలర్ట్ నమోదు చేయబడింది. తక్షణ సహాయం కోసం సమీప పోలీస్ డెస్క్ లేదా 100 కు కాల్ చేయండి.",
        "publicMessageEn": "Urgent alert registered. Please coordinate with the nearest on-site police desk.",
    }

    return MissingPersonResponse(
        reportId=report_id,
        status="submitted",
        message="Missing person emergency report submitted",
    )


@router.post("/reports", response_model=IncidentReportResponse)
async def submit_incident_report(report: IncidentReportCreate):
    report_id = f"INC-2027-{random.randint(100000, 999999)}"
    now = datetime.now().strftime("%Y-%m-%d %I:%M %p")

    REPORTS_DB[report_id] = {
        "reportId": report_id,
        "reportType": "incident",
        "categoryLabelTe": report.category,
        "categoryLabelEn": report.category,
        "title": report.title,
        "submissionDate": now,
        "currentStatus": "submitted",
        "statusTimeline": [
            {
                "status": "submitted",
                "statusLabelTe": "నివేదిక అందింది",
                "statusLabelEn": "Report Received",
                "timestamp": now,
                "publicNotesTe": "సమస్య వివరాలు నమోదయ్యాయి.",
                "publicNotesEn": "Digital incident report queued for field review.",
            }
        ],
        "lastUpdated": now,
        "publicMessageTe": "సమస్య నమోదు చేయబడింది. సమీప క్షేత్రస్థాయి బృందానికి చేరింది.",
        "publicMessageEn": "Incident dispatched to festival sector response teams.",
    }

    return IncidentReportResponse(
        reportId=report_id,
        status="submitted",
        message="Incident report successfully submitted",
    )


@router.get("/reports/{report_id}/status", response_model=ReportTrackingResponse)
async def get_report_tracking(report_id: str):
    clean_id = report_id.strip().upper()
    if clean_id in REPORTS_DB:
        return REPORTS_DB[clean_id]
    raise HTTPException(status_code=404, detail="Report ID not found in registry")

"""Unit tests for Phase 3: Medical Camps, Hospitals, Police Desks, and Safety Reporting."""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_get_medical_camps():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/medical-camps")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "doctorInCharge" in data[0]
    assert data[0]["isDemo"] is True


@pytest.mark.asyncio
async def test_get_medical_camp_detail():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/medical-camps/camp-001")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "camp-001"
    assert "coordinates" in data


@pytest.mark.asyncio
async def test_get_hospitals():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/hospitals")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert "bedCapacity" in data[0]


@pytest.mark.asyncio
async def test_get_police_desks():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/police-desks")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0


@pytest.mark.asyncio
async def test_submit_lost_found():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {
            "type": "lost",
            "category": "mobile",
            "itemName": "OnePlus 9 Pro",
            "description": "Black back cover with river photo sticker",
            "approximateDateTime": "2027-07-15 10:00 AM",
            "locationName": "Pushkar Ghat",
            "contactName": "K. Srinivas",
            "contactPhone": "9876543210",
        }
        response = await ac.post("/api/lost-found", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reportId" in data
    assert data["reportId"].startswith("LF-2027-")
    assert data["status"] == "submitted"


@pytest.mark.asyncio
async def test_submit_missing_person():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {
            "personName": "Anand Rao",
            "ageRange": "Senior Citizen (60+ yrs)",
            "gender": "Male",
            "description": "Wearing spectacles, speaks Telugu",
            "clothingDescription": "White kurta and brown dhoti",
            "lastKnownLocation": "Kotilingala Ghat main exit",
            "approximateDateTime": "2027-07-15 11:30 AM",
            "reporterName": "A. Krishna",
            "reporterPhone": "9848012345",
            "reporterRelation": "Son",
        }
        response = await ac.post("/api/missing-person-reports", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reportId" in data
    assert data["reportId"].startswith("MP-2027-")


@pytest.mark.asyncio
async def test_submit_incident_report():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {
            "category": "crowd_issue",
            "title": "Lane 4 bottleneck near changing area",
            "description": "High density at exit door 3",
            "locationName": "Meena Ghat",
            "incidentDateTime": "2027-07-15 12:00 PM",
            "reporterName": "P. Ramesh",
            "reporterPhone": "9988776655",
        }
        response = await ac.post("/api/reports", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reportId" in data
    assert data["reportId"].startswith("INC-2027-")


@pytest.mark.asyncio
async def test_track_report_status():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/reports/INC-2027-104921/status")
    assert response.status_code == 200
    data = response.json()
    assert data["reportId"] == "INC-2027-104921"
    assert data["currentStatus"] == "in_progress"
    assert len(data["statusTimeline"]) > 0


@pytest.mark.asyncio
async def test_track_report_404():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/reports/UNKNOWN-999999/status")
    assert response.status_code == 404

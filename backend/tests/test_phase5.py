"""Tests for Phase 5: Heritage Explorer & Personal Yatra Planner."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_list_heritage_locations():
    response = client.get("/api/heritage")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 3
    for item in data:
        assert item["isDemo"] is True
        assert "slug" in item
        assert "coordinates" in item


def test_get_heritage_by_slug():
    response = client.get("/api/heritage/dowleswaram-barrage-cotton-museum")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "dowleswaram-barrage-cotton-museum"
    assert "Cotton" in data["nameEn"]


def test_heritage_not_found():
    response = client.get("/api/heritage/non-existent-heritage-place")
    assert response.status_code == 404


def test_heritage_categories():
    response = client.get("/api/heritage/categories")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5


def test_heritage_stories():
    response = client.get("/api/heritage/stories")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2


def test_get_heritage_story_by_slug():
    response = client.get("/api/heritage/stories/origin-of-godavari-river-and-rishi-gowtama")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "origin-of-godavari-river-and-rishi-gowtama"
    assert len(data["contentTe"]) >= 1


def test_yatra_templates():
    response = client.get("/api/yatras/templates")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["totalStops"] >= 2


def test_create_and_get_yatra():
    payload = {
        "id": "test-yatra-123",
        "title": "My Test Pilgrimage",
        "description": "Custom pilgrimage test",
        "startDate": "2027-07-16",
        "startingLocation": "Rajahmundry",
        "preferences": {"categories": ["ghat", "temple"], "pace": "moderate"},
        "stops": [
            {
                "stopId": "s-1",
                "referenceType": "ghat",
                "referenceId": "ghat-001",
                "nameTe": "కోటిలింగాల రేవు",
                "nameEn": "Kotilingala Revu",
                "categoryLabelTe": "ఘాట్",
                "categoryLabelEn": "Ghat",
                "thumbnailUrl": "/images/godavari/512c7d28382287.55bde5d0767b5.webp",
                "coordinates": {"lat": 17.022, "lng": 81.761},
                "sequence": 1,
                "plannedArrivalTime": "07:00 AM",
                "estimatedDurationMinutes": 60
            }
        ]
    }
    # Create
    post_res = client.post("/api/yatras", json=payload)
    assert post_res.status_code == 200
    # Retrieve
    get_res = client.get("/api/yatras/test-yatra-123")
    assert get_res.status_code == 200
    assert get_res.json()["title"] == "My Test Pilgrimage"
    # Delete
    del_res = client.delete("/api/yatras/test-yatra-123")
    assert del_res.status_code == 200

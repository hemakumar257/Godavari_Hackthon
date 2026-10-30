"""Tests for Phase 4: Live Pushkaralu & Video Streaming Endpoints."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_list_live_streams():
    response = client.get("/api/live-streams")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 7
    # Assert every entry is tagged with demo indicator
    for item in data:
        assert item["isDemo"] is True
        assert "videoId" in item
        assert "videoProvider" in item


def test_list_live_streams_filter_status():
    response = client.get("/api/live-streams?status=LIVE")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    for item in data:
        assert item["status"] == "LIVE"


def test_list_upcoming_streams():
    response = client.get("/api/live-streams/upcoming")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    for item in data:
        assert item["status"] == "UPCOMING"


def test_list_recordings():
    response = client.get("/api/live-streams/recordings")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    for item in data:
        assert item["status"] == "ENDED"


def test_get_live_stream_by_id():
    response = client.get("/api/live-streams/stream-001")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "stream-001"
    assert "Maha Harati" in data["titleEn"]


def test_get_live_stream_not_found():
    response = client.get("/api/live-streams/stream-nonexistent")
    assert response.status_code == 404


def test_toggle_reminder():
    response = client.post(
        "/api/live-streams/stream-003/reminders",
        json={"streamId": "stream-003", "streamTitleEn": "Test", "scheduledStart": "2027-07-16T06:00:00Z"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"

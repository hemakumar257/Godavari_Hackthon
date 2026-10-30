"""Tests for Phase 2 Endpoints: Events, Ghats, Temples, Parking, Facilities."""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_get_events():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/events")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "titleEn" in data[0]
    assert data[0]["isDemo"] is True


@pytest.mark.asyncio
async def test_get_event_detail():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/events/evt-001")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "evt-001"
    assert "coordinates" in data


@pytest.mark.asyncio
async def test_get_ghats():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/ghats")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["isDemo"] is True


@pytest.mark.asyncio
async def test_get_temples():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/temples")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0


@pytest.mark.asyncio
async def test_get_parking():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/parking")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0


@pytest.mark.asyncio
async def test_get_facilities():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/facilities")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

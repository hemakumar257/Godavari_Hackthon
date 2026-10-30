import pytest
import httpx
from app.main import app

@pytest.fixture
def client():
    transport = httpx.ASGITransport(app=app)
    return httpx.AsyncClient(transport=transport, base_url="http://test")


@pytest.mark.asyncio
async def test_root_endpoint(client):
    async with client as c:
        response = await c.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "Godavari Pushkaralu 2027" in data["name"]
        assert data["status"] == "operational"
        assert data["health_endpoint"] == "/api/health"


@pytest.mark.asyncio
async def test_health_endpoint(client):
    async with client as c:
        response = await c.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "database" in data
        assert data["database"]["type"] == "MongoDB"
        assert data["database"]["connected"] is False
        assert "Database not configured" in data["database"]["message"]


@pytest.mark.asyncio
async def test_cors_preflight(client):
    async with client as c:
        response = await c.options(
            "/api/health",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "GET",
            },
        )
        assert response.status_code == 200
        assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"

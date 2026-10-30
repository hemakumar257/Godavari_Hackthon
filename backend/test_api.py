import sys
import io
import asyncio
import httpx
from app.main import app

# Ensure utf-8 output encoding on Windows consoles
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

async def run_tests():
    print("Testing FastAPI endpoints using httpx AsyncClient...")
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Test 1: Root endpoint
        root_res = await client.get("/")
        print("1. Root Endpoint Status:", root_res.status_code)
        assert root_res.status_code == 200
        root_data = root_res.json()
        print("   Title:", root_data["title"])
        print("   Name:", root_data["name"])
        print("   Version:", root_data["version"])
        print("   Status:", root_data["status"])
        assert "Godavari Pushkaralu 2027" in root_data["name"]

        # Test 2: Health check endpoint
        health_res = await client.get("/api/health")
        print("\n2. Health Endpoint Status:", health_res.status_code)
        assert health_res.status_code == 200
        health_data = health_res.json()
        print("   Overall Status:", health_data["status"])
        print("   Database Connected:", health_data["database"]["connected"])
        print("   Database Configured:", health_data["database"]["configured"])
        print("   Database Message:", health_data["database"]["message"])
        assert health_data["database"]["type"] == "MongoDB"
        assert health_data["database"]["connected"] is False  # Safe Phase 1 degradation

    print("\nAll FastAPI endpoints and health-checks passed successfully!")

if __name__ == "__main__":
    asyncio.run(run_tests())

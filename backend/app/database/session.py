import asyncio
import logging
from typing import Optional, Dict, Any
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

logger = logging.getLogger("godavari.database")

class DatabaseManager:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None

    async def connect(self) -> None:
        if not settings.MONGODB_URL or settings.MONGODB_URL.strip() == "":
            logger.warning(
                "MONGODB_URL is not set. Database-backed features will remain disabled until configured."
            )
            self.client = None
            self.db = None
            return

        try:
            logger.info("Initializing connection to MongoDB...")
            self.client = AsyncIOMotorClient(
                settings.MONGODB_URL,
                serverSelectionTimeoutMS=2500,
            )
            self.db = self.client[settings.DATABASE_NAME]
            # Quick ping to check reachability
            await self.client.admin.command("ping")
            logger.info("Successfully connected to MongoDB database: %s", settings.DATABASE_NAME)
        except Exception as exc:
            logger.error("Failed to connect to MongoDB: %s", exc)
            self.client = None
            self.db = None

    async def disconnect(self) -> None:
        if self.client:
            logger.info("Closing MongoDB connection pool.")
            self.client.close()
            self.client = None
            self.db = None

    async def check_status(self) -> Dict[str, Any]:
        if not settings.MONGODB_URL or settings.MONGODB_URL.strip() == "":
            return {
                "connected": False,
                "configured": False,
                "type": "MongoDB",
                "message": "Database not configured (MONGODB_URL empty). Non-database features are active.",
            }

        if self.client is None:
            return {
                "connected": False,
                "configured": True,
                "type": "MongoDB",
                "message": "MongoDB client uninitialized or connection failed.",
            }

        try:
            await asyncio.wait_for(self.client.admin.command("ping"), timeout=1.5)
            return {
                "connected": True,
                "configured": True,
                "type": "MongoDB",
                "database_name": settings.DATABASE_NAME,
                "message": "MongoDB connection active and responsive.",
            }
        except Exception as exc:
            return {
                "connected": False,
                "configured": True,
                "type": "MongoDB",
                "message": f"Connection unreachable or timed out: {str(exc)}",
            }


db_manager = DatabaseManager()

def get_database() -> Optional[AsyncIOMotorDatabase]:
    return db_manager.db

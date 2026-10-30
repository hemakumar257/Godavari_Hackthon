import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.database.session import db_manager
from app.api.router import api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("godavari.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: attempt database connection if configured
    logger.info("Starting up %s (Version: %s)...", settings.PROJECT_NAME, settings.VERSION)
    await db_manager.connect()
    yield
    # Shutdown: clean up resources
    logger.info("Shutting down %s...", settings.PROJECT_NAME)
    await db_manager.disconnect()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Integrated Digital Pilgrim Experience and Heritage Access Platform for Godavari Pushkaralu 2027.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
origins = settings.cors_origins_list
logger.info("Configuring CORS for origins: %s", origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global unhandled error handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled error processing request %s: %s", request.url, exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An internal server error occurred.",
            "error_type": exc.__class__.__name__,
        },
    )

# Attach API routes under /api
app.include_router(api_router, prefix=settings.API_PREFIX)


@app.get("/")
async def root():
    """Welcome endpoint providing platform metadata and navigation links."""
    return {
        "title": "గోదావరి పుష్కరాలు 2027 API",
        "name": "Godavari Pushkaralu 2027 Digital Platform API",
        "tagline": "మీ పుష్కర యాత్రకు డిజిటల్ మార్గదర్శి",
        "version": settings.VERSION,
        "status": "operational",
        "documentation": "/docs",
        "health_endpoint": f"{settings.API_PREFIX}/health",
    }

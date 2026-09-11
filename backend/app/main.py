import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from .database import engine
from .routers import alerts, dashboard, facilities


load_dotenv()


app = FastAPI(
    title="Smart Facility Monitoring API",
    description=(
        "REST API for the Smart Facility Monitoring Dashboard."
    ),
    version="1.0.0",
)


# =========================================================
# CORS
# =========================================================

cors_origins_string = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:4200,http://127.0.0.1:4200",
)

cors_origins = [
    origin.strip()
    for origin in cors_origins_string.split(",")
    if origin.strip()
]

# Treat the loopback hostname and address as equivalent local development origins.
for local_origin in ("http://localhost:4200", "http://127.0.0.1:4200"):
    if local_origin not in cors_origins:
        cors_origins.append(local_origin)


app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# Routers
# =========================================================

app.include_router(
    alerts.router
)

app.include_router(
    facilities.router
)

app.include_router(
    dashboard.router
)


# =========================================================
# Root
# =========================================================

@app.get("/")
def root():
    return {
        "message": "Smart Facility Monitoring API",
        "status": "running",
    }


# =========================================================
# Health Check
# =========================================================

@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(
                text("SELECT 1")
            )

        return {
            "status": "healthy",
            "database": "connected",
        }

    except Exception:
        return {
            "status": "unhealthy",
            "database": "disconnected",
        }
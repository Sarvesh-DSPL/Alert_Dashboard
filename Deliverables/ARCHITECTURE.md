# Architecture

```text
┌───────────────────────────┐
│       Angular 22          │
│                           │
│ Components / Routing      │
│ Services / RxJS / Forms   │
└─────────────┬─────────────┘
              │ HTTP + JSON
              ▼
┌───────────────────────────┐
│          FastAPI          │
│                           │
│ Routers → Services        │
│ Pydantic → SQLAlchemy     │
└─────────────┬─────────────┘
              │ SQL
              ▼
┌───────────────────────────┐
│          MySQL            │
│                           │
│ facilities  ↔  alerts     │
└───────────────────────────┘
```

## Request flow

1. The Angular UI collects user actions and form data.
2. Angular services send HTTP requests to FastAPI.
3. FastAPI routers validate/route requests to service functions.
4. SQLAlchemy accesses MySQL.
5. FastAPI returns JSON.
6. Angular updates the displayed page.

## Main backend modules

- `main.py` — FastAPI application, CORS, router registration, root and health endpoints.
- `routers/alerts.py` — alert API endpoints.
- `routers/facilities.py` — facility API endpoints.
- `routers/dashboard.py` — dashboard endpoint.
- `services.py` — database/business operations.
- `schemas.py` — Pydantic request/response validation.
- `models.py` — SQLAlchemy database models.
- `database.py` — SQLAlchemy engine and request-scoped database sessions.

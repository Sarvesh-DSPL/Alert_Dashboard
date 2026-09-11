# Smart Facility Monitoring Dashboard

A full-stack facility monitoring application built with **Angular 22** (frontend) and **Python FastAPI** (backend), backed by **MySQL**.

> **Note on backend technology:** The original assessment specifies Node.js + Express. This implementation intentionally uses Python + FastAPI instead. The REST contract, API behaviour, Angular frontend, and MySQL database remain fully compliant with the assessment requirements.

---

## Features

- **Dashboard** — live stat cards (total / critical / active / resolved alerts) and recent alerts list
- **Alert Management** — searchable, filterable table with server-side filtering by text, facility, severity, status, and date range
- **Alert Details** — full detail view with one-click status transitions (Active → Acknowledged → Resolved)
- **Create Alert** — Angular Reactive Form with full validation, submitting state, and error handling
- **Facility Management** — responsive card grid showing area count, camera count, and active alert count
- **Facility Details** — facility summary, monitored areas list, and all associated alerts
- **Loading / Error / Empty states** on every API-driven screen
- **Responsive design** — desktop sidebar layout, tablet and mobile friendly

---

## Architecture

```
Angular (port 4200)
       |  HTTP REST
       v
FastAPI (port 8000)
       |  SQLAlchemy ORM
       v
MySQL (port 3306)
```

---

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | Angular 22, TypeScript, SCSS            |
| Backend  | Python 3.12, FastAPI, Pydantic v2       |
| ORM      | SQLAlchemy 2.0                          |
| Database | MySQL / MariaDB                         |
| Server   | Uvicorn                                 |

---

## Prerequisites

- Node.js ≥ 20 and npm
- Python 3.11+
- MySQL or MariaDB running locally

---

## Database Setup

```bash
# 1. Log in to MySQL
mysql -u root -p

# 2. Run the schema (creates database + tables)
source database/schema.sql

# 3. Load seed data
source database/seed.sql
```

---

## Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and set your MySQL credentials

# Start the API server
uvicorn app.main:app --reload --port 8000
```

API docs available at: `http://localhost:8000/docs`

---

## Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm start
```

Application available at: `http://localhost:4200`

---

## Environment Variables

### Backend (`backend/.env`)

| Variable        | Description                          | Default                     |
|-----------------|--------------------------------------|-----------------------------|
| `DATABASE_URL`  | Full SQLAlchemy connection URL       | —                           |
| `MYSQL_USER`    | MySQL username (if no DATABASE_URL)  | `root`                      |
| `MYSQL_PASSWORD`| MySQL password                       | *DsplSql2004*                   |
| `MYSQL_HOST`    | MySQL host                           | `localhost`                 |
| `MYSQL_PORT`    | MySQL port                           | `3306`                      |
| `MYSQL_DATABASE`| Database name                        | `smart_facility_monitoring` |
| `CORS_ORIGINS`  | Comma-separated allowed origins      | `http://localhost:4200`     |

---

## API Reference

### Dashboard

| Method | Path                    | Description            |
|--------|-------------------------|------------------------|
| GET    | `/api/dashboard/stats`  | Dashboard statistics   |

### Alerts

| Method | Path                    | Description            |
|--------|-------------------------|------------------------|
| GET    | `/api/alerts`           | List alerts (filterable)|
| GET    | `/api/alerts/options`   | Available alert types  |
| GET    | `/api/alerts/{id}`      | Get alert by ID        |
| POST   | `/api/alerts`           | Create new alert       |
| PUT    | `/api/alerts/{id}`      | Update alert           |

**GET /api/alerts query params:** `search`, `facilityId`, `severity`, `status`, `fromDate`, `toDate`

### Facilities

| Method | Path                          | Description              |
|--------|-------------------------------|--------------------------|
| GET    | `/api/facilities`             | List all facilities      |
| GET    | `/api/facilities/{id}`        | Get facility by ID       |
| GET    | `/api/facilities/{id}/areas`  | Get facility areas       |

---

## Known Limitations

- No authentication or authorization
- No pagination (all alerts returned in one response)
- `active_alert_count` counts only `Active` status (not `Acknowledged`)
- Backend intentionally uses FastAPI instead of the assessment's Node.js + Express

---

## Folder Structure

```
smart-facility-monitoring/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── services.py
│   │   └── routers/
│   │       ├── alerts.py
│   │       ├── facilities.py
│   │       └── dashboard.py
│   ├── requirements.txt
│   └── .env.example
├── database/
│   ├── schema.sql
│   └── seed.sql
├── frontend/
│   └── src/app/
│       ├── core/         (layout, services)
│       ├── features/     (dashboard, alerts, facilities)
│       ├── models/       (TypeScript interfaces)
│       └── shared/       (reusable components)
└── README.md
```

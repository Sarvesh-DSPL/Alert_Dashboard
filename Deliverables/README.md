# Smart Facility Monitoring System

## 1. Project Overview

Smart Facility Monitoring is a web application for monitoring facilities and managing operational alerts.

### Technology stack

| Layer | Technology |
|---|---|
| Frontend | Angular 22, TypeScript, Reactive Forms, RxJS, SCSS |
| Backend | FastAPI, Python, SQLAlchemy |
| Database | MySQL |
| Database driver | PyMySQL |
| API style | REST / JSON |
| Frontend API base | `http://localhost:8000/api` |
| Frontend development server | `http://localhost:4200` |

The frontend is a standalone Angular application. It communicates with the FastAPI REST API, which uses SQLAlchemy to read and write data in MySQL.

---

## 2. Repository Structure

The supplied project contains two applications:

```text
project/
├── frontend/                  # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── layout/
│   │   │   │   └── services/
│   │   │   ├── features/
│   │   │   │   ├── alerts/
│   │   │   │   ├── dashboard/
│   │   │   │   └── facilities/
│   │   │   ├── models/
│   │   │   └── environments/
│   │   └── styles.scss
│   ├── package.json
│   └── angular.json
│
├── backend/                   # FastAPI application
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
│
└── database_setup.sql         # Database/table creation script
```

The original archives also contained generated/dependency folders such as `node_modules`, Angular cache/build output, and a Python virtual environment. These are not required for source-code setup and are intentionally not reproduced in the documentation package.

---

# 3. Prerequisites

Install the following before starting:

- **Node.js + npm** compatible with Angular 22
- **Python 3.11+** (the supplied backend virtual environment indicates Python 3.12 was used)
- **MySQL Server 8.x** or a compatible MySQL installation
- A terminal such as PowerShell, Command Prompt, or Bash

Verify installations:

```bash
node --version
npm --version
python --version
mysql --version
```

---

# 4. Database Setup

## Step 1 — Start MySQL

Start the MySQL server and make sure it is accepting connections on port `3306` unless you use another port.

## Step 2 — Create the database and tables

The supplied backend models define two tables:

- `facilities`
- `alerts`

Use the included `database_setup.sql` file:

```bash
mysql -u root -p < database_setup.sql
```

On Windows PowerShell, if shell redirection is inconvenient, open MySQL and run the statements from `database_setup.sql`.

The script creates the database:

```text
smart_facility_monitoring
```

and the required tables.

## Step 3 — Add facility data

The application expects facility records to exist before useful alert creation can take place. There is no seed-data script in the supplied source archive.

Add your own facility records, for example through MySQL:

```sql
USE smart_facility_monitoring;

INSERT INTO facilities
    (name, location, area_count, camera_count, areas)
VALUES
    (
        'Main Facility',
        'Pune',
        3,
        12,
        '["Entrance", "Warehouse", "Parking"]'
    );
```

You can add more facilities as required.

---

# 5. Backend Setup

Open a terminal in the backend directory:

```bash
cd backend
```

## Step 1 — Create a Python virtual environment

If you do not already have one:

### Windows

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, you can use Command Prompt:

```cmd
.venv\Scripts\activate
```

### macOS/Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
```

## Step 2 — Install dependencies

```bash
pip install -r requirements.txt
```

The supplied requirements include FastAPI/Uvicorn, SQLAlchemy, PyMySQL, Pydantic and python-dotenv.

## Step 3 — Configure environment variables

Copy `.env.example` to `.env`:

```text
.env.example -> .env
```

Then set your own MySQL credentials.

Example:

```env
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=smart_facility_monitoring

CORS_ORIGINS=http://localhost:4200
```

Alternatively, the backend supports a complete SQLAlchemy `DATABASE_URL`:

```env
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/smart_facility_monitoring
```

**Do not commit real passwords or other secrets to source control.**

## Step 4 — Start FastAPI

From the `backend` directory:

```bash
uvicorn app.main:app --reload
```

The API should be available at:

```text
http://localhost:8000
```

Useful checks:

```text
http://localhost:8000/
http://localhost:8000/health
http://localhost:8000/docs
```

FastAPI automatically provides interactive Swagger/OpenAPI documentation at `/docs`.

---

# 6. Frontend Setup

Open a second terminal in the frontend directory:

```bash
cd frontend
```

## Step 1 — Install npm packages

```bash
npm install
```

## Step 2 — Check the API URL

The supplied environment configuration uses:

```ts
apiBase: 'http://localhost:8000/api'
```

and service-specific URLs under:

```text
http://localhost:8000/api/facilities
http://localhost:8000/api/alerts
http://localhost:8000/api/dashboard/stats
```

If your backend runs on a different host or port, update:

```text
frontend/src/app/environments/environment.ts
```

## Step 3 — Start Angular

```bash
npm start
```

or:

```bash
ng serve
```

Open:

```text
http://localhost:4200
```

---

# 7. Recommended Startup Order

Use this order for local development:

1. Start MySQL.
2. Confirm the `smart_facility_monitoring` database and tables exist.
3. Start the FastAPI backend:
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```
4. Start Angular in another terminal:
   ```bash
   cd frontend
   npm start
   ```
5. Open `http://localhost:4200`.

---

# 8. Main Application Routes

The Angular router currently defines:

| Route | Purpose |
|---|---|
| `/dashboard` | Dashboard statistics and recent alerts |
| `/alerts` | Alert list and filtering |
| `/alerts/new` | Create-alert page |
| `/alerts/:id` | Alert details and status update |
| `/facilities` | Facility list |
| `/facilities/:id` | Facility details |

The empty route redirects to `/dashboard`.

---

# 9. API Summary

The backend exposes:

### General

- `GET /`
- `GET /health`

### Dashboard

- `GET /api/dashboard/stats`

### Facilities

- `GET /api/facilities`
- `GET /api/facilities/{facility_id}`
- `GET /api/facilities/{facility_id}/areas`

### Alerts

- `GET /api/alerts`
- `GET /api/alerts/options`
- `GET /api/alerts/{alert_id}`
- `POST /api/alerts`
- `PUT /api/alerts/{alert_id}`

See `API_REFERENCE.md` for request parameters, JSON examples, and common status codes.

---

# 10. Testing the API

The project can be tested with FastAPI's built-in Swagger UI:

```text
http://localhost:8000/docs
```

A typical test sequence is:

1. `GET /health`
2. `GET /api/facilities`
3. `GET /api/alerts/options`
4. `GET /api/alerts`
5. `GET /api/dashboard/stats`
6. `POST /api/alerts`
7. `GET /api/alerts/{alert_id}`
8. `PUT /api/alerts/{alert_id}`

For `POST /api/alerts`, use a facility ID that exists in the database and an area belonging to that facility.

---

# 11. Build and Test Commands

## Frontend production build

From `frontend`:

```bash
npm run build
```

## Frontend unit tests

```bash
npm test
```

The supplied project is configured for Angular's current application build/test tooling.

## Backend

The backend does not include a dedicated test suite in the supplied source archive. API behavior can be checked through Swagger UI and direct HTTP requests.

---

# 12. Architecture

```text
┌──────────────────────┐
│      Angular 22      │
│  UI + Routing + RxJS │
└──────────┬───────────┘
           │ HTTP / JSON
           ▼
┌──────────────────────┐
│      FastAPI         │
│ Routers + Services   │
│ Pydantic + SQLAlchemy│
└──────────┬───────────┘
           │ SQL
           ▼
┌──────────────────────┐
│        MySQL         │
│ facilities + alerts  │
└──────────────────────┘
```

A downloadable SVG version is included as `architecture.svg`.

---

# 13. Known Limitations / Assumptions

1. **No authentication/authorization layer is present in the supplied source.** The API endpoints are currently callable without a login/JWT dependency.
2. **Angular route protection is not configured.** The current routes do not define authentication guards.
3. **No database migration system is included.** Database/table creation is handled separately using the supplied SQL setup script.
4. **No seed-data module is included.** Facility data must be inserted manually or through a future administration/import workflow.
5. **Alert list pagination is client-side.** The backend returns the filtered alert collection, while the Angular list displays only the selected page-size slice.
6. **Dashboard statistics are calculated from the current database contents on request.** There is no caching layer.
7. **Date/time values use Python `datetime.now()` and MySQL `DateTime`; no explicit timezone strategy is implemented.**
8. **CORS is configured for local development.** Production deployments should replace local origins with the actual frontend origin.
9. **The supplied `.env` contains environment-specific configuration.** Keep it private and use `.env.example` as the shareable template.
10. **No production deployment configuration is included** (for example Docker/Compose, reverse proxy, HTTPS certificates, CI/CD, or cloud infrastructure).
11. **Alert types returned by `/api/alerts/options` are based on distinct types already stored in the database.** The Angular create form also maintains a default list and merges it with API results.
12. **Facility areas are stored as a JSON array in MySQL**, rather than in a separate normalized `facility_areas` table.

---

# 14. Important Security Note

For local development, the application is straightforward to run as described above. Before production deployment:

- Do not expose `.env` or database passwords.
- Use HTTPS.
- Restrict CORS to trusted frontend origins.
- Add authentication and authorization.
- Add server-side pagination/rate limiting where appropriate.
- Add database migrations.
- Add automated backend and frontend tests.
- Use a production application server/reverse proxy configuration.

---

## Documentation Package

This documentation package contains:

- `README.md` — setup and project overview
- `API_REFERENCE.md` — API endpoint reference
- `ARCHITECTURE.md` — short architecture explanation
- `architecture.svg` — downloadable architecture diagram
- `database_setup.sql` — MySQL database/table creation script

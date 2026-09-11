# API Reference — Smart Facility Monitoring

Base URL:

```text
http://localhost:8000
```

The API returns JSON unless otherwise noted.

Interactive Swagger UI:

```text
http://localhost:8000/docs
```

---

## General Endpoints

### GET `/`

Returns a basic API status message.

Example response:

```json
{
  "message": "Smart Facility Monitoring API",
  "status": "running"
}
```

### GET `/health`

Checks API/database connectivity.

Healthy response:

```json
{
  "status": "healthy",
  "database": "connected"
}
```

If the database check fails, the endpoint returns:

```json
{
  "status": "unhealthy",
  "database": "disconnected"
}
```

---

# Dashboard

## GET `/api/dashboard/stats`

Returns overall alert counts and the eight most recent alerts.

Example response:

```json
{
  "total": 20,
  "critical": 3,
  "active": 7,
  "resolved": 9,
  "acknowledged": 4,
  "recentAlerts": []
}
```

`recentAlerts` contains objects using the alert response structure below.

---

# Facilities

## GET `/api/facilities`

Returns all facilities ordered by name.

Example:

```json
[
  {
    "id": 1,
    "name": "Main Facility",
    "location": "Pune",
    "areaCount": 3,
    "cameraCount": 12,
    "activeAlertCount": 2,
    "areas": [
      "Entrance",
      "Warehouse",
      "Parking"
    ]
  }
]
```

## GET `/api/facilities/{facility_id}`

Returns one facility.

Example:

```text
GET /api/facilities/1
```

### Responses

- `200` — facility returned
- `404` — facility not found

---

## GET `/api/facilities/{facility_id}/areas`

Returns the configured areas for a facility.

Example:

```text
GET /api/facilities/1/areas
```

Response:

```json
{
  "facilityId": 1,
  "areas": [
    "Entrance",
    "Warehouse",
    "Parking"
  ]
}
```

### Responses

- `200` — areas returned
- `404` — facility not found

---

# Alerts

## Alert fields

A normal alert response has this structure:

```json
{
  "id": 1,
  "type": "Motion Detection",
  "facilityId": 1,
  "facilityName": "Main Facility",
  "area": "Entrance",
  "severity": "Medium",
  "status": "Active",
  "description": "Motion detected near the main entrance.",
  "createdAt": "2026-09-11T10:30:00",
  "updatedAt": "2026-09-11T10:30:00"
}
```

### Allowed severity values

```text
Low
Medium
High
Critical
```

### Allowed status values

```text
Active
Acknowledged
Resolved
```

---

## GET `/api/alerts`

Returns alerts with optional filters.

### Query parameters

| Parameter | Type | Description |
|---|---|---|
| `search` | string | Searches alert type, area, description, and facility name |
| `facilityId` | integer | Filters by facility |
| `severity` | enum | `Low`, `Medium`, `High`, `Critical` |
| `status` | enum | `Active`, `Acknowledged`, `Resolved` |
| `fromDate` | date | Includes alerts from this date |
| `toDate` | date | Includes alerts through this date |

Example:

```text
GET /api/alerts?severity=Critical&status=Active
```

Another example:

```text
GET /api/alerts?facilityId=1&fromDate=2026-09-01&toDate=2026-09-11
```

Response:

```json
{
  "items": [
    {
      "id": 1,
      "type": "Fire Detection",
      "facilityId": 1,
      "facilityName": "Main Facility",
      "area": "Warehouse",
      "severity": "Critical",
      "status": "Active",
      "description": "Smoke detected in the warehouse.",
      "createdAt": "2026-09-11T10:30:00",
      "updatedAt": "2026-09-11T10:30:00"
    }
  ],
  "total": 1
}
```

If both dates are supplied and `fromDate` is after `toDate`, the API returns `400`.

---

## GET `/api/alerts/options`

Returns values used by the alert creation form.

Response:

```json
{
  "types": [
    "Fire Detection",
    "Motion Detection"
  ],
  "severities": [
    "Low",
    "Medium",
    "High",
    "Critical"
  ],
  "statuses": [
    "Active",
    "Acknowledged",
    "Resolved"
  ]
}
```

The `types` array is generated from distinct alert types currently stored in the database. The Angular UI also has a default alert-type list.

---

## GET `/api/alerts/{alert_id}`

Returns one alert.

Example:

```text
GET /api/alerts/1
```

### Responses

- `200` — alert returned
- `404` — alert not found

---

## POST `/api/alerts`

Creates a new alert.

### Request body

```json
{
  "type": "Motion Detection",
  "facilityId": 1,
  "area": "Entrance",
  "severity": "Medium",
  "description": "Motion detected near the main entrance."
}
```

### Validation

- `type`: required, 1–150 characters
- `facilityId`: required, positive integer
- `area`: required, 1–150 characters
- `severity`: required enum
- `description`: required, 10–1000 characters

The selected facility must exist.

If the facility has configured areas, the supplied area must belong to that facility.

### Successful response

Status:

```text
201 Created
```

The response contains the newly created alert.

### Common errors

`404`:

```json
{
  "detail": "Facility not found."
}
```

`400`:

```json
{
  "detail": "Area is not available for the selected facility."
}
```

or:

```json
{
  "detail": "Alert type is not an allowed alert type."
}
```

---

## PUT `/api/alerts/{alert_id}`

Updates an existing alert.

Example:

```text
PUT /api/alerts/1
```

Request body:

```json
{
  "status": "Acknowledged"
}
```

Only the following fields are supported:

```json
{
  "status": "Resolved",
  "severity": "High",
  "description": "Updated description with at least 10 characters."
}
```

All fields are optional, so a partial update can be sent.

### Responses

- `200` — updated alert
- `404` — alert not found
- `422` — validation error

---

# HTTP Status Code Summary

| Status | Meaning |
|---|---|
| `200` | Successful request |
| `201` | Alert successfully created |
| `400` | Invalid request/business validation |
| `404` | Requested facility/alert does not exist |
| `422` | FastAPI/Pydantic request validation failed |
| `500` | Unexpected server error |

---

# Data Model Summary

## `facilities`

| Column | Type | Notes |
|---|---|---|
| `id` | integer | Primary key |
| `name` | varchar(150) | Required |
| `location` | varchar(255) | Required |
| `area_count` | integer | Required |
| `camera_count` | integer | Required |
| `areas` | JSON | Array of area names |

## `alerts`

| Column | Type | Notes |
|---|---|---|
| `id` | integer | Primary key |
| `type` | varchar(150) | Required |
| `facility_id` | integer | Foreign key to `facilities.id` |
| `area` | varchar(150) | Required |
| `severity` | enum | Low/Medium/High/Critical |
| `status` | enum | Active/Acknowledged/Resolved |
| `description` | text | Required |
| `created_at` | datetime | Required |
| `updated_at` | datetime | Required |

The relationship is:

```text
facilities 1 ─────────── * alerts
```

Deleting a facility cascades to its alerts at the database relationship level.

---

# Swagger / OpenAPI

FastAPI generates interactive API documentation automatically.

Open:

```text
http://localhost:8000/docs
```

Alternative OpenAPI JSON:

```text
http://localhost:8000/openapi.json
```

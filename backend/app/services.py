from datetime import date, datetime, time, timedelta
from typing import Optional

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, joinedload

from .models import Alert, Facility
from .schemas import (
    AlertCreate,
    AlertStatus,
    AlertUpdate,
    Severity,
)


# =========================================================
# ALERT HELPERS
# =========================================================

def alert_to_dict(alert: Alert) -> dict:
    return {
        "id": alert.id,
        "type": alert.type,
        "facilityId": alert.facility_id,
        "facilityName": alert.facility.name,
        "area": alert.area,
        "severity": alert.severity,
        "status": alert.status,
        "description": alert.description,
        "createdAt": alert.created_at,
        "updatedAt": alert.updated_at,
    }


def facility_to_dict(facility: Facility, active_alert_count: int) -> dict:
    return {
        "id": facility.id,
        "name": facility.name,
        "location": facility.location,
        "areaCount": facility.area_count,
        "cameraCount": facility.camera_count,
        "activeAlertCount": active_alert_count,
        "areas": facility.areas or [],
    }


# =========================================================
# ALERT SERVICE
# =========================================================

def get_alerts(
    db: Session,
    search: Optional[str] = None,
    facility_id: Optional[int] = None,
    severity: Optional[Severity] = None,
    status: Optional[AlertStatus] = None,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
) -> list[Alert]:

    statement = (
        select(Alert)
        .options(joinedload(Alert.facility))
    )

    if search:
        search_value = f"%{search.strip()}%"
        statement = statement.where(
            or_(
                Alert.type.ilike(search_value),
                Alert.area.ilike(search_value),
                Alert.description.ilike(search_value),
                Alert.facility.has(Facility.name.ilike(search_value)),
            )
        )

    if facility_id is not None:
        statement = statement.where(Alert.facility_id == facility_id)

    if severity is not None:
        statement = statement.where(Alert.severity == severity.value)

    if status is not None:
        statement = statement.where(Alert.status == status.value)

    if from_date is not None:
        statement = statement.where(
            Alert.created_at >= datetime.combine(from_date, time.min)
        )

    if to_date is not None:
        next_day = to_date + timedelta(days=1)
        statement = statement.where(
            Alert.created_at < datetime.combine(next_day, time.min)
        )

    statement = statement.order_by(Alert.created_at.desc())
    return list(db.scalars(statement).all())


def get_alert(db: Session, alert_id: int) -> Optional[Alert]:
    statement = (
        select(Alert)
        .options(joinedload(Alert.facility))
        .where(Alert.id == alert_id)
    )
    return db.scalar(statement)


def create_alert(
    db: Session,
    payload: AlertCreate,
) -> tuple[Optional[Alert], Optional[str]]:

    facility = db.get(Facility, payload.facilityId)
    if facility is None:
        return None, "facility_not_found"

    # Validate area belongs to selected facility
    valid_areas = facility.areas or []
    if valid_areas and not any(
        area.lower() == payload.area.lower() for area in valid_areas
    ):
        return None, "invalid_area"

    now = datetime.now()
    alert = Alert(
        type=payload.type,
        facility_id=payload.facilityId,
        area=payload.area,
        severity=payload.severity.value,
        status=AlertStatus.ACTIVE.value,
        description=payload.description,
        created_at=now,
        updated_at=now,
    )

    db.add(alert)
    db.commit()
    db.refresh(alert)
    return get_alert(db, alert.id), None


def update_alert(
    db: Session,
    alert_id: int,
    payload: AlertUpdate,
) -> Optional[Alert]:

    alert = get_alert(db, alert_id)
    if alert is None:
        return None

    if payload.status is not None:
        alert.status = payload.status.value
    if payload.severity is not None:
        alert.severity = payload.severity.value
    if payload.description is not None:
        alert.description = payload.description

    alert.updated_at = datetime.now()
    db.commit()
    db.refresh(alert)
    return get_alert(db, alert_id)


def get_alert_types(db: Session) -> list[str]:
    statement = select(Alert.type).distinct().order_by(Alert.type)
    return list(db.scalars(statement).all())


# =========================================================
# FACILITY SERVICE
# =========================================================

def get_facilities(db: Session) -> list[dict]:
    facilities = list(
        db.scalars(select(Facility).order_by(Facility.name)).all()
    )
    results: list[dict] = []
    for facility in facilities:
        active_count = db.scalar(
            select(func.count(Alert.id)).where(
                Alert.facility_id == facility.id,
                Alert.status == AlertStatus.ACTIVE.value,
            )
        ) or 0
        results.append(facility_to_dict(facility, active_count))
    return results


def get_facility(db: Session, facility_id: int) -> Optional[dict]:
    facility = db.get(Facility, facility_id)
    if facility is None:
        return None
    active_count = db.scalar(
        select(func.count(Alert.id)).where(
            Alert.facility_id == facility.id,
            Alert.status == AlertStatus.ACTIVE.value,
        )
    ) or 0
    return facility_to_dict(facility, active_count)


def get_facility_areas(db: Session, facility_id: int) -> Optional[list[str]]:
    facility = db.get(Facility, facility_id)
    if facility is None:
        return None
    return facility.areas or []


# =========================================================
# DASHBOARD SERVICE
# =========================================================

def get_dashboard_stats(db: Session) -> dict:
    total = db.scalar(select(func.count(Alert.id))) or 0
    critical = db.scalar(
        select(func.count(Alert.id)).where(Alert.severity == Severity.CRITICAL.value)
    ) or 0
    active = db.scalar(
        select(func.count(Alert.id)).where(Alert.status == AlertStatus.ACTIVE.value)
    ) or 0
    resolved = db.scalar(
        select(func.count(Alert.id)).where(Alert.status == AlertStatus.RESOLVED.value)
    ) or 0
    acknowledged = db.scalar(
        select(func.count(Alert.id)).where(Alert.status == AlertStatus.ACKNOWLEDGED.value)
    ) or 0

    recent_alerts = list(
        db.scalars(
            select(Alert)
            .options(joinedload(Alert.facility))
            .order_by(Alert.created_at.desc())
            .limit(8)
        ).all()
    )

    return {
        "total": total,
        "critical": critical,
        "active": active,
        "resolved": resolved,
        "acknowledged": acknowledged,
        "recentAlerts": [alert_to_dict(a) for a in recent_alerts],
    }

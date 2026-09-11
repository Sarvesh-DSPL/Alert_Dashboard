from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import (
    AlertCreate,
    AlertFilters,
    AlertListResponse,
    AlertOptionsResponse,
    AlertResponse,
    AlertStatus,
    AlertUpdate,
    Severity,
)
from ..services import (
    alert_to_dict,
    create_alert,
    get_alert,
    get_alert_types,
    get_alerts,
    update_alert,
)


router = APIRouter(
    prefix="/api/alerts",
    tags=["Alerts"],
)


# =========================================================
# GET /api/alerts
# =========================================================

@router.get(
    "",
    response_model=AlertListResponse,
)
def list_alerts(
    search: Optional[str] = Query(
        default=None,
    ),
    facilityId: Optional[int] = Query(
        default=None,
        gt=0,
    ),
    severity: Optional[Severity] = Query(
        default=None,
    ),
    status: Optional[AlertStatus] = Query(
        default=None,
    ),
    fromDate: Optional[date] = Query(
        default=None,
    ),
    toDate: Optional[date] = Query(
        default=None,
    ),
    db: Session = Depends(get_db),
):
    if (
        fromDate is not None
        and toDate is not None
        and fromDate > toDate
    ):
        raise HTTPException(
            status_code=400,
            detail="fromDate cannot be after toDate.",
        )

    alerts = get_alerts(
        db=db,
        search=search,
        facility_id=facilityId,
        severity=severity,
        status=status,
        from_date=fromDate,
        to_date=toDate,
    )

    items = [
        alert_to_dict(alert)
        for alert in alerts
    ]

    return AlertListResponse(
        items=items,
        total=len(items),
    )


# =========================================================
# GET /api/alerts/options
# =========================================================

@router.get(
    "/options",
    response_model=AlertOptionsResponse,
)
def get_alert_options(
    db: Session = Depends(get_db),
):
    return {
        "types": get_alert_types(db),
        "severities": [
            Severity.LOW,
            Severity.MEDIUM,
            Severity.HIGH,
            Severity.CRITICAL,
        ],
        "statuses": [
            AlertStatus.ACTIVE,
            AlertStatus.ACKNOWLEDGED,
            AlertStatus.RESOLVED,
        ],
    }


# =========================================================
# GET /api/alerts/{alert_id}
# =========================================================

@router.get(
    "/{alert_id}",
    response_model=AlertResponse,
)
def get_alert_by_id(
    alert_id: int,
    db: Session = Depends(get_db),
):
    alert = get_alert(
        db,
        alert_id,
    )

    if alert is None:
        raise HTTPException(
            status_code=404,
            detail="Alert not found.",
        )

    return alert_to_dict(alert)


# =========================================================
# POST /api/alerts
# =========================================================

@router.post(
    "",
    response_model=AlertResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_alert(
    payload: AlertCreate,
    db: Session = Depends(get_db),
):
    alert, error = create_alert(
        db,
        payload,
    )

    if error == "facility_not_found":
        raise HTTPException(
            status_code=404,
            detail="Facility not found.",
        )

    if error == "invalid_alert_type":
        raise HTTPException(
            status_code=400,
            detail="Alert type is not an allowed alert type.",
        )

    if error == "invalid_area":
        raise HTTPException(
            status_code=400,
            detail="Area is not available for the selected facility.",
        )

    if alert is None:
        raise HTTPException(
            status_code=500,
            detail="Unable to create alert.",
        )

    return alert_to_dict(alert)


# =========================================================
# PUT /api/alerts/{alert_id}
# =========================================================

@router.put(
    "/{alert_id}",
    response_model=AlertResponse,
)
def update_existing_alert(
    alert_id: int,
    payload: AlertUpdate,
    db: Session = Depends(get_db),
):
    alert = update_alert(
        db,
        alert_id,
        payload,
    )

    if alert is None:
        raise HTTPException(
            status_code=404,
            detail="Alert not found.",
        )

    return alert_to_dict(alert)
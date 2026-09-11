from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import (
    FacilityAreaResponse,
    FacilityResponse,
)
from ..services import (
    get_facilities,
    get_facility,
    get_facility_areas,
)


router = APIRouter(
    prefix="/api/facilities",
    tags=["Facilities"],
)


# =========================================================
# GET /api/facilities
# =========================================================

@router.get(
    "",
    response_model=list[FacilityResponse],
)
def list_facilities(
    db: Session = Depends(get_db),
):
    return get_facilities(db)


# =========================================================
# GET /api/facilities/{facility_id}/areas
# =========================================================

@router.get(
    "/{facility_id}/areas",
    response_model=FacilityAreaResponse,
)
def list_facility_areas(
    facility_id: int,
    db: Session = Depends(get_db),
):
    areas = get_facility_areas(
        db,
        facility_id,
    )

    if areas is None:
        raise HTTPException(
            status_code=404,
            detail="Facility not found.",
        )

    return {
        "facilityId": facility_id,
        "areas": areas,
    }


# =========================================================
# GET /api/facilities/{facility_id}
# =========================================================

@router.get(
    "/{facility_id}",
    response_model=FacilityResponse,
)
def get_facility_by_id(
    facility_id: int,
    db: Session = Depends(get_db),
):
    facility = get_facility(
        db,
        facility_id,
    )

    if facility is None:
        raise HTTPException(
            status_code=404,
            detail="Facility not found.",
        )

    return facility
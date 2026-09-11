from datetime import date, datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class Severity(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"


class AlertStatus(str, Enum):
    ACTIVE = "Active"
    ACKNOWLEDGED = "Acknowledged"
    RESOLVED = "Resolved"


class AlertResponse(BaseModel):
    id: int
    type: str
    facilityId: int
    facilityName: str
    area: str
    severity: Severity
    status: AlertStatus
    description: str
    createdAt: datetime
    updatedAt: datetime


class AlertListResponse(BaseModel):
    items: list[AlertResponse]
    total: int


class AlertCreate(BaseModel):
    type: str = Field(min_length=1, max_length=150)
    facilityId: int = Field(gt=0)
    area: str = Field(min_length=1, max_length=150)
    severity: Severity
    description: str = Field(min_length=10, max_length=1000)

    @field_validator("type", "area")
    @classmethod
    def validate_text_fields(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Value cannot be empty.")
        return value

    @field_validator("description")
    @classmethod
    def validate_description(cls, value: str) -> str:
        value = value.strip()
        if len(value) < 10:
            raise ValueError("Description must contain at least 10 characters.")
        return value


class AlertUpdate(BaseModel):
    status: Optional[AlertStatus] = None
    severity: Optional[Severity] = None
    description: Optional[str] = Field(default=None, min_length=10, max_length=1000)

    @field_validator("description")
    @classmethod
    def validate_description(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        value = value.strip()
        if len(value) < 10:
            raise ValueError("Description must contain at least 10 characters.")
        return value


class AlertFilters(BaseModel):
    search: Optional[str] = None
    facilityId: Optional[int] = None
    severity: Optional[Severity] = None
    status: Optional[AlertStatus] = None
    fromDate: Optional[date] = None
    toDate: Optional[date] = None


class FacilityResponse(BaseModel):
    id: int
    name: str
    location: str
    areaCount: int
    cameraCount: int
    activeAlertCount: int
    areas: list[str] = []


class FacilityAreaResponse(BaseModel):
    facilityId: int
    areas: list[str]


class DashboardStats(BaseModel):
    total: int
    critical: int
    active: int
    resolved: int
    acknowledged: int
    recentAlerts: list[AlertResponse]


class AlertOptionsResponse(BaseModel):
    types: list[str]
    severities: list[Severity]
    statuses: list[AlertStatus]

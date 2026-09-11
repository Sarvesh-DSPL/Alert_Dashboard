from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class Facility(Base):
    __tablename__ = "facilities"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    location: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    area_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    camera_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    areas: Mapped[list[str]] = mapped_column(
        JSON,
        nullable=False,
        default=list,
    )

    alerts: Mapped[list["Alert"]] = relationship(
        "Alert",
        back_populates="facility",
        cascade="all, delete-orphan",
    )


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    type: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    facility_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey(
            "facilities.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    area: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True,
    )

    severity: Mapped[str] = mapped_column(
        Enum(
            "Low",
            "Medium",
            "High",
            "Critical",
            name="severity_enum",
        ),
        nullable=False,
        index=True,
    )

    status: Mapped[str] = mapped_column(
        Enum(
            "Active",
            "Acknowledged",
            "Resolved",
            name="status_enum",
        ),
        nullable=False,
        index=True,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        index=True,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    facility: Mapped[Facility] = relationship(
        "Facility",
        back_populates="alerts",
    )
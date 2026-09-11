import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

load_dotenv()


def build_database_url() -> str:

    database_url = os.getenv("DATABASE_URL")

    if database_url:
        return database_url

    mysql_user = os.getenv("MYSQL_USER", "root")
    mysql_password = os.getenv("MYSQL_PASSWORD", "")
    mysql_host = os.getenv("MYSQL_HOST", "localhost")
    mysql_port = os.getenv("MYSQL_PORT", "3306")
    mysql_database = os.getenv(
        "MYSQL_DATABASE",
        "smart_facility_monitoring",
    )

    return (
        f"mysql+pymysql://"
        f"{mysql_user}:{mysql_password}"
        f"@{mysql_host}:{mysql_port}"
        f"/{mysql_database}"
    )


DATABASE_URL = build_database_url()


class Base(DeclarativeBase):
    pass


engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=280,
    echo=False,
)


SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
    class_=Session,
)


def get_db():
    """
    FastAPI dependency that provides one SQLAlchemy session
    per request.
    """

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
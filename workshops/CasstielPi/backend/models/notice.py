from datetime import datetime, timezone

from beanie import Document
from pydantic import Field


class Notice(Document):
    title: str = Field(min_length=1, max_length=100)
    message: str = Field(min_length=1, max_length=500)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    class Settings:
        name = "notices"
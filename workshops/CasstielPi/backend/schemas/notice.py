from datetime import datetime

from pydantic import BaseModel, Field


class NoticeCreate(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    message: str = Field(min_length=1, max_length=500)


class NoticeResponse(BaseModel):
    id: str
    title: str
    message: str
    created_at: datetime
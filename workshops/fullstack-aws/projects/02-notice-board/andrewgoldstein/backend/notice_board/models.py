from pydantic import BaseModel
class Notice(BaseModel):
    name: str
    message: str
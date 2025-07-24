from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class DomainModel(BaseModel):
    id: Optional[str] = Field(alias="_id")
    name: str
    status: str
    owner: str
    created_at: datetime

    class Config:
        allow_population_by_field_name = True 
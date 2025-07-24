from pydantic import BaseModel, Field
from typing import Optional

class DNSRecordModel(BaseModel):
    id: Optional[str] = Field(alias="_id")
    domain_id: str
    type: str
    value: str
    ttl: int

    class Config:
        allow_population_by_field_name = True 
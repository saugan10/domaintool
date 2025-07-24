from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class InvoiceModel(BaseModel):
    id: Optional[str] = Field(alias="_id")
    domain_id: str
    amount: float
    status: str
    issued_at: datetime
    due_date: datetime

    class Config:
        allow_population_by_field_name = True 
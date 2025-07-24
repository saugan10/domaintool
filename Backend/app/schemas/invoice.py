from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InvoiceOut(BaseModel):
    id: str
    domain_id: str
    amount: float
    status: str
    issued_at: datetime
    due_date: datetime 
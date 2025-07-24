from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DomainCreate(BaseModel):
    name: str
    owner: str

class DomainOut(BaseModel):
    id: str
    name: str
    status: str
    owner: str
    created_at: datetime

class DomainUpdate(BaseModel):
    name: Optional[str]
    status: Optional[str] 
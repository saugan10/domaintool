from pydantic import BaseModel
from typing import Optional

class DNSRecordCreate(BaseModel):
    type: str
    value: str
    ttl: int

class DNSRecordOut(BaseModel):
    id: str
    domain_id: str
    type: str
    value: str
    ttl: int 
from pydantic import BaseModel
from typing import Dict, Any

class SettingsOut(BaseModel):
    user_id: str
    preferences: Dict[str, Any]

class SettingsUpdate(BaseModel):
    preferences: Dict[str, Any] 
from pydantic import BaseModel
from typing import Dict, Any

class SettingsModel(BaseModel):
    user_id: str
    preferences: Dict[str, Any] 
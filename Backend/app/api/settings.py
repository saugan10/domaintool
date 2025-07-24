from fastapi import APIRouter, Depends, HTTPException
from app.schemas.settings import SettingsOut, SettingsUpdate
from app.crud.settings import get_settings, update_settings
from app.main import get_db

router = APIRouter()

@router.get("/{user_id}", response_model=SettingsOut)
async def get_user_settings(user_id: str, db=Depends(get_db)):
    settings = await get_settings(db, user_id)
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    return settings

@router.post("/{user_id}", response_model=SettingsOut)
async def update_user_settings(user_id: str, update: SettingsUpdate, db=Depends(get_db)):
    return await update_settings(db, user_id, update.preferences) 
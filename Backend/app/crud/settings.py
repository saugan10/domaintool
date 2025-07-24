from app.models.settings import SettingsModel
from motor.motor_asyncio import AsyncIOMotorDatabase

async def get_settings(db: AsyncIOMotorDatabase, user_id: str):
    doc = await db.settings.find_one({"user_id": user_id})
    if doc:
        return SettingsModel(**doc)
    return None

async def update_settings(db: AsyncIOMotorDatabase, user_id: str, preferences: dict):
    await db.settings.update_one({"user_id": user_id}, {"$set": {"preferences": preferences}}, upsert=True)
    return await get_settings(db, user_id) 
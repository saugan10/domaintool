from app.models.domain import DomainModel
from app.schemas.domain import DomainCreate
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime

async def list_domains(db: AsyncIOMotorDatabase):
    cursor = db.domains.find()
    return [DomainModel(**doc) async for doc in cursor]

async def create_domain(db: AsyncIOMotorDatabase, domain: DomainCreate):
    doc = domain.dict()
    doc['status'] = 'pending'
    doc['created_at'] = datetime.utcnow()
    result = await db.domains.insert_one(doc)
    return str(result.inserted_id)

async def get_domain(db: AsyncIOMotorDatabase, domain_id: str):
    doc = await db.domains.find_one({"_id": ObjectId(domain_id)})
    if doc:
        return DomainModel(**doc)
    return None

async def delete_domain(db: AsyncIOMotorDatabase, domain_id: str):
    result = await db.domains.delete_one({"_id": ObjectId(domain_id)})
    return result.deleted_count > 0 
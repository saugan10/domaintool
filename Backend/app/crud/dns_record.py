from app.models.dns_record import DNSRecordModel
from app.schemas.dns_record import DNSRecordCreate
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

async def list_dns_records(db: AsyncIOMotorDatabase, domain_id: str):
    cursor = db.dns_records.find({"domain_id": domain_id})
    return [DNSRecordModel(**doc) async for doc in cursor]

async def create_dns_record(db: AsyncIOMotorDatabase, domain_id: str, record: DNSRecordCreate):
    doc = record.dict()
    doc['domain_id'] = domain_id
    result = await db.dns_records.insert_one(doc)
    return str(result.inserted_id)

async def delete_dns_record(db: AsyncIOMotorDatabase, domain_id: str, record_id: str):
    result = await db.dns_records.delete_one({"_id": ObjectId(record_id), "domain_id": domain_id})
    return result.deleted_count > 0 
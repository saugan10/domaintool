from app.models.invoice import InvoiceModel
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

async def list_invoices(db: AsyncIOMotorDatabase):
    cursor = db.invoices.find()
    return [InvoiceModel(**doc) async for doc in cursor]

async def get_invoice(db: AsyncIOMotorDatabase, invoice_id: str):
    doc = await db.invoices.find_one({"_id": ObjectId(invoice_id)})
    if doc:
        return InvoiceModel(**doc)
    return None 
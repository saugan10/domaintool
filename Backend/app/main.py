from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGODB_URI, DATABASE_NAME
from app.api import domain, dns_record, invoice, settings, suggestions

app = FastAPI()

client = AsyncIOMotorClient(MONGODB_URI)
db = client[DATABASE_NAME]

def get_db():
    return db

app.include_router(domain.router, prefix="/domains", tags=["domains"])
app.include_router(dns_record.router, prefix="/domains/{domain_id}/dns", tags=["dns"])
app.include_router(invoice.router, prefix="/invoices", tags=["invoices"])
app.include_router(settings.router, prefix="/settings", tags=["settings"])
app.include_router(suggestions.router, prefix="/suggestions", tags=["suggestions"]) 
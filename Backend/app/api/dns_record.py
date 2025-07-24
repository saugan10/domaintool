from fastapi import APIRouter, Depends, HTTPException
from app.schemas.dns_record import DNSRecordCreate, DNSRecordOut
from app.crud.dns_record import list_dns_records, create_dns_record, delete_dns_record
from app.services.agentic import update_dns_agent
from app.main import get_db

router = APIRouter()

@router.get("/", response_model=list[DNSRecordOut])
async def list_all(domain_id: str, db=Depends(get_db)):
    return await list_dns_records(db, domain_id)

@router.post("/", response_model=str)
async def create(domain_id: str, record: DNSRecordCreate, db=Depends(get_db)):
    record_id = await create_dns_record(db, domain_id, record)
    await update_dns_agent(domain_id)  # agent automation
    return record_id

@router.delete("/{record_id}")
async def delete(domain_id: str, record_id: str, db=Depends(get_db)):
    success = await delete_dns_record(db, domain_id, record_id)
    if not success:
        raise HTTPException(status_code=404, detail="DNS record not found")
    await update_dns_agent(domain_id)  # agent automation
    return {"ok": True} 
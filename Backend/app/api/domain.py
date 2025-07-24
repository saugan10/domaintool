from fastapi import APIRouter, Depends, HTTPException
from app.schemas.domain import DomainCreate, DomainOut
from app.crud.domain import list_domains, create_domain, get_domain, delete_domain
from app.services.agentic import register_domain_agent
from app.main import get_db

router = APIRouter()

@router.get("/", response_model=list[DomainOut])
async def list_all(db=Depends(get_db)):
    return await list_domains(db)

@router.post("/", response_model=str)
async def create(domain: DomainCreate, db=Depends(get_db)):
    domain_id = await create_domain(db, domain)
    await register_domain_agent(domain_id)  # agent automation
    return domain_id

@router.get("/{domain_id}", response_model=DomainOut)
async def read(domain_id: str, db=Depends(get_db)):
    domain = await get_domain(db, domain_id)
    if not domain:
        raise HTTPException(status_code=404, detail="Domain not found")
    return domain

@router.delete("/{domain_id}")
async def delete(domain_id: str, db=Depends(get_db)):
    success = await delete_domain(db, domain_id)
    if not success:
        raise HTTPException(status_code=404, detail="Domain not found")
    return {"ok": True} 
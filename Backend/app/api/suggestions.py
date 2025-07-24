from fastapi import APIRouter, Depends
from app.services.agentic import suggest_domains_agent
from app.main import get_db

router = APIRouter()

@router.get("/")
async def get_suggestions(query: str = "", db=Depends(get_db)):
    return await suggest_domains_agent(query) 
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.invoice import InvoiceOut
from app.crud.invoice import list_invoices, get_invoice
from app.main import get_db

router = APIRouter()

@router.get("/", response_model=list[InvoiceOut])
async def list_all(db=Depends(get_db)):
    return await list_invoices(db)

@router.get("/{invoice_id}", response_model=InvoiceOut)
async def read(invoice_id: str, db=Depends(get_db)):
    invoice = await get_invoice(db, invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice 
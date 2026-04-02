from fastapi import APIRouter, HTTPException, UploadFile

from app.services.ingestion.process_pdf import process_pdf

upload_router = APIRouter()

@upload_router.post("/upload")
async def upload_pdf(file: UploadFile):
    try:
        filename = file.filename
        file_bytes = await file.read()
        response = process_pdf(filename, file_bytes)
        return {"message": "Document processed successfully", "data": response}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"message": "Internal server error", "error": str(e)},
        )
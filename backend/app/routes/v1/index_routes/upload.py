from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile

from app.middlewares.auth.get_user_data import get_user_data
from app.services.ingestion.process_pdf import process_pdf

upload_router = APIRouter()

@upload_router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    request: Request = Depends(get_user_data),
):
    try:
        index_name = "rag-pdf-qna"
        user_id = request.state.user_id
        username = request.state.username
        filename = file.filename
        file_bytes = await file.read()
        response = process_pdf(index_name, filename, file_bytes, user_id, username)
        return {"message": "Document processed successfully", "data": response}        

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        
        raise HTTPException(
                status_code=500,
                detail={"message": "Internal server error", "error": str(e)},
            )
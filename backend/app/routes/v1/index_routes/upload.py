import asyncio
from typing import List
from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile

from app.middlewares.auth.get_user_data import get_user_data
from app.services.ingestion.process_pdf import process_pdf

upload_router = APIRouter()

@upload_router.post("/upload")
async def upload_pdf(
    files: List[UploadFile] = File(...),
    request: Request = Depends(get_user_data),
):
    try:
        index_name = "rag-pdf-qna"
        user_id = request.state.user_id
        username = request.state.username

        tasks = []
        task_files = [] 

        print("REACHED HERE1")
        for file in files:
            if file.content_type != "application/pdf":
                continue

            file_bytes = await file.read()

            tasks.append(
                process_pdf(index_name, file.filename, file_bytes, user_id, username)
            )
            task_files.append(file)

        print("REACHED HERE2")
        

        results = await asyncio.gather(*tasks, return_exceptions=True)

        print("REACHED HERE3")

        final_results = []

        # processed files
        for file, result in zip(task_files, results):
            if isinstance(result, Exception):
                final_results.append({
                    "filename": file.filename,
                    "status": "failed",
                    "error": str(result),
                })
            else:
                final_results.append({
                    "filename": file.filename,
                    "status": "success",
                    "data": result,
                })
                
        # skipped files (invalid type)
        for file in files:
            if file.content_type != "application/pdf":
                final_results.append({
                    "filename": file.filename,
                    "status": "failed",
                    "error": "Invalid file type",
                })

        print("REACHED HERE4")
        
        
        return {
            "message": "Documents processed",
            "data": {
                "summary": {
                    "total": len(final_results),
                    "success": sum(1 for r in final_results if r["status"] == "success"),
                    "failed": sum(1 for r in final_results if r["status"] == "failed"),
                },
                "results": final_results
            }
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        print("Error in upload route:: ", e)
        if isinstance(e, HTTPException):
            raise e

        raise HTTPException(
            status_code=500,
            detail={"message": "Internal server error", "error": str(e)},
        )
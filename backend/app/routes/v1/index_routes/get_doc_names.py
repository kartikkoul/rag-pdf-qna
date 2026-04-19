from fastapi import APIRouter, Depends, HTTPException, Request

from app.services.documents import fetch_documents
from app.middlewares.auth.get_user_data import get_user_data


docs_router = APIRouter()

@docs_router.get("/getdocsnames")
def get_docs(req: Request = Depends(get_user_data)):
    try:
        user_id = req.state.user_id
        username = req.state.username

        index_name = "rag-pdf-qna"

        results = fetch_documents(index_name, namespace=(user_id+username))


        return {
            "message": "Fetched all docs for the user",
            "data":{
                "docs": results
            }
        }
    
    except Exception as e:
        raise HTTPException(500, {"message": "Internal server error", "error": str(e)})

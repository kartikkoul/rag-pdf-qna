from fastapi import APIRouter, HTTPException

from app.models.schemas import Query

query_router = APIRouter()

@query_router.post("/query")
def query(query: Query):
    try:
        chunks = ""
        answer = ""

        return {
            "question": query,
            "answer": answer,
            "chunks": chunks
        }
    
    except Exception as e:
        raise HTTPException(500, {"message": "Internal server error", "error": e})
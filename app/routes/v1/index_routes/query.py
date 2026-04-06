from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request

from app.middlewares.auth.get_user_data import get_user_data
from app.models.schemas import Query
from app.services.retrieval.augment_query import augment_query

query_router = APIRouter()





@query_router.post("/query")
def query(query: Query, req: Request = Depends(get_user_data)):
    try:
        query = query.model_dump().get("query")
        user_id = req.state.user_id
        index_name = "rag-pdf-qna"
        chunks = ""
        answer = ""

        res = augment_query(index_name, query=query, user_id=user_id)
       

        return {
            "question": query,
            "answer": answer,
            "chunks": chunks,
            "res": res,
        }
    
    except Exception as e:
        raise HTTPException(500, {"message": "Internal server error", "error": str(e)})
import asyncio
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse

from app.middlewares.auth.get_user_data import get_user_data
from app.models.schemas import Query
from app.services.generation.generate_answer import generate_answer_stream
from app.services.retrieval.augment_query import augment_query

query_router = APIRouter()

@query_router.post("/query")
async def query(query: Query, req: Request = Depends(get_user_data)):
    try:
        query = query.model_dump().get("query")
        user_id = req.state.user_id
        username = req.state.username

        index_name = "rag-pdf-qna"
        
        augmented_query = await asyncio.to_thread(
            augment_query, index_name, query, (user_id + username)
        )

        async def event_stream():
            if augmented_query:
                async for token in generate_answer_stream(augmented_query, 0.4, 0.4, 1000, req):
                    if await req.is_disconnected():
                        break
                    yield f"data: {token}\n\n"
            else:
                for _ in range(1):
                    yield "data: I’m sorry, but I don’t have any information to answer that query. Please make sure you have added documents to the knowledge base.\n\n"

            yield "data: [DONE]\n\n"

        return StreamingResponse(
            event_stream(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            }
        )
    
    except Exception as e:
        raise HTTPException(500, {"message": "Internal server error", "error": str(e)})
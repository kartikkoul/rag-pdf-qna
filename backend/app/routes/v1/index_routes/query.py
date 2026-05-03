import asyncio
import json
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse

from app.middlewares.auth.get_user_data import get_user_data
from app.models.schemas import Query
from app.services.generation.generate_answer import generate_answer_stream
from app.services.retrieval.augment_query import augment_query

query_router = APIRouter()


def _sse_chunk(token: str) -> str:
    # JSON-encode the payload so newlines/quotes/etc. survive the SSE framing.
    return f"data: {json.dumps(token, ensure_ascii=False)}\n\n"

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
                    yield _sse_chunk(token)
            else:
                fallback_response = (
                    "I'm sorry, but I don't have any information to answer that query. "
                    "Please make sure you have added documents to the knowledge base."
                )
                for word in fallback_response.split(" "):
                    if await req.is_disconnected():
                        break
                    yield _sse_chunk(word + " ")
                    await asyncio.sleep(0.01)
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
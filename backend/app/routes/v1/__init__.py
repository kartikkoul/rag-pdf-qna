from fastapi import APIRouter

from app.routes.v1.index_routes.query import query_router
from app.routes.v1.index_routes.upload import upload_router
from app.routes.v1.index_routes.get_doc_names import docs_router

v1_router = APIRouter(prefix="/v1")


# RAG Ops
v1_router.include_router(upload_router)
v1_router.include_router(query_router)
v1_router.include_router(docs_router)
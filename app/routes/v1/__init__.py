from fastapi import APIRouter

from app.routes.v1.index_routes.query import query_router
from app.routes.v1.index_routes.upload import upload_router

v1_router = APIRouter(prefix="/v1")
v1_router.include_router(upload_router)
v1_router.include_router(query_router)
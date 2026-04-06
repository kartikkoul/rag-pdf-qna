from fastapi import FastAPI

from app.routes.v1 import v1_router
from tests.configure_custom_open_api import register_custom_openapi

app = FastAPI()


@app.post("/health-check")
def health_check():
    return {"message": "All OK👌🏻!"}, 200

app.include_router(v1_router)


# register_custom_openapi(app=app)
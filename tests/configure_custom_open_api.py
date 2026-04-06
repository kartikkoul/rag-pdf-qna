from fastapi.openapi.utils import get_openapi
from fastapi import FastAPI

def register_custom_openapi(app: FastAPI):
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="FastAPI",
        version="0.1.0",
        routes=app.routes,
    )


    openapi_schema["paths"]["/v1/query"]["post"]["parameters"] = [
        {
            "name": "Authorization",
            "in": "header",
            "required": True,
            "schema": {"type": "string"},
        }
    ]

    openapi_schema["paths"]["/v1/upload"]["post"]["parameters"] = [
        {
            "name": "Authorization",
            "in": "header",
            "required": True,
            "schema": {"type": "string"},
        }
    ]

    app.openapi_schema = openapi_schema
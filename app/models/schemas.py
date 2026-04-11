from datetime import datetime
from typing import TypedDict
from pydantic import BaseModel, Field
from pinecone import Metric


class IndexConfig(BaseModel):
    name: str
    dimension: int
    metric: Metric
class Query(BaseModel):
    query: str

class Chunk(TypedDict):
    id: str
    text: str
    page: int
    source: str
    uploaded_by: str
    creation_date: datetime

class SignUpBody(BaseModel):
    username: str = Field(min_length=3, max_length=20, pattern=r"^[a-zA-Z0-9_]+$")
    email: str = Field(
        pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    )
    password: str = Field(min_length=8)

class SignInBody(BaseModel):
    username: str = Field(pattern=r"(^[a-zA-Z0-9_]{3,20}$)|(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)")
    password: str = Field(min_length=8)
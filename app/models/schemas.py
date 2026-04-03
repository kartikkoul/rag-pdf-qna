from enum import Enum
from pydantic import BaseModel
from pinecone import Metric, ServerlessSpec


class IndexConfig(BaseModel):
    name: str
    dimension: int
    metric: Metric
class Query(BaseModel):
    query: str
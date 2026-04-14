from pinecone import Metric, Pinecone, ServerlessSpec

from app.env_vars import PINECONE_API_KEY
from app.models.schemas import IndexConfig


pc = Pinecone(api_key=PINECONE_API_KEY)

# Create index if not exists
def get_pc_index(index_name: str, index_config: IndexConfig = None):
    if index_name not in pc.list_indexes().names():
        if not index_config:
            index_config = IndexConfig(
                name=index_name,
                dimension=384,
                metric=Metric.DOTPRODUCT
            )


        pc.create_index(
            **index_config.model_dump(),
            spec=ServerlessSpec(
                    cloud="aws",
                    region="us-east-1"
                ),
        )

    index = pc.Index(index_name)

    return index
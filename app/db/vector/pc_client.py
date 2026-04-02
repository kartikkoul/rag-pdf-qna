from pinecone import Pinecone

from app.env_vars import PINECONE_API_KEY


pc = Pinecone(api_key=PINECONE_API_KEY)

# Create index if not exists
index_name = "RAG-PDF-QnA"

if index_name not in pc.list_indexes().names():
    pc.create_index(
            name=index_name,
            dimension=384,
            metric="cosine"
        )

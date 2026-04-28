from typing import TypedDict
from fastapi import HTTPException
from numpy import ndarray

from app.db.pc_client import get_pc_index
from app.models.schemas import Chunk

class PineconeVectorPayload(TypedDict):
    id: str
    values: list
    sparse_values: list
    metadata: Chunk
    

def store_embeds(index_name: str, chunks: list[Chunk], dense_embeds: ndarray, sparse_embeds: list, user_id:str,  batch_size: int = 100):
    index = get_pc_index(index_name)
    vectors : list[PineconeVectorPayload] = []


    for _ , (chunk, dense_embeds, sparse_embeds) in enumerate(zip(chunks, dense_embeds, sparse_embeds)):
        vectors.append({
                "id": chunk["id"],
                "values": dense_embeds.tolist(),
                "sparse_values": sparse_embeds,
                "metadata": {
                    "text": chunk["text"],
                    "page": chunk["page"],
                    "source": chunk["source"],
                    "uploaded_by": chunk["uploaded_by"],
                    "creation_date":chunk["creation_date"]
                }
            }
        )

    index_dims = index.describe_index_stats().get("dimension")
    check_vector_dims = [ len(vector.get("values", [])) == index_dims for vector in vectors]


    if all(check_vector_dims):
        # Replace existing vectors for the same uploaded document in this namespace.
        # This prevents stale chunks when the new upload has fewer chunks than before.
        if len(chunks) > 0:
            source_filename = chunks[0].get("source")
            if source_filename:
                index.delete(
                    filter={"source": {"$eq": source_filename}},
                    namespace=user_id
                )

        for i in range(0, len(vectors), batch_size):
            index.upsert(vectors=vectors[i: i+batch_size], namespace=user_id)
    else:
        raise HTTPException(422, detail={"message": "Embedding dimensions doesn't match the Index dimensions"})
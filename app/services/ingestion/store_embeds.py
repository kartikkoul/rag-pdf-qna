from fastapi import HTTPException
from numpy import ndarray

from app.db.pc_client import get_pc_index


def store_embeds(index_name: str, chunks, embeds: ndarray, user_id:str,  batch_size: int = 100):
    index = get_pc_index(index_name)
    vectors = []


    for _ , (chunk, emb) in enumerate(zip(chunks, embeds)):
        vectors.append({
                "id": chunk["id"],
                "values": emb.tolist(),
                "metadata": {
                    "text": chunk["text"],
                    "page": chunk["page"],
                    "source": chunk["source"]
                }
            }
        )

    index_dims = index.describe_index_stats().get("dimension")
    check_vector_dims = [ len(vector.get("values", [])) == index_dims for vector in vectors]


    if all(check_vector_dims):
        for i in range(0, len(vectors), batch_size):
            index.upsert(vectors=vectors[i: i+batch_size], namespace=user_id)
    else:
        raise HTTPException(422, detail={"message": "Embedding dimensions doesn't match the Index dimensions"})
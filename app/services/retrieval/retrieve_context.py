from typing import Any
from numpy import ndarray
from app.db.pc_client import get_pc_index
from app.services.ingestion.embed import model

def _serialize_match(match: Any) -> dict:
    if isinstance(match, dict):
        return {
            "id": match.get("id"),
            "score": match.get("score"),
            "metadata": match.get("metadata"),
        }

    return {
        "id": getattr(match, "id", None),
        "score": getattr(match, "score", None),
        "metadata": getattr(match, "metadata", None),
    }

def similarity_search(index_name: str, query: str, user_id: str, top_k: int = 10):
    query_embeddings : ndarray = model.encode([query])[0]

    index = get_pc_index(index_name=index_name)

    results = index.query(
        vector=query_embeddings.tolist(),
        top_k=top_k,
        include_metadata=True,
        namespace=user_id
    )

    serialized_matches = [_serialize_match(match) for match in (results["matches"] or [])]

    return serialized_matches
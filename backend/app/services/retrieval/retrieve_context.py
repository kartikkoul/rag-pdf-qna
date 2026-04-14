from typing import Any
from numpy import ndarray
from app.db.pc_client import get_pc_index
from app.services.ingestion.embed import embedder

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
    query_embeddings : ndarray = embedder.dense_embeds_model.encode([query])[0]

    index = get_pc_index(index_name=index_name)

    results = index.query(
        vector=query_embeddings.tolist(),
        top_k=top_k,
        include_metadata=True,
        namespace=user_id
    )

    serialized_matches = [_serialize_match(match) for match in (results["matches"] or [])]

    return serialized_matches

def hybrid_search_norm(dense, sparse, alpha:float):
    """ Normalising query's dense & sparse embeddings using alpha
        where alpha is between 0 and 1 and the greater the value of alpha, greater is the percentage
        of contribution of lexical search in the query
    """
    if alpha < 0 or alpha > 1:
        raise ValueError("Alpha must be between 0 and 1")

    hs = {
        'indices': sparse['indices'],
        'values': [v * (1 - alpha) for v in sparse['values']]
    }

    return [v * alpha for v in dense], hs


def hybrid_search(index_name:str, query:str, user_id: str, top_k: int = 10):
    """ Hybrid search for Pinecone """
    dense_query_embeddings = embedder.dense_embeds_model.encode(query)
    sparse_query_embeddings = embedder.convert_to_pinecone_compatible_sparse_tensor(embedder.sparse_embeds_encoder.encode(query))


    index = get_pc_index(index_name)

    hdense, hsparse = hybrid_search_norm(dense_query_embeddings.tolist(), sparse_query_embeddings, alpha=0.75)

    results = index.query(
        vector=hdense,
        sparse_vector=hsparse,
        top_k=top_k,
        include_metadata=True,
        namespace=user_id
    )


    serialized_matches = [_serialize_match(match) for match in results["matches"] or []]

    return serialized_matches
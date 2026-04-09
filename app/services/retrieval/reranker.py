from sentence_transformers import CrossEncoder

def rerank_matches(query:str, matches, top_k: int = 2):
    reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

    # Query & Doc pairs
    pairs = [
        (query, chunk["metadata"]["text"])
        for chunk in matches
    ]

    scores = reranker.predict(pairs)

    # Attach scores
    scored_chunks = [
        {**chunk, "reranked_score": float(score)}
        for chunk, score in zip(matches, scores)
    ]

    #Sort by score(descending)
    reranked_matches = sorted(
        scored_chunks,
        key=lambda x:x["reranked_score"],
        reverse=True
    ) 

    return reranked_matches[:top_k]
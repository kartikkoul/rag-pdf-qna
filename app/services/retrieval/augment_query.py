from app.services.retrieval.reranker import rerank_matches
from app.services.retrieval.retrieve_context import similarity_search


def augment_query(index_name: str, query: str, user_id: str):
    #Transform Query

    #Search vector DB
    matches = similarity_search(index_name, query, user_id)

    #Rerank
    reranked_matches = rerank_matches(query, matches)

    #Augmented query
    AUGMENTED_PROMPT = f"""Answer the query based on the context given:
    
    Query: {query}
    Context: {[chunk["metadata"] for chunk in reranked_matches]}
    """

    return AUGMENTED_PROMPT
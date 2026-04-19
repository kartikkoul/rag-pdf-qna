from app.services.retrieval.reranker import rerank_matches
from app.services.retrieval.retrieve_context import hybrid_search
from pprint import pprint


def augment_query(index_name: str, query: str, user_id: str):
    #Transform Query

    #Search vector DB
    matches = hybrid_search(index_name, query, user_id)

    #Rerank
    reranked_matches = rerank_matches(query, matches)

    print(reranked_matches)
    #Augmented query
    AUGMENTED_PROMPT =  f"""Answer the query based on the context given:
    
    Query: {query}
    Context: {[chunk["metadata"] for chunk in reranked_matches]}
    """ if len(reranked_matches) > 0 else None

    return AUGMENTED_PROMPT
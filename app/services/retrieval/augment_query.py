from app.services.retrieval.retrieve_context import similarity_search


def augment_query(index_name: str, query: str, user_id: str):
    #Transform Query

    #Search vector DB
    matches = similarity_search(index_name, query, user_id)

    #Rerank
    

    #Compress

    #Augmented query

    return matches
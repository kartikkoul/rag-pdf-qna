from app.db.pc_client import get_pc_index


def fetch_documents(index_name: str, namespace:str):
    index = get_pc_index(index_name)
    
    unique_sources = set()

    # Step 1: paginate through all IDs
    for batch in index.list(namespace=namespace):
        ids = batch  # batch of vector IDs

        # Step 2: fetch vectors
        response = index.fetch(ids=ids, namespace=namespace)

        # Step 3: extract sources
        for vec in response["vectors"].values():
            metadata = vec.get("metadata", {})
            source = metadata.get("source")

            if source:
                unique_sources.add(source)

    print(list(unique_sources))

    return unique_sources
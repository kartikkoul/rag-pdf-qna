from app.db.pc_client import get_pc_index


def fetch_documents(index_name: str, namespace:str):
    index = get_pc_index(index_name)
    
    unique_sources = set()

    # Step 1: paginate through all IDs
    for batch in index.list(namespace=namespace):
        ids = batch  # batch of vector IDs

        # Step 2: Get vector IDs
        for vector_id in ids:
            # Step 3: Extract document name from vector id and add to sources
            # Expected id format: "{filename}_{chunkindex}"
            # If an id does not end with "_<number>", keep the original id as source.
            id_parts = vector_id.rsplit("_", 1)
            has_chunk_suffix = len(id_parts) == 2 and id_parts[1].isdigit()
            source = id_parts[0] if has_chunk_suffix else vector_id

            if source:
                unique_sources.add(source)

    return sorted(unique_sources)
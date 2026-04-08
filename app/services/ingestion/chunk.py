# Fixed size chunking
def chunk_text(filename, pages, chunk_size=200, overlap=50):
    chunks = []

    for page in pages:
        words = page["text"].split()


        for i in range(0, len(words), chunk_size - overlap):
            chunk_words = words[i:i + chunk_size]
            chunk = {
                "text": " ".join(chunk_words),
                "page": page["page"],
            }

            chunks.append(chunk)

    enriched_chunks = _add_metadata(filename, chunks)

    return enriched_chunks

def _add_metadata(filename: str, chunks):
    enriched = []

    for i, chunk in enumerate(chunks):
        enriched.append({
            "id": f"{filename}_{i}",
            "text": chunk["text"],
            "page": chunk["page"],
            "source": filename
        })

    return enriched
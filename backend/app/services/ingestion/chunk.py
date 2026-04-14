from datetime import datetime

from app.models.schemas import Chunk

def chunk_text(filename, user_id: str, pages, chunk_size=200, overlap=50):
    """ Fixed size chunking """
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

    enriched_chunks = _add_metadata(filename, user_id, chunks)

    return enriched_chunks

def _add_metadata(filename: str, user_id: str, chunks):
    enriched : list[Chunk] = []

    for i, chunk in enumerate(chunks):
        enriched.append({
            "id": f"{filename}_{i}",
            "text": chunk["text"],
            "page": chunk["page"],
            "source": filename,
            "uploaded_by": user_id,
            "creation_date": datetime.now()
        })
        
    return enriched
from datetime import datetime
from typing import Literal
from langchain_experimental.text_splitter import SemanticChunker
from langchain_community.embeddings import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")


from app.models.schemas import Chunk




def chunk_text(filename, user_id: str, pages, chunk_technique: Literal["fixed", "semantic"] = "fixed", chunk_size=200, overlap=50):
    chunks = []

    if chunk_technique == "fixed":
        """ Fixed size chunking """

        for page in pages:
            words = page["text"].split()


            for i in range(0, len(words), chunk_size - overlap):
                chunk_words = words[i:i + chunk_size]
                chunk = {
                    "text": " ".join(chunk_words),
                    "page": page["page"],
                }

                chunks.append(chunk)

    else:
        semantic_splitter = SemanticChunker(embeddings)

        for page in pages:
            docs = semantic_splitter.create_documents([page["text"]])

            for doc in docs:
                chunks.append({
                    "text": doc.page_content,
                    "page": page["page"]
                })


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
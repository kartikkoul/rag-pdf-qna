
from app.services.ingestion.chunk import chunk_text
from app.services.ingestion.embed import embedder
from app.services.ingestion.extract_text_from_pdf import extract_text_from_pdf

from app.services.ingestion.store_embeds import store_embeds


def process_pdf(index_name:str, filename: str, pdf_file: bytes, user_id: str):
     #1 Parse Text
     pdf_pages = extract_text_from_pdf(pdf_file)

     #2 Chunking
     chunks = chunk_text(filename, pdf_pages)

     #3 Embedding
     dense_embeddings, sparse_embeddings = embedder.embed_chunks(chunks)

     #4 Store in VectorDB
     store_embeds(index_name, chunks, dense_embeddings, sparse_embeddings, user_id)

     return {
         "filename": filename,
         "chunk_count": len(chunks)
     }

from app.services.ingestion.chunk import chunk_text
from app.services.ingestion.embed import embed_chunks
from app.services.ingestion.extract_text_from_pdf import extract_text_from_pdf
from pprint import pprint

from app.services.ingestion.store_embeds import store_embeds


def process_pdf(filename: str, pdf_file: bytes):
     #1 Parse Text
     pdf_pages = extract_text_from_pdf(pdf_file)

     #2 Chunking
     chunks = chunk_text(filename, pdf_pages)

     #3 Embedding
     embeddings = embed_chunks(chunks)

     #4 Store in VectorDB
     store_embeds(chunks, embeddings)

     return {
         "filename": filename,
         "chunk_count": len(chunks)
     }
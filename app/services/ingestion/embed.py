from sentence_transformers import SentenceTransformer, SparseEncoder
from torch import Tensor
class ChunksEmbedder:

    def __init__(self)->None:
        self.dense_embeds_model = SentenceTransformer("all-MiniLM-L6-v2")
        self.sparse_embeds_encoder = SparseEncoder("naver/splade-cocondenser-ensembledistil")
    
    def embed_chunks(self, chunks):
        """ Creates dense embeddings(Used for Similarity/Semantic Search) & pinecone compatible sparse embeddings(Used for Lexical Search) for the chunks - """
        texts = [chunk["text"] for chunk in chunks]

        dense_embeddings = self.dense_embeds_model.encode(texts)
        sparse_embeddings = self.sparse_embeds_encoder.encode(texts, convert_to_sparse_tensor=True)
        
        pinecone_compatible_sparse_embeddings = [self.convert_to_pinecone_compatible_sparse_tensor(sparse_tensor) for sparse_tensor in sparse_embeddings]

        return [dense_embeddings, pinecone_compatible_sparse_embeddings]

    def convert_to_pinecone_compatible_sparse_tensor(self, sparse_tensor: Tensor):
        """ Creates sparse embeddings for a single document """
        coo = sparse_tensor.coalesce()


        pc_compatible_sparse_vectors = {
            "indices": coo.indices().tolist()[0],
            "values": coo.values().tolist()
        }

        
        return pc_compatible_sparse_vectors

embedder = ChunksEmbedder()
        
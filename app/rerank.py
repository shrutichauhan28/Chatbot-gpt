from transformers import AutoTokenizer, AutoModel
import torch
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from rank_bm25 import BM25Okapi
  # Assuming your script is named data.py

# Load the BAAI model and tokenizer from Hugging Face
tokenizer = AutoTokenizer.from_pretrained("BAAI/bge-large-en")
model = AutoModel.from_pretrained("BAAI/bge-large-en")

def get_embeddings(texts):
    """
    Generate embeddings for the given texts using BAAI model.

    Args:
        texts (list): List of texts for which embeddings are to be generated.

    Returns:
        numpy.ndarray: Array of embeddings.
    """
    inputs = tokenizer(texts, padding=True, truncation=True, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
    # We use the pooled output (which represents [CLS] token) as the sentence embedding
    embeddings = outputs.last_hidden_state.mean(dim=1)
    return embeddings

def rank_chunks_with_bm25(chunks, query):
    """
    First rank chunks based on cosine similarity to the query using the BAAI model.
    Then, rerank the top chunks using BM25.

    Args:
        chunks (list): List of document chunks.
        query (str): The query for which to rank the chunks.

    Returns:
        List of tuples (chunk, score) sorted by BM25 relevance.
    """
    # Get the chunk texts
    chunk_texts = [chunk.page_content for chunk in chunks]

    # Rank the chunks using embeddings
    chunk_embeddings = get_embeddings(chunk_texts)
    query_embedding = get_embeddings([query])
    
    # Compute cosine similarity between query and each chunk
    similarity_scores = cosine_similarity(query_embedding, chunk_embeddings)[0]

    # Pair each chunk with its similarity score
    ranked_chunks = [(chunk, score) for chunk, score in zip(chunks, similarity_scores)]

    # Sort the chunks by their cosine similarity score in descending order (most relevant first)
    ranked_chunks = sorted(ranked_chunks, key=lambda x: x[1], reverse=True)

    # After initial ranking with cosine similarity, rerank using BM25
    bm25_corpus = [chunk.page_content.split() for chunk, _ in ranked_chunks]  # Tokenize chunks
    bm25 = BM25Okapi(bm25_corpus)

    # Tokenize the query for BM25
    query_tokens = query.split()

    # Get BM25 scores for the query
    bm25_scores = bm25.get_scores(query_tokens)

    # Combine BM25 scores with ranked chunks
    reranked_chunks = [(chunk, bm25_score) for (chunk, _), bm25_score in zip(ranked_chunks, bm25_scores)]

    # Sort again by BM25 score in descending order
    reranked_chunks = sorted(reranked_chunks, key=lambda x: x[1], reverse=True)

    return reranked_chunks

# # Load the chunks from the directory (same as the previous code block)
# directory_path = '../data/Organizational Information/'
# chunks = load_n_split(path=directory_path, splitter="token")

# # Example query
# query = "i want to knoe if there are any internal opening for me?"

# # Rank the chunks based on the query, and then rerank using BM25
# reranked_chunks = rank_chunks_with_bm25(chunks, query)

# # Print the ranked chunks and their BM25 scores
# for i, (chunk, score) in enumerate(reranked_chunks):
#     print(f"Rank {i+1} (BM25 Score: {score}):\n{chunk.page_content}\n")

"""
Lightweight embedding configuration using OpenAI API
More memory-efficient than local sentence-transformers
"""

import os
from langchain_openai import OpenAIEmbeddings
from src.utils.config import Config


def get_lightweight_embeddings():
    """
    Get OpenAI embeddings (API-based, no local model loading)
    Uses much less memory than sentence-transformers
    """
    
    # Check if OpenAI API key is available
    openai_key = os.getenv("OPENAI_API_KEY")
    
    if openai_key:
        print("✅ Using OpenAI embeddings (memory efficient)")
        return OpenAIEmbeddings(
            openai_api_key=openai_key,
            model="text-embedding-3-small",  # Smaller, faster model
            chunk_size=1000,
            max_retries=3
        )
    else:
        # Fallback: Try to use a very small local model
        print("⚠️  No OpenAI key found, using minimal local embeddings")
        try:
            from sentence_transformers import SentenceTransformer
            from langchain_huggingface import HuggingFaceEmbeddings
            
            # Use the smallest possible model
            model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')
            
            return HuggingFaceEmbeddings(
                model_name='all-MiniLM-L6-v2',
                model_kwargs={'device': 'cpu'},
                encode_kwargs={'normalize_embeddings': True, 'batch_size': 1}
            )
        except Exception as e:
            print(f"❌ Error loading embeddings: {e}")
            raise Exception("No valid embedding model available. Please set OPENAI_API_KEY.")


# Alias for compatibility
get_embeddings = get_lightweight_embeddings
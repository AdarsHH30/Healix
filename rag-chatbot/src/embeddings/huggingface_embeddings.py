from langchain_huggingface import HuggingFaceEmbeddings
from src.utils.config import Config
import logging

logger = logging.getLogger(__name__)


def get_embeddings(model_name: str = None):
    """
    Initialize and return HuggingFace embeddings

    Args:
        model_name: Name of the sentence-transformers model

    Returns:
        HuggingFaceEmbeddings instance
    """
    model_name = model_name or Config.EMBEDDING_MODEL

    logger.info(f"Loading embedding model: {model_name}")

    embeddings = HuggingFaceEmbeddings(
        model_name=model_name,
        model_kwargs={"device": "cpu"},  # Change to 'cuda' if GPU available
        encode_kwargs={"normalize_embeddings": True},
    )

    logger.info("✓ Embedding model loaded successfully")

    return embeddings

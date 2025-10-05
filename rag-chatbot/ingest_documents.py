"""
Document Ingestion Script for RAG System
Loads documents from the data/documents folder and adds them to ChromaDB
"""

import os
import sys
from pathlib import Path
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
import logging

# Add src to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.utils.config import Config
from src.embeddings.huggingface_embeddings import get_embeddings
from src.vectorstore.chroma_store import ChromaStore

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def load_documents(documents_path: str):
    """
    Load documents from the specified directory

    Args:
        documents_path: Path to documents directory

    Returns:
        List of Document objects
    """
    logger.info(f"Loading documents from: {documents_path}")

    # Check if directory exists
    if not os.path.exists(documents_path):
        logger.error(f"Documents directory not found: {documents_path}")
        return []

    # Check for different file types
    documents = []

    # Load markdown files
    try:
        md_loader = DirectoryLoader(
            documents_path, glob="**/*.md", loader_cls=TextLoader
        )
        md_docs = md_loader.load()
        documents.extend(md_docs)
        logger.info(f"Loaded {len(md_docs)} markdown files")
    except Exception as e:
        logger.warning(f"Error loading markdown files: {str(e)}")

    # Load text files
    try:
        txt_loader = DirectoryLoader(
            documents_path, glob="**/*.txt", loader_cls=TextLoader
        )
        txt_docs = txt_loader.load()
        documents.extend(txt_docs)
        logger.info(f"Loaded {len(txt_docs)} text files")
    except Exception as e:
        logger.warning(f"Error loading text files: {str(e)}")

    if not documents:
        logger.warning("No documents found!")
    else:
        logger.info(f"Total documents loaded: {len(documents)}")

    return documents


def split_documents(documents: list, chunk_size: int = None, chunk_overlap: int = None):
    """
    Split documents into smaller chunks

    Args:
        documents: List of Document objects
        chunk_size: Size of each chunk
        chunk_overlap: Overlap between chunks

    Returns:
        List of chunked Document objects
    """
    chunk_size = chunk_size or Config.CHUNK_SIZE
    chunk_overlap = chunk_overlap or Config.CHUNK_OVERLAP

    logger.info(
        f"Splitting documents (chunk_size={chunk_size}, overlap={chunk_overlap})..."
    )

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        add_start_index=True,
    )

    chunks = text_splitter.split_documents(documents)

    logger.info(f"Created {len(chunks)} chunks from {len(documents)} documents")

    return chunks


def ingest_documents():
    """Main function to ingest documents into ChromaDB"""
    try:
        logger.info("Starting document ingestion process...")

        # Initialize embeddings
        logger.info("Initializing embeddings...")
        embeddings = get_embeddings()

        # Initialize vector store
        logger.info("Initializing vector store...")
        vector_store = ChromaStore(embeddings=embeddings)

        # Load documents
        documents = load_documents(Config.DOCUMENTS_PATH)

        if not documents:
            logger.error(
                "No documents to ingest. Please add documents to the data/documents folder."
            )
            return

        # Split documents into chunks
        chunks = split_documents(documents)

        # Add documents to vector store
        logger.info("Adding documents to vector store...")
        vector_store.add_documents(chunks)

        # Get final count
        final_count = vector_store.get_collection_count()

        logger.info("=" * 50)
        logger.info("✓ Document ingestion completed successfully!")
        logger.info(f"✓ Total documents in collection: {final_count}")
        logger.info("=" * 50)

    except Exception as e:
        logger.error(f"Error during ingestion: {str(e)}")
        raise


if __name__ == "__main__":
    ingest_documents()

"""
Render deployment initialization script
Runs after build to set up the application
"""

import os
import sys
import logging
from pathlib import Path

# Add src to path  
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.utils.config import Config
from src.embeddings.huggingface_embeddings import get_embeddings
from src.vectorstore.chroma_store import ChromaStore

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def initialize_for_render():
    """Initialize the application for Render deployment"""
    try:
        logger.info("🚀 Initializing RAG Chatbot for Render...")
        
        # Validate configuration
        logger.info("📋 Validating configuration...")
        Config.validate()
        
        # Initialize embeddings (this will download models if needed)
        logger.info("📚 Initializing embeddings...")
        embeddings = get_embeddings()
        logger.info("✅ Embeddings initialized successfully")
        
        # Initialize vector store
        logger.info("🗄️  Initializing vector store...")
        vector_store = ChromaStore(embeddings=embeddings)
        
        # Check if documents exist
        doc_count = vector_store.get_collection_count()
        logger.info(f"📊 Vector store initialized with {doc_count} documents")
        
        if doc_count == 0:
            logger.warning("⚠️  No documents found in vector store.")
            logger.info("💡 Add documents using the /ingest endpoint or run ingest_documents.py")
        
        logger.info("🎉 Render initialization completed successfully!")
        return True
        
    except Exception as e:
        logger.error(f"❌ Initialization failed: {str(e)}")
        return False

if __name__ == "__main__":
    success = initialize_for_render()
    sys.exit(0 if success else 1)
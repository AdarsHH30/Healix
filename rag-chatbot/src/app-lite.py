"""
Modified app.py for 512MB memory limit
Uses lightweight embeddings and optimized imports
"""

import sys
import os
import gc

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Configure logging to use less memory
logging.basicConfig(
    level=logging.WARNING,  # Less verbose
    format="%(levelname)s - %(message)s"  # Shorter format
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Global variables for lazy loading
_embeddings = None
_vector_store = None
_llm_client = None
_rag_retriever = None

def get_embeddings():
    """Lazy load embeddings to save memory"""
    global _embeddings
    if _embeddings is None:
        from src.embeddings.lightweight_embeddings import get_lightweight_embeddings
        _embeddings = get_lightweight_embeddings()
        gc.collect()  # Force garbage collection
    return _embeddings

def get_vector_store():
    """Lazy load vector store"""
    global _vector_store
    if _vector_store is None:
        from src.vectorstore.chroma_store import ChromaStore
        _vector_store = ChromaStore(embeddings=get_embeddings())
        gc.collect()
    return _vector_store

def get_llm_client():
    """Lazy load LLM client"""
    global _llm_client
    if _llm_client is None:
        from src.llm.groq_client import GroqClient
        _llm_client = GroqClient()
        gc.collect()
    return _llm_client

def get_rag_retriever():
    """Lazy load RAG retriever"""
    global _rag_retriever
    if _rag_retriever is None:
        from src.retriever.rag_retriever import RAGRetriever
        _rag_retriever = RAGRetriever(
            vector_store=get_vector_store(), 
            llm_client=get_llm_client()
        )
        gc.collect()
    return _rag_retriever

@app.route("/", methods=["GET"])
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "message": "RAG Chatbot API (Lite Mode)",
        "memory_optimized": True,
        "endpoints": {
            "/query": "POST - Query the RAG system",
            "/ingest": "POST - Ingest documents into vector store",
            "/health": "GET - Health check",
            "/stats": "GET - Get system statistics",
        },
    })

@app.route("/health", methods=["GET"])
def health():
    """Health check with system info"""
    try:
        from src.utils.config import Config
        
        # Only initialize if needed for health check
        vector_store = get_vector_store()
        doc_count = vector_store.get_collection_count()
        
        return jsonify({
            "status": "healthy",
            "mode": "lightweight",
            "documents_count": doc_count,
            "model": Config.LLM_MODEL,
            "chroma_mode": "cloud" if Config.is_cloud_mode() else "local",
        })
    except Exception as e:
        return jsonify({"status": "unhealthy", "error": str(e)}), 500

@app.route("/stats", methods=["GET"])
def stats():
    """Get system statistics"""
    try:
        from src.utils.config import Config
        vector_store = get_vector_store()
        
        return jsonify({
            "collection_name": vector_store.collection_name,
            "documents_count": vector_store.get_collection_count(),
            "retrieval_k": Config.RETRIEVAL_K,
            "similarity_threshold": Config.SIMILARITY_THRESHOLD,
            "llm_model": Config.LLM_MODEL,
            "mode": "memory_optimized"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/query", methods=["POST"])
def query():
    """Query the RAG system"""
    try:
        data = request.get_json()

        if not data or "query" not in data:
            return jsonify({"error": "Missing 'query' field in request body"}), 400

        user_query = data.get("query", "").strip()
        if not user_query:
            return jsonify({"error": "Query cannot be empty"}), 400

        logger.info(f"Processing query: {user_query[:50]}...")

        # Lazy load components only when needed
        rag_retriever = get_rag_retriever()
        result = rag_retriever.generate_answer(user_query)

        # Clean up memory after processing
        gc.collect()

        return jsonify({
            "query": user_query,
            "answer": result["answer"],
            "sources": result["sources"],
            "context_preview": result["context"],
        })

    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route("/ingest", methods=["POST"])
def ingest_documents():
    """Ingest documents into the vector store"""
    try:
        data = request.get_json()
        
        if not data or "text" not in data:
            return jsonify({"error": "Missing 'text' field in request body"}), 400
            
        text_content = data.get("text", "").strip()
        metadata = data.get("metadata", {})
        
        if not text_content:
            return jsonify({"error": "Text content cannot be empty"}), 400
            
        logger.info(f"Ingesting document with {len(text_content)} characters...")
        
        # Import only when needed
        from langchain_core.documents import Document
        from langchain.text_splitter import RecursiveCharacterTextSplitter
        from src.utils.config import Config
        
        doc = Document(page_content=text_content, metadata=metadata)
        
        # Split document into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=Config.CHUNK_SIZE,
            chunk_overlap=Config.CHUNK_OVERLAP,
            length_function=len,
        )
        
        chunks = text_splitter.split_documents([doc])
        
        # Add to vector store
        vector_store = get_vector_store()
        vector_store.add_documents(chunks)
        
        new_count = vector_store.get_collection_count()
        
        # Clean up memory
        gc.collect()
        
        return jsonify({
            "message": "Document ingested successfully",
            "chunks_created": len(chunks),
            "total_documents": new_count
        })
        
    except Exception as e:
        logger.error(f"Error ingesting document: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    from src.utils.config import Config
    logger.info(f"Starting Flask server in lite mode on port {Config.FLASK_PORT}...")
    app.run(host="0.0.0.0", port=Config.FLASK_PORT, debug=False)
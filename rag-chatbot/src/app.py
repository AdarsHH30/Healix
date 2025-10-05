import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, request, jsonify
from flask_cors import CORS
from src.embeddings.huggingface_embeddings import get_embeddings
from src.vectorstore.chroma_store import ChromaStore
from src.llm.groq_client import GroqClient
from src.retriever.rag_retriever import RAGRetriever
from src.utils.config import Config
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize components
logger.info("Initializing RAG system components...")

try:
    # Initialize embeddings
    embeddings = get_embeddings()

    # Initialize vector store
    vector_store = ChromaStore(embeddings=embeddings)

    # Initialize LLM client
    llm_client = GroqClient()

    # Initialize RAG retriever
    rag_retriever = RAGRetriever(vector_store=vector_store, llm_client=llm_client)

    logger.info("✓ All components initialized successfully")

except Exception as e:
    logger.error(f"Failed to initialize components: {str(e)}")
    raise


@app.route("/", methods=["GET"])
def home():
    """Health check endpoint"""
    return jsonify(
        {
            "status": "ok",
            "message": "RAG Chatbot API is running",
            "endpoints": {
                "/query": "POST - Query the RAG system",
                "/health": "GET - Health check",
                "/stats": "GET - Get system statistics",
            },
        }
    )


@app.route("/health", methods=["GET"])
def health():
    """Health check with system info"""
    try:
        doc_count = vector_store.get_collection_count()
        return jsonify(
            {
                "status": "healthy",
                "documents_count": doc_count,
                "model": Config.LLM_MODEL,
                "embedding_model": Config.EMBEDDING_MODEL,
                "chroma_mode": "cloud" if Config.is_cloud_mode() else "local",
            }
        )
    except Exception as e:
        return jsonify({"status": "unhealthy", "error": str(e)}), 500


@app.route("/stats", methods=["GET"])
def stats():
    """Get system statistics"""
    try:
        return jsonify(
            {
                "collection_name": vector_store.collection_name,
                "documents_count": vector_store.get_collection_count(),
                "retrieval_k": Config.RETRIEVAL_K,
                "similarity_threshold": Config.SIMILARITY_THRESHOLD,
                "llm_model": Config.LLM_MODEL,
                "embedding_model": Config.EMBEDDING_MODEL,
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/query", methods=["POST"])
def query():
    """
    Query the RAG system

    Expected JSON body:
    {
        "query": "Your question here"
    }
    """
    try:
        # Get query from request
        data = request.get_json()

        if not data or "query" not in data:
            return jsonify({"error": "Missing 'query' field in request body"}), 400

        user_query = data.get("query", "").strip()

        if not user_query:
            return jsonify({"error": "Query cannot be empty"}), 400

        logger.info(f"Processing query: {user_query[:100]}...")

        # Generate answer using RAG
        result = rag_retriever.generate_answer(user_query)

        return jsonify(
            {
                "query": user_query,
                "answer": result["answer"],
                "sources": result["sources"],
                "context_preview": result["context"],
            }
        )

    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    logger.info(f"Starting Flask server on port {Config.FLASK_PORT}...")
    app.run(host="0.0.0.0", port=Config.FLASK_PORT, debug=Config.FLASK_DEBUG)

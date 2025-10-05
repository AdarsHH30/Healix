import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
load_dotenv()


class Config:
    """Configuration class for RAG system"""

    # API Keys
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

    # Model Configuration
    EMBEDDING_MODEL = os.getenv(
        "EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2"
    )
    LLM_MODEL = os.getenv("LLM_MODEL", "llama-3.3-70b-versatile")

    # ChromaDB Cloud Configuration (Trychroma)
    CHROMA_CLOUD_TENANT = os.getenv("CHROMA_CLOUD_TENANT")
    CHROMA_CLOUD_DATABASE = os.getenv("CHROMA_CLOUD_DATABASE")
    CHROMA_CLOUD_API_KEY = os.getenv("CHROMA_CLOUD_API_KEY")
    CHROMA_COLLECTION_NAME = os.getenv("CHROMA_COLLECTION_NAME", "rag_documents")

    # Local ChromaDB fallback
    CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", "./chroma_db")

    # Paths
    DOCUMENTS_PATH = os.getenv("DOCUMENTS_PATH", "./data/documents")

    # Chunk Configuration
    CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "500"))
    CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "50"))

    # Retrieval Configuration
    RETRIEVAL_K = int(os.getenv("RETRIEVAL_K", "3"))
    SIMILARITY_THRESHOLD = float(os.getenv("SIMILARITY_THRESHOLD", "0.7"))

    # Flask Configuration
    FLASK_PORT = int(os.getenv("FLASK_PORT", "5000"))
    FLASK_DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"

    @classmethod
    def validate(cls):
        """Validate required configuration"""
        # Check if API keys are provided
        missing_keys = []

        if not cls.GROQ_API_KEY or cls.GROQ_API_KEY == "your_groq_api_key_here":
            missing_keys.append("GROQ_API_KEY")

        if not cls.CHROMA_CLOUD_TENANT or cls.CHROMA_CLOUD_TENANT == "your_tenant_id":
            missing_keys.append("CHROMA_CLOUD_TENANT")

        if (
            not cls.CHROMA_CLOUD_DATABASE
            or cls.CHROMA_CLOUD_DATABASE == "your_database_name"
        ):
            missing_keys.append("CHROMA_CLOUD_DATABASE")

        if (
            not cls.CHROMA_CLOUD_API_KEY
            or cls.CHROMA_CLOUD_API_KEY == "your_chroma_api_key"
        ):
            missing_keys.append("CHROMA_CLOUD_API_KEY")

        if missing_keys:
            print(
                "\n⚠ WARNING: The following configuration values need to be set in .env file:"
            )
            for key in missing_keys:
                print(f"  - {key}")
            print("\nYou can still test the system, but some features may not work.\n")

        # Create directories if they don't exist
        try:
            Path(cls.DOCUMENTS_PATH).mkdir(parents=True, exist_ok=True)
        except Exception as e:
            pass  # Directory already exists

        # Check if using cloud or local ChromaDB
        if cls.is_cloud_mode():
            if not all(
                [
                    cls.CHROMA_CLOUD_TENANT,
                    cls.CHROMA_CLOUD_DATABASE,
                    cls.CHROMA_CLOUD_API_KEY,
                ]
            ):
                raise ValueError(
                    "ChromaDB Cloud credentials incomplete. Required: "
                    "CHROMA_CLOUD_TENANT, CHROMA_CLOUD_DATABASE, CHROMA_CLOUD_API_KEY"
                )
        else:
            Path(cls.CHROMA_DB_PATH).mkdir(parents=True, exist_ok=True)

        return True

    @classmethod
    def is_cloud_mode(cls):
        """Check if using ChromaDB Cloud"""
        return bool(cls.CHROMA_CLOUD_TENANT and cls.CHROMA_CLOUD_DATABASE)


# Validate config on import
Config.validate()

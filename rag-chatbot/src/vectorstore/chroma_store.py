import chromadb
from chromadb.config import Settings
from langchain_chroma import Chroma
from src.utils.config import Config
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)


class ChromaStore:
    """Manages ChromaDB vector store (Cloud or Local)"""

    def __init__(self, embeddings, collection_name: str = None):
        """
        Initialize ChromaDB store

        Args:
            embeddings: Embeddings instance (HuggingFaceEmbeddings)
            collection_name: Name of the collection
        """
        self.embeddings = embeddings
        self.collection_name = collection_name or Config.CHROMA_COLLECTION_NAME
        self.client = None
        self.vector_store = None
        self._initialize_client()

    def _initialize_client(self):
        """Initialize ChromaDB client (Cloud or Local)"""
        try:
            if Config.is_cloud_mode():
                logger.info(
                    f"Connecting to ChromaDB Cloud: {Config.CHROMA_CLOUD_TENANT}/{Config.CHROMA_CLOUD_DATABASE}"
                )

                # Initialize ChromaDB Cloud client
                self.client = chromadb.CloudClient(
                    tenant=Config.CHROMA_CLOUD_TENANT,
                    database=Config.CHROMA_CLOUD_DATABASE,
                    api_key=Config.CHROMA_CLOUD_API_KEY,
                )
                logger.info("✓ ChromaDB Cloud connected successfully")
            else:
                logger.info(f"Using local ChromaDB at {Config.CHROMA_DB_PATH}")

                # Initialize local ChromaDB client
                self.client = chromadb.PersistentClient(
                    path=Config.CHROMA_DB_PATH,
                    settings=Settings(anonymized_telemetry=False, allow_reset=True),
                )
                logger.info("✓ Local ChromaDB initialized successfully")

            # Initialize LangChain Chroma wrapper
            self.vector_store = Chroma(
                client=self.client,
                collection_name=self.collection_name,
                embedding_function=self.embeddings,
            )

            logger.info(f"✓ Using collection: {self.collection_name}")

        except Exception as e:
            logger.error(f"Failed to initialize ChromaDB: {str(e)}")
            raise

    def add_documents(self, documents: List, ids: Optional[List[str]] = None):
        """
        Add documents to the vector store

        Args:
            documents: List of LangChain Document objects
            ids: Optional list of document IDs

        Returns:
            List of document IDs
        """
        try:
            logger.info(f"Adding {len(documents)} documents to ChromaDB...")

            result_ids = self.vector_store.add_documents(documents=documents, ids=ids)

            logger.info(f"✓ Successfully added {len(result_ids)} documents")
            return result_ids

        except Exception as e:
            logger.error(f"Error adding documents: {str(e)}")
            raise

    def similarity_search(self, query: str, k: int = None):
        """
        Search for similar documents

        Args:
            query: Search query text
            k: Number of results to return

        Returns:
            List of Document objects
        """
        k = k or Config.RETRIEVAL_K

        try:
            results = self.vector_store.similarity_search(query=query, k=k)

            logger.info(f"Found {len(results)} similar documents")
            return results

        except Exception as e:
            logger.error(f"Error in similarity search: {str(e)}")
            raise

    def similarity_search_with_score(self, query: str, k: int = None):
        """
        Search for similar documents with relevance scores

        Args:
            query: Search query text
            k: Number of results to return

        Returns:
            List of tuples (Document, relevance_score)
        """
        k = k or Config.RETRIEVAL_K

        try:
            results = self.vector_store.similarity_search_with_relevance_scores(
                query=query, k=k
            )

            # Filter by similarity threshold
            filtered_results = [
                (doc, score)
                for doc, score in results
                if score >= Config.SIMILARITY_THRESHOLD
            ]

            logger.info(
                f"Found {len(results)} documents, "
                f"{len(filtered_results)} above threshold {Config.SIMILARITY_THRESHOLD}"
            )

            return filtered_results

        except Exception as e:
            logger.error(f"Error in similarity search with scores: {str(e)}")
            raise

    def get_collection_count(self):
        """Get the number of documents in the collection"""
        try:
            collection = self.client.get_collection(name=self.collection_name)
            count = collection.count()
            logger.info(
                f"Collection '{self.collection_name}' contains {count} documents"
            )
            return count
        except Exception as e:
            logger.warning(f"Could not get collection count: {str(e)}")
            return 0

    def delete_collection(self):
        """Delete the entire collection"""
        try:
            self.client.delete_collection(name=self.collection_name)
            logger.info(f"✓ Collection '{self.collection_name}' deleted")
        except Exception as e:
            logger.error(f"Error deleting collection: {str(e)}")
            raise

    def collection_exists(self):
        """Check if the collection exists"""
        try:
            collections = self.client.list_collections()
            return any(col.name == self.collection_name for col in collections)
        except Exception as e:
            logger.error(f"Error checking collection existence: {str(e)}")
            return False

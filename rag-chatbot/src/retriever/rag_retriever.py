from src.vectorstore.chroma_store import ChromaStore
from src.llm.groq_client import GroqClient
from src.utils.config import Config
import logging

logger = logging.getLogger(__name__)


class RAGRetriever:
    """RAG system that combines document retrieval with LLM generation"""

    def __init__(self, vector_store: ChromaStore, llm_client: GroqClient):
        """
        Initialize RAG retriever

        Args:
            vector_store: ChromaStore instance
            llm_client: GroqClient instance
        """
        self.vector_store = vector_store
        self.llm_client = llm_client
        logger.info("✓ RAG Retriever initialized")

    def retrieve_documents(self, query: str, k: int = None):
        """
        Retrieve relevant documents for a query

        Args:
            query: User's question
            k: Number of documents to retrieve

        Returns:
            List of tuples (Document, score)
        """
        k = k or Config.RETRIEVAL_K

        logger.info(f"Retrieving documents for query: {query[:50]}...")

        # Use similarity search with scores
        results = self.vector_store.similarity_search_with_score(query, k=k)

        if not results:
            logger.warning("No relevant documents found")
        else:
            logger.info(f"Retrieved {len(results)} relevant documents")

        return results

    def generate_answer(self, query: str) -> dict:
        """
        Generate an answer for the query using RAG

        Args:
            query: User's question

        Returns:
            Dictionary with answer and sources
        """
        try:
            # Retrieve relevant documents
            results = self.retrieve_documents(query)

            if not results:
                return {
                    "answer": "I don't have enough information to answer that question.",
                    "sources": [],
                    "context": "",
                }

            # Prepare context from retrieved documents
            context_parts = []
            sources = []

            for doc, score in results:
                context_parts.append(doc.page_content)
                source = doc.metadata.get("source", "Unknown")
                sources.append(f"{source} (relevance: {score:.2f})")

            context = "\n\n---\n\n".join(context_parts)

            # Generate answer using LLM
            answer = self.llm_client.generate_answer(query, context)

            return {
                "answer": answer,
                "sources": sources,
                "context": context[:500] + "..." if len(context) > 500 else context,
            }

        except Exception as e:
            logger.error(f"Error generating answer: {str(e)}")
            raise

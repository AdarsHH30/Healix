from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from src.utils.config import Config
import logging

logger = logging.getLogger(__name__)


class GroqClient:
    """Groq LLM client for answer generation"""

    def __init__(self, model_name: str = None):
        """
        Initialize Groq client

        Args:
            model_name: Name of the Groq model to use
        """
        self.model_name = model_name or Config.LLM_MODEL
        self.llm = None
        self._initialize_llm()

    def _initialize_llm(self):
        """Initialize the Groq LLM"""
        try:
            logger.info(f"Initializing Groq LLM: {self.model_name}")

            self.llm = ChatGroq(
                api_key=Config.GROQ_API_KEY,
                model=self.model_name,
                temperature=0.7,
                max_tokens=1024,
            )

            logger.info("✓ Groq LLM initialized successfully")

        except Exception as e:
            logger.error(f"Failed to initialize Groq LLM: {str(e)}")
            raise

    def generate_answer(self, query: str, context: str) -> str:
        """
        Generate an answer using the LLM

        Args:
            query: User's question
            context: Retrieved context from documents

        Returns:
            Generated answer as string
        """
        try:
            # Create prompt template
            prompt_template = ChatPromptTemplate.from_template(
                """You are a helpful AI assistant. Answer the question based on the context provided.
If the answer cannot be found in the context, say "I don't have enough information to answer that question."

Context:
{context}

Question: {question}

Answer:"""
            )

            # Format the prompt
            formatted_prompt = prompt_template.format(context=context, question=query)

            # Generate response
            response = self.llm.invoke(formatted_prompt)

            # Extract the text content
            answer = response.content if hasattr(response, "content") else str(response)

            logger.info("✓ Answer generated successfully")
            return answer

        except Exception as e:
            logger.error(f"Error generating answer: {str(e)}")
            raise

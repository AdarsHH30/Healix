/**
 * Chatbot API Service
 * Handles communication with the RAG chatbot backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL || 'http://localhost:5000';

export interface ChatbotQueryRequest {
  query: string;
}

export interface ChatbotQueryResponse {
  query: string;
  answer: string;
  sources: string[];
  context_preview: string;
}

export interface ChatbotError {
  error: string;
  details?: string;
}

/**
 * Send a query to the RAG chatbot backend
 * @param query - The user's question
 * @returns The chatbot's response with answer and sources
 */
export async function sendChatbotQuery(query: string): Promise<ChatbotQueryResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData: ChatbotError = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data: ChatbotQueryResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to communicate with chatbot: ${error.message}`);
    }
    throw new Error('Failed to communicate with chatbot: Unknown error');
  }
}

/**
 * Check if the chatbot backend is healthy
 * @returns Health status information
 */
export async function checkChatbotHealth(): Promise<{
  status: string;
  documents_count?: number;
  model?: string;
  embedding_model?: string;
  chroma_mode?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to check chatbot health:', error);
    throw error;
  }
}

"""
Ultra-minimal RAG chatbot for 512MB deployment
Uses only Groq API directly without heavy vector stores
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Configure minimal logging
logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize Groq client
groq_client = None

def get_groq_client():
    """Initialize Groq client"""
    global groq_client
    if groq_client is None:
        try:
            from groq import Groq
            api_key = os.getenv("GROQ_API_KEY")
            if not api_key:
                raise ValueError("GROQ_API_KEY not found")
            groq_client = Groq(api_key=api_key)
        except Exception as e:
            logger.error(f"Failed to initialize Groq client: {e}")
            raise
    return groq_client

# Simple knowledge base (no vector store needed for 512MB)
FIRST_AID_KNOWLEDGE = """
First Aid Basics:

1. CPR (Cardiopulmonary Resuscitation):
- Check responsiveness
- Call 911
- 30 chest compressions, 2 rescue breaths
- Continue until help arrives

2. Choking:
- Encourage coughing
- 5 back blows between shoulder blades  
- 5 abdominal thrusts (Heimlich maneuver)

3. Bleeding:
- Apply direct pressure
- Elevate injured area above heart level
- Use clean cloth or bandage

4. Burns:
- Cool with running water for 10+ minutes
- Remove from heat source
- Do not use ice
- Cover with clean cloth

5. Emergency Numbers:
- Emergency: 911
- Poison Control: 1-800-222-1222

6. Basic Supplies:
- Bandages, gauze, antiseptic
- Pain relievers, thermometer
- Emergency contact numbers
"""

@app.route("/", methods=["GET"])
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "message": "Ultra-Minimal RAG Chatbot API",
        "mode": "groq_only",
        "memory_optimized": True,
        "endpoints": {
            "/query": "POST - Query the chatbot",
            "/health": "GET - Health check",
        },
    })

@app.route("/health", methods=["GET"])
def health():
    """Health check"""
    try:
        # Test Groq connection
        client = get_groq_client()
        return jsonify({
            "status": "healthy",
            "mode": "ultra_minimal",
            "groq_connected": True,
        })
    except Exception as e:
        return jsonify({
            "status": "unhealthy", 
            "error": str(e)
        }), 500

@app.route("/query", methods=["POST"])
def query():
    """Query the chatbot using Groq API with built-in knowledge"""
    try:
        data = request.get_json()
        if not data or "query" not in data:
            return jsonify({"error": "Missing 'query' field"}), 400

        user_query = data.get("query", "").strip()
        if not user_query:
            return jsonify({"error": "Query cannot be empty"}), 400

        # Create context-aware prompt
        system_prompt = f"""You are a helpful first aid assistant. Use the following knowledge base to answer questions about first aid, medical emergencies, and health topics.

Knowledge Base:
{FIRST_AID_KNOWLEDGE}

Instructions:
- Answer based on the provided knowledge
- Be clear and concise
- If asked about something not in the knowledge base, provide general first aid advice
- Always recommend calling 911 for serious emergencies
- Keep responses under 200 words

User Question: {user_query}"""

        # Call Groq API
        client = get_groq_client()
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt}
            ],
            model="llama-3.1-70b-versatile",
            temperature=0.3,
            max_tokens=300
        )

        answer = response.choices[0].message.content

        return jsonify({
            "query": user_query,
            "answer": answer,
            "source": "built_in_knowledge",
            "mode": "groq_direct"
        })

    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        return jsonify({
            "error": "Internal server error", 
            "details": str(e)
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
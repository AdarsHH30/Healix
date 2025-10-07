"""
Working First Aid Chatbot - 512MB Render Compatible
No dependencies on LangChain, ChromaDB, or embeddings
"""

import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Minimal logging
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
                raise ValueError("GROQ_API_KEY environment variable not set")
            groq_client = Groq(api_key=api_key)
            logger.info("Groq client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Groq client: {e}")
            raise
    return groq_client

# Comprehensive First Aid Knowledge Base
FIRST_AID_KNOWLEDGE = """
COMPREHENSIVE FIRST AID GUIDE

=== EMERGENCY PROCEDURES ===

1. CPR (Cardiopulmonary Resuscitation):
- Check for responsiveness (tap shoulders, shout "Are you OK?")
- Call 911 immediately
- Place heel of hand on center of chest, between nipples
- Push hard and fast at least 2 inches deep
- 30 chest compressions at 100-120 per minute
- Tilt head back, lift chin, give 2 rescue breaths
- Continue cycles until help arrives

2. Choking (Heimlich Maneuver):
- Ask "Are you choking?" 
- If conscious: 5 back blows between shoulder blades
- If still choking: 5 abdominal thrusts (hands below ribcage, thrust upward)
- Alternate back blows and abdominal thrusts
- If unconscious: begin CPR

3. Severe Bleeding:
- Apply direct pressure with clean cloth
- Elevate injured area above heart level if possible
- Don't remove embedded objects
- Apply pressure around the object
- Call 911 for severe bleeding

4. Burns:
- Cool with running water for 10-20 minutes
- Remove from heat source immediately
- Do NOT use ice, butter, or oils
- Cover with clean, dry cloth
- For severe burns (3rd degree): Call 911

5. Shock:
- Lay person down, elevate legs 12 inches
- Keep warm with blankets
- Don't give food or water
- Monitor breathing and pulse
- Call 911

=== COMMON INJURIES ===

6. Sprains and Strains:
- R.I.C.E method: Rest, Ice, Compression, Elevation
- Ice for 15-20 minutes every 2-3 hours
- Wrap with elastic bandage (not too tight)
- Elevate above heart level

7. Cuts and Scrapes:
- Clean hands before treating wound
- Stop bleeding with direct pressure
- Clean wound with water
- Apply antibiotic ointment if available
- Cover with sterile bandage

8. Nosebleeds:
- Sit upright, lean slightly forward
- Pinch soft part of nose for 10-15 minutes
- Breathe through mouth
- Don't tilt head back or lie down

9. Eye Injuries:
- Don't rub the eye
- Flush with clean water for 15 minutes
- Cover both eyes to prevent movement
- Seek medical attention immediately

=== MEDICAL EMERGENCIES ===

10. Heart Attack Signs:
- Chest pain or pressure
- Pain in arm, neck, jaw, back
- Shortness of breath, nausea
- Call 911 immediately
- Give aspirin if not allergic

11. Stroke Signs (F.A.S.T.):
- Face: Drooping on one side
- Arms: Weakness in one arm
- Speech: Slurred or strange
- Time: Call 911 immediately

12. Seizures:
- Don't restrain the person
- Clear area of dangerous objects
- Time the seizure
- Turn on side when seizure ends
- Call 911 if seizure lasts over 5 minutes

13. Allergic Reactions:
- Remove or avoid allergen
- Use EpiPen if available
- Call 911 for severe reactions
- Monitor breathing

=== EMERGENCY NUMBERS ===
- Emergency: 911
- Poison Control: 1-800-222-1222

=== BASIC FIRST AID KIT ===
- Bandages (various sizes)
- Gauze pads and tape
- Antiseptic wipes
- Thermometer
- Instant cold packs
- Elastic bandages
- Scissors and tweezers
- Emergency contact numbers
"""

@app.route("/", methods=["GET"])
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "message": "First Aid Chatbot API - Working Version",
        "mode": "groq_direct",
        "memory_optimized": True,
        "endpoints": {
            "/query": "POST - Ask first aid questions",
            "/health": "GET - Health check",
        },
    })

@app.route("/health", methods=["GET"])
def health():
    """Health check with Groq connection test"""
    try:
        # Test Groq connection
        client = get_groq_client()
        
        # Quick test call
        test_response = client.chat.completions.create(
            messages=[{"role": "user", "content": "Hello"}],
            model="llama-3.1-70b-versatile",
            max_tokens=10
        )
        
        return jsonify({
            "status": "healthy",
            "mode": "groq_direct_working",
            "groq_connected": True,
            "test_response": "OK"
        })
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e),
            "check": "Ensure GROQ_API_KEY is set correctly"
        }), 500

@app.route("/query", methods=["POST"])
def query():
    """Query the first aid chatbot"""
    try:
        data = request.get_json()
        if not data or "query" not in data:
            return jsonify({"error": "Missing 'query' field in request body"}), 400

        user_query = data.get("query", "").strip()
        if not user_query:
            return jsonify({"error": "Query cannot be empty"}), 400

        # Create comprehensive prompt with knowledge base
        system_prompt = f"""You are an expert first aid assistant. Use the comprehensive knowledge base below to answer first aid and medical emergency questions.

KNOWLEDGE BASE:
{FIRST_AID_KNOWLEDGE}

INSTRUCTIONS:
- Provide clear, step-by-step first aid instructions
- Always emphasize calling 911 for serious emergencies
- Be specific and practical
- If the question isn't about first aid, still try to help but mention your specialty
- Keep responses under 300 words but be thorough
- Use bullet points for steps when appropriate

USER QUESTION: {user_query}

RESPONSE:"""

        # Call Groq API
        client = get_groq_client()
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt}
            ],
            model="llama-3.1-70b-versatile",
            temperature=0.3,
            max_tokens=400
        )

        answer = response.choices[0].message.content

        return jsonify({
            "query": user_query,
            "answer": answer,
            "source": "first_aid_knowledge_base",
            "mode": "groq_direct"
        })

    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "details": str(e),
            "tip": "Check if GROQ_API_KEY is set correctly"
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    logger.info(f"Starting First Aid Chatbot on port {port}")
    app.run(host="0.0.0.0", port=port, debug=False)
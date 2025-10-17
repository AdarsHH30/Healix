# 🤖 Healix RAG Chatbot - How It Works

Welcome to the Healix AI Chatbot! This guide explains how the intelligent chatbot works in simple, easy-to-understand terms. No technical background needed! 😊

---

## 🧠 What is RAG?

**RAG** stands for **Retrieval-Augmented Generation**. Sounds complicated? Let's break it down with a simple analogy:

Imagine you're taking an open-book exam:

1. **Retrieval:** You look up relevant information in your textbook
2. **Augmented:** You use that information to enhance your answer
3. **Generation:** You write a complete, informed answer

That's exactly what our chatbot does! When you ask a question:

1. 📚 It searches through medical documents for relevant information
2. 🔍 It finds the most helpful passages
3. 💬 It uses AI to create a clear, accurate answer based on what it found

---

## 🎯 Why Use RAG?

Traditional chatbots just generate answers from their training. But RAG chatbots are smarter because they:

- ✅ **Use up-to-date information** from your documents
- ✅ **Provide accurate answers** based on real medical knowledge
- ✅ **Show sources** so you know where the information came from
- ✅ **Avoid making things up** by grounding answers in actual documents
- ✅ **Can be updated** by simply adding new documents

---

## 🚀 Getting Started

### What You Need:

1. **Python** (version 3.10 or higher)

   - Download from: https://www.python.org/
   - Python is the programming language the chatbot is written in

2. **Groq API Key** (free!)

   - Get it from: https://console.groq.com/
   - This powers the AI that generates answers
   - See the main README.md for detailed instructions

3. **Medical Documents** (optional)
   - PDF or text files with medical information
   - The chatbot learns from these to answer questions

---

## 📥 Installation Steps

### Step 1: Open Your Terminal

- **Windows:** Press `Win + R`, type `cmd`, press Enter
- **Mac:** Press `Cmd + Space`, type `terminal`, press Enter
- **Linux:** Press `Ctrl + Alt + T`

### Step 2: Navigate to the Chatbot Folder

```bash
# Go to the Healix project folder
cd path/to/Healix

# Enter the chatbot folder
cd rag-chatbot
```

### Step 3: Create a Virtual Environment

A virtual environment keeps all the chatbot's files organized and separate from other Python projects.

```bash
# Create the virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate

# On Mac/Linux:
source venv/bin/activate
```

You'll see `(venv)` appear in your terminal - that means it's working! ✅

### Step 4: Install Required Packages

```bash
./build-lite.sh
```

This downloads all the tools the chatbot needs. It might take 5-10 minutes. ⏳

**What's being installed?**

- **LangChain:** Framework for building AI applications
- **ChromaDB:** Database for storing document information
- **Sentence Transformers:** Converts text into numbers the AI can understand
- **Groq:** Fast AI language model
- **Flask:** Web server to handle requests
- And more!

### Step 5: Configure Your Settings

1. Find the file `.env.example` in the `rag-chatbot` folder
2. Create a copy and rename it to `.env`
3. Open `.env` with any text editor (Notepad, VS Code, etc.)
4. Fill in your Groq API key:

```env
# REQUIRED: Your Groq API key
GROQ_API_KEY=your_actual_groq_api_key_here

# AI Model Settings (these defaults work great!)
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
LLM_MODEL=llama-3.3-70b-versatile

# Database Settings - Leave empty for local mode (recommended for beginners)
CHROMA_CLOUD_TENANT=
CHROMA_CLOUD_DATABASE=
CHROMA_CLOUD_API_KEY=

# Collection name for your documents
CHROMA_COLLECTION_NAME=rag_documents

# Local storage paths
CHROMA_DB_PATH=./chroma_db
DOCUMENTS_PATH=./data/documents

# How the chatbot processes text
CHUNK_SIZE=500              # Size of text chunks (500 characters)
CHUNK_OVERLAP=50            # Overlap between chunks (50 characters)

# How many documents to retrieve when answering
RETRIEVAL_K=3               # Get top 3 most relevant documents
SIMILARITY_THRESHOLD=0.7    # How similar documents must be (0-1 scale)

# Server settings
FLASK_PORT=5000             # Port the server runs on
FLASK_DEBUG=false           # Set to true for development
```

5. Save the file

---

## 📚 How to Add Medical Knowledge

The chatbot learns from documents you provide. Here's how to add them:

### Step 1: Prepare Your Documents

1. Collect medical documents (PDFs, text files, markdown files)
2. Make sure they contain accurate, reliable information
3. Name them clearly (e.g., `flu_symptoms.txt`, `first_aid.md`)

### Step 2: Add Documents to the Folder

Put your documents in: `rag-chatbot/data/documents/`

```bash
# Example: Create a sample document
echo "The flu causes fever, cough, and body aches. Rest and fluids help recovery." > data/documents/flu_info.txt
```

### Step 3: Process the Documents

Run the ingestion script to teach the chatbot:

```bash
python ingest_documents.py
```

**What happens during ingestion?**

1. 📖 Reads all documents from `data/documents/`
2. ✂️ Splits them into smaller chunks (easier for AI to process)
3. 🔢 Converts text into embeddings (mathematical representations)
4. 💾 Stores everything in the ChromaDB database
5. ✅ Ready to answer questions!

You'll see progress messages like:

```
Processing document: flu_info.txt
Created 5 chunks
✓ Document ingested successfully
```

---

## 🎮 Running the Chatbot

### Start the Server:

```bash
gunicorn src.app-working:app
```

You'll see:

```
✓ All components initialized successfully
Starting Flask server on port 5000...
 * Running on http://0.0.0.0:5000
```

🎉 **Success!** The chatbot is now running!

### Test It:

Open another terminal window and try:

```bash
curl -X POST http://localhost:5000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What are the symptoms of flu?"}'
```

You'll get a response like:

```json
{
  "query": "What are the symptoms of flu?",
  "answer": "The flu typically causes fever, cough, and body aches. Rest and fluids help with recovery.",
  "sources": ["flu_info.txt"],
  "context_preview": "The flu causes fever, cough, and body aches..."
}
```

---

## 🔍 API Endpoints Explained

The chatbot provides several endpoints (like different doors to access features):

### 1. **GET** `/` - Home/Health Check

**What it does:** Checks if the server is running

**Try it:**

```bash
curl http://localhost:5000/
```

**Response:**

```json
{
  "status": "ok",
  "message": "RAG Chatbot API is running"
}
```

### 2. **GET** `/health` - System Health

**What it does:** Shows detailed system status

**Try it:**

```bash
curl http://localhost:5000/health
```

**Response:**

```json
{
  "status": "healthy",
  "documents_count": 10,
  "model": "llama-3.3-70b-versatile",
  "embedding_model": "sentence-transformers/all-MiniLM-L6-v2",
  "chroma_mode": "local"
}
```

### 3. **GET** `/stats` - Statistics

**What it does:** Shows chatbot statistics

**Try it:**

```bash
curl http://localhost:5000/stats
```

**Response:**

```json
{
  "collection_name": "rag_documents",
  "documents_count": 10,
  "retrieval_k": 3,
  "similarity_threshold": 0.7
}
```

### 4. **POST** `/query` - Ask Questions

**What it does:** The main endpoint - ask health questions!

**Try it:**

```bash
curl -X POST http://localhost:5000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "How do I treat a minor burn?"}'
```

**Response:**

```json
{
  "query": "How do I treat a minor burn?",
  "answer": "For minor burns, run cool water over the area for 10-15 minutes...",
  "sources": ["first_aid.txt"],
  "context_preview": "Minor burns should be treated with cool water..."
}
```

### 5. **POST** `/ingest` - Add Documents via API

**What it does:** Add new documents without restarting

**Try it:**

```bash
curl -X POST http://localhost:5000/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Headaches can be caused by stress, dehydration, or lack of sleep.",
    "metadata": {"source": "headache_info", "title": "Headache Causes"}
  }'
```

---

## 🧩 How It Works Behind the Scenes

Let's follow what happens when you ask: **"What are flu symptoms?"**

### Step 1: Question Received 📨

The Flask server receives your question through the `/query` endpoint.

### Step 2: Text Embedding 🔢

Your question is converted into a mathematical representation (embedding) using the Sentence Transformer model. Think of it like translating your question into a language the computer understands.

### Step 3: Document Search 🔍

The system searches the ChromaDB database for documents with similar embeddings. It's like finding books in a library that match your topic.

**Settings that matter:**

- `RETRIEVAL_K=3` → Get top 3 most relevant documents
- `SIMILARITY_THRESHOLD=0.7` → Only use documents that are at least 70% relevant

### Step 4: Context Building 📚

The top matching documents are combined into context. This is the "open book" the AI will reference.

### Step 5: Answer Generation 🤖

The Groq AI model (Llama 3.3) receives:

- Your original question
- The relevant context from documents
- Instructions to provide accurate, helpful answers

### Step 6: Response Formatting 📝

The system packages the answer with:

- The AI's response
- Source documents used
- Context preview
- Confidence indicators

### Step 7: Delivery 🚀

The complete response is sent back to you in JSON format.

**Total time:** Usually 1-3 seconds! ⚡

---

## 📁 Project Structure Explained

```
rag-chatbot/
├── src/                          # Main source code
│   ├── app.py                   # Flask server (the main program)
│   ├── embeddings/              # Text-to-number conversion
│   │   └── huggingface_embeddings.py
│   ├── vectorstore/             # Database management
│   │   └── chroma_store.py
│   ├── llm/                     # AI language model
│   │   └── groq_client.py
│   ├── retriever/               # Document retrieval logic
│   │   └── rag_retriever.py
│   └── utils/                   # Helper functions
│       └── config.py            # Configuration settings
│
├── data/                         # Your documents
│   └── documents/               # Put medical docs here!
│
├── chroma_db/                    # Database storage (auto-created)
│
├── venv/                         # Virtual environment (auto-created)
│
├── ingest_documents.py           # Script to process documents
├── requirements.txt              # List of required packages
├── .env                          # Your configuration (YOU CREATE THIS)
├── .env.example                  # Example configuration
├── gunicorn.conf.py              # Production server config
└── README.md                     # This file!
```

---

## 🛠️ Key Components Explained

### 1. **Embeddings** (`src/embeddings/`)

**What it does:** Converts text into numbers (vectors)

**Why it matters:** Computers can't understand words directly. Embeddings turn text into mathematical representations that capture meaning. Similar texts have similar embeddings.

**Model used:** `sentence-transformers/all-MiniLM-L6-v2`

- Fast and efficient
- Good at understanding medical terminology
- Works offline (no internet needed after download)

### 2. **Vector Store** (`src/vectorstore/`)

**What it does:** Stores and searches document embeddings

**Why it matters:** When you ask a question, the system needs to quickly find relevant documents. ChromaDB makes this super fast!

**Features:**

- Stores millions of documents
- Lightning-fast similarity search
- Works locally or in the cloud

### 3. **LLM Client** (`src/llm/`)

**What it does:** Generates human-like answers

**Why it matters:** This is the "brain" that creates responses. It reads the context and writes clear, helpful answers.

**Model used:** `llama-3.3-70b-versatile`

- 70 billion parameters (very smart!)
- Fast response times via Groq
- Great at medical and technical topics

### 4. **RAG Retriever** (`src/retriever/`)

**What it does:** Orchestrates the entire RAG process

**Why it matters:** This is the conductor of the orchestra. It coordinates retrieval, context building, and answer generation.

**Process:**

1. Takes your question
2. Finds relevant documents
3. Builds context
4. Generates answer
5. Returns formatted response

### 5. **Configuration** (`src/utils/config.py`)

**What it does:** Manages all settings

**Why it matters:** One place to control everything. Change settings without touching code!

---

## 🎛️ Customization Options

### Adjust Answer Quality:

**Get more context (slower but more comprehensive):**

```env
RETRIEVAL_K=5              # Get top 5 documents instead of 3
SIMILARITY_THRESHOLD=0.6   # Lower threshold = more documents included
```

**Get faster responses (less context):**

```env
RETRIEVAL_K=2              # Only top 2 documents
SIMILARITY_THRESHOLD=0.8   # Higher threshold = only very relevant docs
```

### Change Text Processing:

**Larger chunks (better for long documents):**

```env
CHUNK_SIZE=1000
CHUNK_OVERLAP=100
```

**Smaller chunks (better for precise answers):**

```env
CHUNK_SIZE=300
CHUNK_OVERLAP=30
```

### Switch AI Models:

Edit `.env` to try different models:

```env
# Faster, lighter model
LLM_MODEL=llama-3.1-8b-instant

# More powerful model (current default)
LLM_MODEL=llama-3.3-70b-versatile

# Most powerful (slower)
LLM_MODEL=llama-3.1-405b-reasoning
```

---

## 🐛 Troubleshooting

### Issue: "GROQ_API_KEY not found"

**Solution:**

- Make sure you created `.env` (not `.env.example`)
- Check that your API key is correct
- No spaces before or after the key
- Get a new key from https://console.groq.com/

### Issue: "No documents found"

**Solution:**

- Add documents to `data/documents/` folder
- Run `python ingest_documents.py`
- Check that files are `.txt`, `.md`, or `.pdf`

### Issue: "ChromaDB connection error"

**Solution:**

- Leave ChromaDB Cloud settings empty to use local mode
- Delete `chroma_db` folder and restart
- Check disk space (need at least 1GB free)

### Issue: "Port 5000 already in use"

**Solution:**

- Change port in `.env`: `FLASK_PORT=5001`
- Or stop the other program using port 5000

### Issue: "Slow responses"

**Solution:**

- Reduce `RETRIEVAL_K` to 2
- Use smaller `CHUNK_SIZE` (300-400)
- Switch to faster model: `llama-3.1-8b-instant`
- Check your internet connection (Groq API needs internet)

### Issue: "Out of memory"

**Solution:**

- Use smaller embedding model
- Reduce `CHUNK_SIZE`
- Process fewer documents at once
- Close other programs

---

## 🚀 Production Deployment

### Using Gunicorn (Recommended):

```bash
# Install gunicorn (already in requirements.txt)
pip install gunicorn

# Run with 4 worker processes
gunicorn -c gunicorn.conf.py src.app:app
or
gunicorn src/app-working.py

```

### Deploy to Render.com (Free Hosting):

1. Push your code to GitHub
2. Go to https://render.com/
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Settings:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn -c gunicorn.conf.py src.app:app`
6. Add environment variables (your API keys)
7. Click "Create Web Service"

Done! Your chatbot is live! 🎉

---

## 📊 Performance Tips

### For Better Accuracy:

- ✅ Add more high-quality documents
- ✅ Use specific, detailed documents
- ✅ Increase `RETRIEVAL_K` to 4-5
- ✅ Lower `SIMILARITY_THRESHOLD` to 0.6

### For Faster Responses:

- ⚡ Use `llama-3.1-8b-instant` model
- ⚡ Reduce `RETRIEVAL_K` to 2
- ⚡ Increase `SIMILARITY_THRESHOLD` to 0.8
- ⚡ Use smaller `CHUNK_SIZE`

### For Lower Costs:

- 💰 Use local ChromaDB (free!)
- 💰 Groq has generous free tier
- 💰 Cache common questions
- 💰 Limit document size

---

## 🔒 Security Best Practices

1. **Never commit `.env` file** - It contains your API keys!
2. **Use environment variables** in production
3. **Rotate API keys** regularly
4. **Limit API access** with rate limiting
5. **Validate user input** to prevent injection attacks
6. **Use HTTPS** in production
7. **Keep dependencies updated:** `pip install --upgrade -r requirements.txt`

---

## 📚 Learning Resources

Want to understand more? Check these out:

- **LangChain:** https://python.langchain.com/docs/
- **ChromaDB:** https://docs.trychroma.com/
- **Groq:** https://console.groq.com/docs
- **RAG Concepts:** https://www.pinecone.io/learn/retrieval-augmented-generation/
- **Flask:** https://flask.palletsprojects.com/

---

## 💡 Tips for Non-Developers

- **Start simple:** Get it working with one document first
- **Test often:** Try different questions to see how it responds
- **Read error messages:** They usually tell you exactly what's wrong
- **Use print statements:** Add `print()` to see what's happening
- **Google is your friend:** Search for error messages
- **Don't be afraid to experiment:** You can't break anything permanently!
- **Ask for help:** The AI/ML community is very supportive

---

## 🎓 Advanced Features

### Custom Prompts:

Edit `src/retriever/rag_retriever.py` to customize how the AI responds.

### Multiple Collections:

Create different collections for different topics:

```python
medical_store = ChromaStore(collection_name="medical_docs")
nutrition_store = ChromaStore(collection_name="nutrition_docs")
```

### Conversation Memory:

Add chat history to maintain context across multiple questions.

### Source Citations:

The chatbot already shows which documents it used!

---

## 📝 Important Notes

- **Medical Disclaimer:** This is an educational tool. Always consult real healthcare professionals for medical advice!
- **Data Privacy:** Documents are stored locally by default. Be careful with sensitive information.
- **API Limits:** Groq free tier has limits. Monitor your usage at https://console.groq.com/
- **Accuracy:** The chatbot is only as good as the documents you provide. Use reliable sources!
- **Updates:** Keep your packages updated for security and performance

---

## 🎉 You're Ready!

Congratulations! You now understand how the Healix RAG Chatbot works! 🌟

**What you learned:**

- ✅ What RAG is and why it's powerful
- ✅ How to install and configure the chatbot
- ✅ How to add medical knowledge
- ✅ How the system works behind the scenes
- ✅ How to customize and deploy it

Now go build something amazing! 💻✨

For more information:

- Main project setup: See `/README.md`
- Frontend details: See `/frontend/README.md`

Happy coding! 🚀

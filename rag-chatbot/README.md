# RAG Chatbot (Production)

Production-ready Retrieval-Augmented Generation chatbot using ChromaDB, HuggingFace Embeddings, Groq LLM, and Flask API.

## Quick Start

1. **Clone and enter directory:**
   ```bash
   git clone <repo-url>
   cd rag-chatbot
   ```
2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys
   ```
5. **Run the server:**
   ```bash
   python src/app.py
   ```

## Environment Variables

See `.env.example` for required variables (GROQ_API_KEY, ChromaDB config, etc).

## Deployment

- Use a production WSGI server (e.g., gunicorn) for deployment:
  ```bash
  gunicorn -w 4 -b 0.0.0.0:5000 src.app:app
  ```
- Set all secrets via environment variables or a secure .env file.
- Remove all test, debug, and cache files before deploying.

---

For more details, see code comments and requirements.txt.

# Optional: For ChromaDB Cloud

CHROMA_CLOUD_TENANT=your_tenant_id
CHROMA_CLOUD_DATABASE=your_database_name
CHROMA_CLOUD_API_KEY=your_chroma_api_key

````

**Note:** If ChromaDB Cloud credentials are not provided, the system will use local ChromaDB automatically.

## 📚 Usage

### Step 1: Add Documents

Place your documents (`.md` or `.txt` files) in the `data/documents/` folder:

```bash
# Example: Create sample documents
echo "Python is a high-level programming language." > data/documents/python.txt
echo "Machine learning is a subset of artificial intelligence." > data/documents/ml.txt
````

### Step 2: Ingest Documents

Run the ingestion script:

```bash
python ingest_documents.py
```

### Step 3: Start the Flask Server

```bash
python src/app.py
```

Server starts on `http://localhost:5000`

### Step 4: Query the System

```bash
curl -X POST http://localhost:5000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is Python?"}'
```

## 🔍 API Endpoints

- **GET** `/` - Health check
- **GET** `/health` - System status
- **GET** `/stats` - Collection statistics
- **POST** `/query` - Query the RAG system

## ⚙️ Configuration

Edit `.env` to customize settings. See `.env.example` for all options.

## 🐛 Troubleshooting

### "No documents found"

Add documents to `data/documents/` and run `python ingest_documents.py`

### ChromaDB Connection Error

Verify credentials in `.env` or let it use local mode

### Groq API Error

Check your `GROQ_API_KEY` at https://console.groq.com/

## 📁 Project Structure

```
rag-chatbot/
├── src/
│   ├── embeddings/huggingface_embeddings.py
│   ├── vectorstore/chroma_store.py
│   ├── llm/groq_client.py
│   ├── retriever/rag_retriever.py
│   ├── utils/config.py
│   └── app.py
├── data/documents/
├── ingest_documents.py
├── requirements.txt
├── .env
└── README.md
```

Made with ❤️ using LangChain, ChromaDB, HuggingFace, and Groq

```
git clone <repository-url>
cd rag-chatbot
```

2. Create a virtual environment and activate it:

   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the required dependencies:

   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env` and fill in the necessary values.

## Usage

1. Start the application:

   ```
   python src/app.py
   ```

2. Interact with the chatbot through the defined interface.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

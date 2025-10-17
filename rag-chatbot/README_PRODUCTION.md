# 🤖 Healix RAG Chatbot - Production Ready

A production-ready RAG (Retrieval-Augmented Generation) chatbot for medical and first-aid queries, powered by Groq's LLaMA models and ChromaDB.

## 🚀 Quick Start

### Local Development

1. **Clone and Setup**
```bash
cd rag-chatbot
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

3. **Add Documents (Optional)**
```bash
# Place documents in data/documents/
python ingest_documents.py
```

4. **Run**
```bash
python src/app.py
# Or with gunicorn:
gunicorn -c gunicorn.conf.py src.app:app
```

### Deploy to Render

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

**Quick Deploy:**
1. Push to GitHub
2. Create Web Service on Render
3. Set environment variables (especially `GROQ_API_KEY`)
4. Deploy!

## 📡 API Endpoints

### `GET /health`
Health check with system info
```bash
curl https://your-app.onrender.com/health
```

### `POST /query`
Ask questions
```bash
curl -X POST https://your-app.onrender.com/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What should I do for a burn?"}'
```

### `POST /ingest`
Add documents via API
```bash
curl -X POST https://your-app.onrender.com/ingest \
  -H "Content-Type: application/json" \
  -d '{"text": "Document content", "metadata": {"source": "name"}}'
```

## 🛠️ Tech Stack

- **Framework:** Flask + Gunicorn
- **AI Model:** Groq (LLaMA 3.3 70B)
- **Embeddings:** Sentence Transformers
- **Vector Store:** ChromaDB
- **Orchestration:** LangChain

## 📁 Project Structure

```
rag-chatbot/
├── src/
│   ├── app.py                 # Main Flask application
│   ├── embeddings/            # Text embedding logic
│   ├── vectorstore/           # ChromaDB integration
│   ├── llm/                   # Groq client
│   ├── retriever/             # RAG retriever
│   └── utils/                 # Configuration
├── data/documents/            # Your documents
├── Procfile                   # Render deployment config
├── requirements.txt           # Python dependencies
├── runtime.txt                # Python version
├── gunicorn.conf.py           # Production server config
├── .env.example               # Environment template
└── DEPLOYMENT.md              # Deployment guide
```

## 🔧 Configuration

Key environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `GROQ_API_KEY` | - | **Required** - Your Groq API key |
| `LLM_MODEL` | `llama-3.3-70b-versatile` | AI model to use |
| `EMBEDDING_MODEL` | `sentence-transformers/all-MiniLM-L6-v2` | Embedding model |
| `RETRIEVAL_K` | `3` | Number of documents to retrieve |
| `CHUNK_SIZE` | `500` | Text chunk size |
| `FLASK_PORT` | `5000` | Server port |

See `.env.example` for all options.

## 📚 Documentation

- **Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Detailed How-It-Works:** [README.md](./README.md)

## 🔒 Security

- ✅ Environment variables for secrets
- ✅ Input validation
- ✅ CORS enabled
- ✅ Error handling
- ✅ Production-ready logging

## 📝 License

Part of the Healix project.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Ready to deploy?** Check out [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions! 🚀

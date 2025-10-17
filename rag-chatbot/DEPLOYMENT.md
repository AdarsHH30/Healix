# 🚀 Deployment Guide - Render

This guide will help you deploy the Healix RAG Chatbot to Render.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com) (free tier available)
3. **Groq API Key** - Get from [console.groq.com](https://console.groq.com)

---

## 🎯 Quick Deployment Steps

### 1. Prepare Your Repository

Ensure these files are in your repository:
- ✅ `Procfile` - Tells Render how to start your app
- ✅ `requirements.txt` - Python dependencies
- ✅ `runtime.txt` - Python version
- ✅ `gunicorn.conf.py` - Production server configuration
- ✅ `.env.example` - Example environment variables

### 2. Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the `rag-chatbot` directory (if it's a subdirectory)

### 3. Configure Build Settings

**Name:** `healix-rag-chatbot` (or your preferred name)

**Environment:** `Python 3`

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
gunicorn -c gunicorn.conf.py src.app:app
```

**Instance Type:** `Free` (or upgrade for better performance)

### 4. Set Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

| Key | Value | Required |
|-----|-------|----------|
| `GROQ_API_KEY` | Your Groq API key | ✅ Yes |
| `LLM_MODEL` | `llama-3.3-70b-versatile` | ✅ Yes |
| `EMBEDDING_MODEL` | `sentence-transformers/all-MiniLM-L6-v2` | ✅ Yes |
| `CHROMA_COLLECTION_NAME` | `rag_documents` | ✅ Yes |
| `CHROMA_DB_PATH` | `./chroma_db` | ✅ Yes |
| `DOCUMENTS_PATH` | `./data/documents` | ✅ Yes |
| `CHUNK_SIZE` | `500` | Optional |
| `CHUNK_OVERLAP` | `50` | Optional |
| `RETRIEVAL_K` | `3` | Optional |
| `SIMILARITY_THRESHOLD` | `0.7` | Optional |
| `FLASK_PORT` | `5000` | Optional |
| `FLASK_DEBUG` | `false` | ✅ Yes |

**Note:** Render automatically provides the `PORT` environment variable, which is used by gunicorn.

### 5. Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Start your application
3. Wait 5-10 minutes for the first deployment

---

## ✅ Verify Deployment

Once deployed, test your endpoints:

### Health Check
```bash
curl https://your-app-name.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "documents_count": 0,
  "model": "llama-3.3-70b-versatile",
  "embedding_model": "sentence-transformers/all-MiniLM-L6-v2",
  "chroma_mode": "local"
}
```

### Test Query
```bash
curl -X POST https://your-app-name.onrender.com/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is first aid?"}'
```

---

## 📚 Adding Documents

### Option 1: Pre-deployment (Recommended)

1. Add your documents to `data/documents/` folder
2. Run locally: `python ingest_documents.py`
3. Commit the `chroma_db/` folder to your repository
4. Deploy to Render

### Option 2: Via API (After deployment)

```bash
curl -X POST https://your-app-name.onrender.com/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your document content here",
    "metadata": {"source": "document_name", "title": "Document Title"}
  }'
```

**Note:** Free tier instances may restart, losing data not in the repository. Use Option 1 for persistence.

---

## 🔧 Configuration Files Explained

### `Procfile`
Tells Render how to start your application:
```
web: gunicorn -c gunicorn.conf.py src.app:app
```

### `runtime.txt`
Specifies Python version:
```
python-3.11.9
```

### `gunicorn.conf.py`
Production server configuration:
- **Workers:** 4 (adjustable via `WEB_CONCURRENCY` env var)
- **Timeout:** 30 seconds
- **Port:** Automatically uses Render's `PORT` variable
- **Logging:** Enabled for debugging

### `requirements.txt`
All Python dependencies with pinned versions for stability.

---

## 🐛 Troubleshooting

### Issue: Build Fails

**Check:**
- Python version in `runtime.txt` matches your local version
- All dependencies in `requirements.txt` are valid
- No syntax errors in your code

**Solution:**
```bash
# Test locally first
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python src/app.py
```

### Issue: App Crashes on Startup

**Check Render Logs:**
1. Go to your service dashboard
2. Click **"Logs"** tab
3. Look for error messages

**Common causes:**
- Missing environment variables
- Invalid API keys
- Import errors

### Issue: Slow Response Times

**Free Tier Limitations:**
- Instances sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Limited CPU/RAM

**Solutions:**
- Upgrade to paid tier for always-on instances
- Reduce `RETRIEVAL_K` to 2 for faster queries
- Use lighter model: `llama-3.1-8b-instant`

### Issue: Out of Memory

**Solutions:**
- Reduce number of workers in `gunicorn.conf.py`:
  ```python
  workers = 2  # instead of 4
  ```
- Reduce `CHUNK_SIZE` to 300
- Upgrade to paid tier with more RAM

### Issue: Documents Not Persisting

**Cause:** Free tier instances have ephemeral storage

**Solutions:**
1. Commit `chroma_db/` to repository (if not too large)
2. Use ChromaDB Cloud (set `CHROMA_CLOUD_*` env vars)
3. Upgrade to persistent disk on Render

---

## 🔒 Security Best Practices

1. **Never commit `.env` file** - Use Render's environment variables
2. **Rotate API keys regularly** - Update in Render dashboard
3. **Use HTTPS** - Render provides this automatically
4. **Enable rate limiting** - Consider adding Flask-Limiter
5. **Validate inputs** - Already implemented in `app.py`
6. **Monitor logs** - Check for suspicious activity

---

## 📊 Monitoring & Maintenance

### View Logs
```bash
# In Render dashboard, go to Logs tab
# Or use Render CLI:
render logs -s your-service-name
```

### Monitor Performance
- Check response times in Render dashboard
- Monitor memory usage
- Track API usage on Groq dashboard

### Update Deployment
```bash
# Push changes to GitHub
git add .
git commit -m "Update chatbot"
git push origin main

# Render auto-deploys on push (if enabled)
```

### Manual Redeploy
1. Go to Render dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🚀 Optimization Tips

### For Production Use:

1. **Upgrade Instance Type**
   - Better performance
   - More RAM/CPU
   - Always-on (no cold starts)

2. **Use ChromaDB Cloud**
   - Persistent storage
   - Better scalability
   - Shared across instances

3. **Add Caching**
   - Cache common queries
   - Reduce API calls
   - Faster responses

4. **Enable Auto-scaling**
   - Handle traffic spikes
   - Cost-effective
   - Available on paid tiers

5. **Add Monitoring**
   - Sentry for error tracking
   - New Relic for performance
   - Custom logging

---

## 🌐 Custom Domain (Optional)

1. Go to your service **Settings**
2. Scroll to **Custom Domain**
3. Add your domain (e.g., `api.healix.com`)
4. Update DNS records as instructed
5. Render provides free SSL certificate

---

## 💰 Cost Estimation

### Free Tier
- ✅ 750 hours/month
- ✅ Automatic HTTPS
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ 512 MB RAM
- ⚠️ Shared CPU

### Starter ($7/month)
- ✅ Always-on
- ✅ 512 MB RAM
- ✅ Shared CPU
- ✅ No sleep

### Standard ($25/month)
- ✅ 2 GB RAM
- ✅ 1 CPU
- ✅ Better performance
- ✅ Persistent disk available

---

## 📞 Support

- **Render Docs:** [render.com/docs](https://render.com/docs)
- **Render Community:** [community.render.com](https://community.render.com)
- **Groq Docs:** [console.groq.com/docs](https://console.groq.com/docs)
- **Project Issues:** Create an issue in your GitHub repository

---

## ✨ Success!

Your RAG chatbot is now deployed and ready to answer questions! 🎉

**Next Steps:**
1. Test all endpoints
2. Add your medical documents
3. Monitor performance
4. Share with users
5. Collect feedback and improve

Happy deploying! 🚀

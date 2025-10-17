# 🚀 Quick Deploy to Render

## ⚡ Fast Track Deployment

### Step 1: Push to GitHub
```bash
cd /home/adarsh/Healix/rag-chatbot
git add .
git commit -m "Production ready deployment"
git push origin main
```

### Step 2: Create Web Service on Render

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repository

### Step 3: Configure Service

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
gunicorn -c gunicorn.conf.py src.app:app
```

**Environment Variables** (Click "Advanced"):
```
GROQ_API_KEY=your_actual_groq_api_key_here
LLM_MODEL=llama-3.3-70b-versatile
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
CHROMA_COLLECTION_NAME=rag_documents
CHROMA_DB_PATH=./chroma_db
DOCUMENTS_PATH=./data/documents
FLASK_DEBUG=false
```

### Step 4: Deploy
Click **"Create Web Service"** and wait 5-10 minutes.

### Step 5: Test
```bash
# Replace YOUR_APP_URL with your Render URL
curl https://YOUR_APP_URL.onrender.com/health
```

## 📋 Files Ready for Deployment

✅ **Procfile** - Tells Render how to start
✅ **requirements.txt** - All dependencies
✅ **runtime.txt** - Python 3.11.9
✅ **gunicorn.conf.py** - Production server config
✅ **.env.example** - Environment template
✅ **.gitignore** - Excludes sensitive files

## 🎯 What Was Cleaned Up

**Removed:**
- ❌ Procfile-lite, Procfile-minimal, Procfile-working
- ❌ build-lite.sh, build-minimal.sh, build.sh, quick-deploy.sh
- ❌ requirements-lite.txt, requirements-minimal.txt
- ❌ gunicorn-lite.conf.py
- ❌ render_init.py
- ❌ WORKING_FIX.md
- ❌ src/app-lite.py, src/app-minimal.py, src/app-working.py
- ❌ .env.local

**Kept (Production Files):**
- ✅ Procfile
- ✅ requirements.txt
- ✅ gunicorn.conf.py
- ✅ runtime.txt
- ✅ src/app.py
- ✅ .env.example
- ✅ .gitignore (updated)

## 📚 Documentation

- **Full Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Production README:** [README_PRODUCTION.md](./README_PRODUCTION.md)
- **How It Works:** [README.md](./README.md)

## 🔑 Important Notes

1. **Never commit `.env`** - It's in .gitignore for security
2. **Get Groq API Key** from https://console.groq.com/keys
3. **Free Tier** - Render provides 750 hours/month free
4. **Cold Starts** - Free tier sleeps after 15 min inactivity
5. **Persistent Data** - Commit `chroma_db/` folder if you want documents to persist

## 🐛 Quick Troubleshooting

**Build fails?**
- Check Python version in `runtime.txt` matches your local
- Verify all dependencies in `requirements.txt`

**App crashes?**
- Check Render logs for errors
- Verify all environment variables are set
- Ensure GROQ_API_KEY is valid

**Slow responses?**
- First request after sleep takes 30-60s (free tier)
- Upgrade to paid tier for always-on instances

## ✅ Verification Checklist

Before deploying, ensure:
- [ ] Code pushed to GitHub
- [ ] `.env` file NOT committed (check .gitignore)
- [ ] Groq API key ready
- [ ] All environment variables prepared
- [ ] Tested locally with `python src/app.py`

---

**Ready to deploy!** Follow the steps above and your chatbot will be live in minutes! 🎉

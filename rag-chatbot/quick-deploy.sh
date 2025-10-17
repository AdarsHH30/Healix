#!/bin/bash
# Quick deploy script for the minimal version

echo "🚀 Quick Deploy for 512MB Fix"

echo "📝 Adding fixed files..."
git add requirements-minimal.txt .python-version runtime.txt src/app-minimal.py build-minimal.sh Procfile-minimal DEPLOYMENT_FIX.md

echo "💾 Committing fix..."
git commit -m "🚨 URGENT FIX: Remove dependency conflicts for 512MB deployment

- Fixed langchain version conflicts
- Added .python-version for Python 3.11.9  
- Ultra-minimal requirements (6 packages only)
- Direct Groq API instead of heavy RAG
- Memory usage: ~150MB (fits 512MB perfectly)"

echo "🚀 Deploying..."
git push origin main

echo "✅ Deploy initiated!"
echo ""
echo "🔧 Don't forget to update Render settings:"
echo "   Build Command: ./build-minimal.sh"
echo "   Start Command: gunicorn -w 1 -b 0.0.0.0:\$PORT --timeout 60 src.app-minimal:app"
echo ""
echo "🔑 Environment Variables needed:"
echo "   GROQ_API_KEY=your_actual_api_key"
echo "   PYTHON_VERSION=3.11.9"
# 🏥 Healix - Complete Setup Guide

Welcome to **Healix**! This guide will help you set up the entire project step by step. Don't worry if you're not a developer - we've made this as simple as possible! 😊

## 📋 What is Healix?

Healix is a health and wellness application that helps you with:
- 🏥 Finding nearby hospitals and emergency services
- 💬 AI-powered health chatbot for medical questions
- 🧘 Breathing exercises and wellness features
- 📊 Health tracking and monitoring
- 🆘 Emergency contact management

The project has two main parts:
1. **Frontend** - The website/app that users see and interact with
2. **RAG Chatbot** - The intelligent AI system that answers health questions

---

## 🚀 Quick Start - What You Need

Before starting, make sure you have these installed on your computer:

### Required Software:
1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - This is needed to run the frontend website

2. **Python** (version 3.10 or higher)
   - Download from: https://www.python.org/
   - This is needed to run the AI chatbot

3. **pnpm** (Package manager for Node.js)
   - After installing Node.js, open your terminal and run:
   ```bash
   npm install -g pnpm
   ```

4. **Git** (to download the project)
   - Download from: https://git-scm.com/

---

## 🔑 Getting Your API Keys

You'll need to get some free API keys to make Healix work. Don't worry - they're all free!

### 1. Supabase (Database & Authentication) 🗄️

**What it does:** Stores user data, handles login/signup, and manages your database.

**How to get it:**
1. Go to https://supabase.com/
2. Click "Start your project" (top right)
3. Sign up with your email or GitHub account
4. Click "New Project"
5. Fill in:
   - **Project Name:** `healix` (or any name you like)
   - **Database Password:** Create a strong password (save it somewhere safe!)
   - **Region:** Choose the one closest to you
6. Click "Create new project" and wait 2-3 minutes
7. Once ready, go to **Project Settings** (gear icon on left sidebar)
8. Click on **API** section
9. You'll see two important things:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (a long string of letters and numbers)
10. Copy both - you'll need them soon!

### 2. Groq API (AI Language Model) 🤖

**What it does:** Powers the intelligent chatbot that answers health questions.

**How to get it:**
1. Go to https://console.groq.com/
2. Click "Sign In" or "Get Started"
3. Sign up with your email or Google account
4. Once logged in, click on **"API Keys"** in the left menu
5. Click **"Create API Key"**
6. Give it a name like "Healix Chatbot"
7. Click "Create"
8. **IMPORTANT:** Copy the API key immediately! You won't be able to see it again
9. Save it somewhere safe (like a password manager)

**Note:** Groq offers free API access with generous limits - perfect for testing!

### 3. Twilio (Emergency Calls & SMS) 📞

**What it does:** Enables emergency calling and SMS features to contact emergency contacts.

**How to get it:**
1. Go to https://www.twilio.com/
2. Click "Sign up" (top right)
3. Create a free account
4. Verify your email and phone number
5. Once logged in, go to the **Console Dashboard**
6. You'll see:
   - **Account SID** (starts with "AC...")
   - **Auth Token** (click to reveal - keep this secret!)
7. Get a phone number:
   - Click "Get a Twilio phone number"
   - Click "Choose this number"
   - Copy your new phone number (format: +1234567890)

**Free Trial Info:**
- ✅ $15.50 free credit
- ✅ Can make calls (~$0.013/minute)
- ✅ Can send SMS (~$0.0075 each)
- ⚠️ **Important:** You can only call/SMS verified numbers during trial
- To verify numbers: Go to Console → Phone Numbers → Verified Caller IDs

### 4. Optional: ChromaDB Cloud (Vector Database) 📊

**What it does:** Stores medical knowledge for the chatbot (optional - works locally without this).

**How to get it:**
1. Go to https://www.trychroma.com/
2. Click "Get Started" or "Sign Up"
3. Create an account
4. Create a new database
5. Get your:
   - Tenant ID
   - Database Name
   - API Key

**Note:** You can skip this for now - the chatbot will work with local storage!

---

## 📥 Step 1: Download the Project

Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux) and run:

```bash
# Go to where you want to save the project
cd Desktop

# Download the project
git clone <your-repository-url>

# Go into the project folder
cd Healix
```

---

## 🎨 Step 2: Setup the Frontend

The frontend is the website that users see.

```bash
# Go to the frontend folder
cd frontend

# Install all required packages (this might take 2-3 minutes)
pnpm install
```

### Configure Frontend Environment:

1. In the `frontend` folder, find the file `.env.example`
2. Create a copy and rename it to `.env.local`
3. Open `.env.local` with any text editor (Notepad, VS Code, etc.)
4. Fill in your Supabase details:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Twilio Configuration (for emergency calls/SMS)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

5. Save the file

### Run the Frontend:

```bash
# Start the development server
pnpm dev
```

🎉 **Success!** Open your web browser and go to: http://localhost:3000

You should see the Healix homepage!

---

## 🤖 Step 3: Setup the RAG Chatbot

The chatbot is the AI that answers health questions.

Open a **new terminal window** (keep the frontend running!) and:

```bash
# Go back to the main Healix folder
cd ..

# Go to the chatbot folder
cd rag-chatbot

# Create a Python virtual environment (keeps things organized)
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install all required packages (this might take 5-10 minutes)
pip install -r requirements.txt
```

### Configure Chatbot Environment:

1. In the `rag-chatbot` folder, find the file `.env.example`
2. Create a copy and rename it to `.env`
3. Open `.env` with any text editor
4. Fill in your Groq API key:

```env
# Replace with your actual Groq API key
GROQ_API_KEY=your_groq_api_key_here

# Model Configuration (these are good defaults)
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
LLM_MODEL=llama-3.3-70b-versatile

# Leave these empty for local mode (no ChromaDB Cloud needed)
CHROMA_CLOUD_TENANT=
CHROMA_CLOUD_DATABASE=
CHROMA_CLOUD_API_KEY=

# These are fine as defaults
CHROMA_COLLECTION_NAME=rag_documents
CHROMA_DB_PATH=./chroma_db
DOCUMENTS_PATH=./data/documents
CHUNK_SIZE=500
CHUNK_OVERLAP=50
RETRIEVAL_K=3
SIMILARITY_THRESHOLD=0.7
FLASK_PORT=5000
FLASK_DEBUG=false
```

5. Save the file

### Add Medical Knowledge (Optional):

If you want to add medical documents for the chatbot to learn from:

1. Put your medical PDF or text files in: `rag-chatbot/data/documents/`
2. Run this command to process them:

```bash
python ingest_documents.py
```

### Run the Chatbot:

```bash
# Start the chatbot server
python src/app.py
```

🎉 **Success!** The chatbot is now running on: http://localhost:5000

---

## ✅ Step 4: Test Everything

Now you have both parts running:
- **Frontend:** http://localhost:3000
- **Chatbot API:** http://localhost:5000

### Test the Frontend:
1. Open http://localhost:3000 in your browser
2. Try signing up for an account
3. Explore the dashboard features
4. Try the breathing exercises

### Test the Chatbot:
1. On the Healix website, find the chatbot feature
2. Ask a health question like "What are symptoms of flu?"
3. The AI should respond with helpful information!

---

## 🛠️ Common Issues & Solutions

### Issue: "Port already in use"
**Solution:** Another program is using that port. Either:
- Close the other program
- Or change the port in the `.env` file

### Issue: "Module not found" or "Package not found"
**Solution:** 
- Make sure you ran `pnpm install` in the frontend folder
- Make sure you ran `pip install -r requirements.txt` in the chatbot folder
- Make sure your virtual environment is activated (you should see `(venv)` in your terminal)

### Issue: "Invalid API key"
**Solution:**
- Double-check you copied the API keys correctly
- Make sure there are no extra spaces before or after the keys
- Make sure you saved the `.env` and `.env.local` files

### Issue: Chatbot not responding
**Solution:**
- Make sure the chatbot server is running (check http://localhost:5000)
- Check that your Groq API key is correct
- Look at the terminal where the chatbot is running for error messages

---

## 📁 Project Structure

```
Healix/
├── frontend/              # The website (Next.js)
│   ├── app/              # Website pages
│   ├── components/       # Reusable UI components
│   ├── lib/              # Helper functions
│   └── .env.local        # Frontend configuration (YOU CREATE THIS)
│
├── rag-chatbot/          # The AI chatbot (Python/Flask)
│   ├── src/              # Chatbot code
│   ├── data/             # Medical documents
│   └── .env              # Chatbot configuration (YOU CREATE THIS)
│
└── README.md             # This file!
```

---

## 🎓 What's Next?

Now that everything is set up:

1. **Explore the Code:** Look at the files to understand how things work
2. **Customize:** Change colors, text, or features to make it your own
3. **Add Features:** Add new pages or functionality
4. **Deploy:** Put your project online so others can use it!

For more detailed information:
- Frontend details: See `frontend/README.md`
- Chatbot details: See `rag-chatbot/README.md`

---

## 🆘 Need Help?

If you get stuck:
1. Read the error message carefully - it often tells you what's wrong
2. Check the "Common Issues" section above
3. Make sure all your API keys are correct
4. Google the error message - someone else has probably had the same issue!

---

## 📝 Important Notes

- **Never share your API keys publicly!** Keep your `.env` and `.env.local` files private
- **Don't commit `.env` files to Git** - they're already in `.gitignore`
- **Free API limits:** Groq and Supabase have free tiers with limits. For production, you might need paid plans
- **Medical Disclaimer:** This is an educational project. Always consult real healthcare professionals for medical advice!



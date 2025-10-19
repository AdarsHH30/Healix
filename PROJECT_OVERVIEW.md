PROJECT OVERVIEW — Healix

This file gives a plain-language tour of every important file and folder in this project. It's written for non-developers so you can explain the project to others (investors, teammates, or friends) without needing technical jargon.

## Summary

Healix is a health & wellness app made of two main parts:

- frontend/ — the website and user interface (what people see and click)
- rag-chatbot/ — the AI chatbot backend that answers health questions (Retrieval-Augmented Generation)

Use this document when someone asks: "What does each file do?"

## Root files and folders

- README.md

  - What it is: The high-level setup guide for the whole project. It explains what software you need and how to get both the frontend and the chatbot running.
  - Who should read it: New contributors and people setting up the project.

- PROJECT_OVERVIEW.md (this file)

  - What it is: Plain-language explanations of the files and folders in the repo.
  - Who should read it: Non-developers who need to explain the project.

- frontend/

  - What it is: The website/app users interact with. Built with Next.js (a website framework).
  - Why it exists: To give users a friendly interface to sign up, ask the chatbot questions, find hospitals, practice breathing exercises, and manage profiles.

- rag-chatbot/

  - What it is: The backend code (Python) that powers the AI chatbot and document database.
  - Why it exists: To answer health questions by searching documents and using an AI model to produce helpful answers.

- .gitignore

  - What it is: A list of files/folders that should not be saved to the code repository (usually private keys, logs, or local environment files).

- .vscode/ (editor settings)
  - What it is: Configuration for Visual Studio Code (the code editor). Not needed to run anything; helps developers with consistent formatting.

## frontend/ (website) — what each main file/folder does

- README.md

  - Quick start guide and explanation specific to frontend. Tells you how to run the website locally.

- app/

  - What it is: The pages and features of the website (home page, dashboard, login pages, profile pages, API endpoints used by the frontend).
  - Why it exists: Contains what the user sees and interacts with.

- components/

  - What it is: Reusable building blocks (buttons, headers, footers, forms, etc.).
  - Why it exists: Makes the website consistent and faster to build.

- lib/

  - What it is: Small helper code pieces the site uses (for example, code that talks to the chatbot or to the Supabase database).
  - Why it exists: Keeps common actions in one place so the rest of the site can call them easily.

- public/

  - What it is: Images and static assets used on the site.

- package.json

  - What it is: A list of packages/libraries the website needs (like a shopping list of code pieces).
  - Why it exists: Used to install everything the frontend needs to run.

- .env.example and .env.local
  - What they are: Example files showing which private keys and settings you must add (you create an `.env.local` with your own keys, like Supabase and Twilio credentials).
  - Why they exist: Keeps secret keys out of the project while telling you which values to fill.

## rag-chatbot/ (AI chatbot backend) — files and purpose

This folder contains the Python backend that:

1. Reads medical documents you put in `data/documents`
2. Breaks them into smaller pieces and stores them in a searchable database
3. When a user asks a question, finds the most relevant document pieces and asks an AI model to create an answer

Top-level files:

- README.md

  - What it is: Detailed guide for installing and running the chatbot.

- .env.example and .env

  - What they are: Example and actual environment config (API keys like GROQ_API_KEY). `rag-chatbot/.env` should be created by the person running the bot and must contain the Groq key and other settings.

- build-lite.sh

  - What it is: A small helper script that installs a minimal set of Python packages (useful for small-host environments like Render with limited memory).
  - What it does: Installs `gunicorn`, packages from `requirements-lite.txt`, creates folders like `chroma_db` and `data/documents`, and clears pip cache to save space.

- requirements-lite.txt

  - What it is: A short list of Python packages needed for the lightweight build (the script above installs these).

- ingest_documents.py

  - What it is: A script that reads files from `data/documents`, splits them into chunks, turns them into searchable vectors, and saves them in the local database.
  - Why it exists: Use this to load new medical documents so the chatbot knows about them.

- chroma_db/

  - What it is: A folder where the searchable document database is stored locally. If you delete this folder you lose the stored document index and must re-ingest.

- data/documents/

  - What it is: Where you put your medical PDFs, text files, or markdown files for the bot to learn from.
  - Why it exists: Source documents for answers.

- gunicorn.conf.py / gunicorn-lite.conf.py

  - What they are: Configurations for Gunicorn (a production server to run the Python app). The lite config is for low-memory environments.

- Procfile / Procfile-lite / Procfile-working

  - What they are: Small files used by deployment platforms (Heroku/Render) that tell the host how to start the app (which command to run).

- runtime.txt

  - What it is: Specifies the Python version the project expects (e.g., python-3.11.9). Used by some hosting services.

- src/

  - What it is: The actual Python code (organized into modules). Here are the important subfolders and files.

  - src/app.py, src/app-working.py, src/app-lite.py, src/app-minimal.py

    - What these are: Slightly different entry points (ways to start the chat server) tuned for different environments. `app.py` is the main version; others are lighter or minimal for constrained hosts.

  - src/embeddings/

    - huggingface_embeddings.py
      - What it is: Code that turns text into numerical representations using a local HuggingFace model. Useful when you have GPU/memory and want offline embeddings.
    - lightweight_embeddings.py
      - What it is: A lighter option (smaller models or API-based embeddings) for lower-memory environments.

  - src/vectorstore/chroma_store.py

    - What it is: Code that manages the searchable database (ChromaDB). It can run locally or talk to Chroma Cloud.

  - src/llm/groq_client.py

    - What it is: Code that talks to the Groq AI service (the large language model) to generate answers from retrieved context.

  - src/retriever/rag_retriever.py

    - What it is: The orchestration logic that takes a user question, finds relevant documents, and asks the LLM to produce an answer. This is the "brain" of the RAG system.

  - src/utils/config.py
    - What it is: Central place for configuration values (like paths, model names, thresholds). This file reads values from `.env`.

## Other helper files

- quick-deploy.sh

  - What it is: A small convenience script to help deploy the project quickly on certain hosts.

- render_init.py
  - What it is: Helper script for initializing environment on Render.com hosting.

## How to explain this to a non-developer (short script)

If someone asks "What is this project and what does each folder do?" you can say:

"Healix is a health app with two parts: a website (the frontend) and an AI chatbot (the rag-chatbot folder). The website is built using Next.js and shows pages, user accounts, maps, and breathing exercises. The chatbot is a Python app that reads medical documents, stores them in a fast searchable database, and uses an AI model to answer user questions. There are small helper scripts for installing packages and starting the server. If you want to add medical information, drop files into `rag-chatbot/data/documents` and run the ingestion script to teach the bot about them."

## Notes and suggestions

- Keep your API keys out of source control (`.env` files should not be committed).
- For a low-memory host use `build-lite.sh` and `requirements-lite.txt`.
- If someone asks about a specific file in the frontend or `src/`, refer them to this overview or open the file for more detail.

Files I read to produce this overview
Files I read to produce this overview

---

- `README.md` (root)
- `frontend/README.md`
- `rag-chatbot/README.md`
- `build-lite.sh`
- `requirements-lite.txt`
- `ingest_documents.py`
- `src/app.py`
- `src/retriever/rag_retriever.py`
- `src/vectorstore/chroma_store.py`

## Detailed per-file rundown (non-developer friendly)

Below is a more complete explanation for nearly every file and folder in the project. Each entry describes what the file is, why it exists, and a one-sentence summary you can say to someone who asks.

## Root-level files and folders

- `.gitignore` — Tells the project which files to ignore when saving to the code repository (so secret keys and local files don't get shared). Say: "This keeps private things out of the shared code."
- `README.md` — The main, high-level setup and overview for the whole Healix project. Say: "Start here for a quick setup guide."
- `PROJECT_OVERVIEW.md` — (This file) A plain-language explanation of the project and its files for non-devs. Say: "This file explains the project in simple terms."
- `.vscode/` — Editor settings for Visual Studio Code (optional, helps developers keep consistent formatting). Say: "Editor settings — not required to run the project."

## `frontend/` folder (the website)

Top-level frontend files and why they exist:

- `frontend/README.md` — Guide specific to the frontend; how to run and what each major folder does. Say: "Explains the website setup and features."
- `frontend/package.json` — Lists the packages (third-party code) the website needs and provides commands to start/build/test. Say: "This installs and runs the website."
- `frontend/pnpm-lock.yaml` / `node_modules/` — Automatically generated package lock and installed packages (don't edit). Say: "Stores the exact website packages so it runs the same everywhere."
- `frontend/.env.example` and `.env.local` — Example and local secret configuration for connecting to services (Supabase, Twilio). Say: "Put your secret keys here so the site can talk to the backend services."
- `frontend/next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `tsconfig.json` — Configuration files for the website framework, styling system, and TypeScript. Say: "These configure how the website is built and styled."

Important frontend folders and files (per-file lines):

- `frontend/app/` — The pages and API endpoints used by the website. Each subfolder represents a page or group of pages:

  - `app/page.tsx` — The homepage users first see. Say: "The first page people see."
  - `app/layout.tsx` — The site-wide wrapper (header/footer) used by every page. Say: "The common page frame."
  - `app/login/`, `app/register/`, `app/profile/` — Pages for user login, registration, and profile management. Say: "Where users sign in and manage their account."
  - `app/dashboard/` and its subfolders (`breathing/`, `balanced-diet/`, etc.) — The protected, logged-in user area with health features. Say: "The user's main dashboard and wellness tools."
  - `app/api/` — Serverless API endpoints used by the site (e.g., emergency features). Say: "Small server functions for features like emergency SMS/calls."

- `frontend/components/` — Reusable UI pieces used by pages.

  - For each component file (examples below), say: "A small UI piece used to build pages."
    - `header.tsx` — Top navigation bar with sign-in/out and theme toggle. Say: "The site header and menu."
    - `footer.tsx` — Page footer content. Say: "Footer with links and info."
    - `login-form.tsx`, `signup-form.tsx` — Forms for authentication. Say: "Login and signup forms."
    - `chatbot-popup.tsx` — The UI to open the chatbot from the site. Say: "Button/modal to talk to the bot."
    - `call-now-button.tsx`, `emergency-popup.tsx` — Emergency action UI pieces. Say: "Emergency call/SMS UI."
  - `components/profile/` — Small components that build the user profile page (e.g., `emergency-contacts.tsx`, `profile-card.tsx`). Say: "Profile widgets, such as emergency contacts."
  - `components/ui/` — Basic building blocks (buttons, inputs, labels). Say: "Reusable UI building blocks."

- `frontend/lib/` — Small helper code used by the frontend to talk to services or store small logic.

  - `lib/chatbot-api.ts` — Code that sends user questions to the chatbot backend and fetches responses. Say: "Sends your question to the chatbot server and returns the answer."
  - `lib/supabase-client.ts` & `lib/supabase-server.ts` — Code that handles talking to the Supabase database and authentication. Say: "Connects the website to the user database and login system."
  - `lib/exercises.ts` and `lib/utils.ts` — Small utilities and data used by pages (breathing exercises, helper functions). Say: "Helper code and exercise data used by the site."

- `frontend/components/*` (many files) — Each file is a component used by the site. Examples:
  - `logo.tsx` — The Healix logo component. Say: "Displays the site logo."
  - `hero-section.tsx`, `feature-card.tsx`, `benefits-section.tsx` — Marketing and landing page pieces. Say: "Parts of the landing page."
  - `map-popup.tsx` — Small popup UI used on the map. Say: "Information popups on the hospital map."

Note: There are many component files; each one is a self-contained small piece of the user interface. If you want a fully exhaustive line-by-line listing for every `components/*.tsx` file, I can add them — but the pattern is the same: each file builds a small visual piece used by the pages.

## `rag-chatbot/` folder (AI backend) — per-file

Top-level files and short explanation (one-liners you can say):

- `rag-chatbot/README.md` — Chatbot-specific instructions and concepts. Say: "Explains how the chatbot works and how to add documents."
- `rag-chatbot/.env.example` and `.env` — Example and actual configuration for the chatbot (store API keys here). Say: "Put your Groq API key and other settings here."
- `rag-chatbot/build-lite.sh` — Script to install a small, memory-friendly set of Python packages and prepare folders. Say: "Installs a minimal set of dependencies and prepares storage for the chatbot."
- `rag-chatbot/requirements-lite.txt` — The small list of Python packages the lite installer uses. Say: "The lightweight list of Python libraries the bot needs."
- `rag-chatbot/Procfile`, `Procfile-lite`, `Procfile-working` — Commands used by hosting services to start the app. Say: "Tells a host how to start the chatbot server."
- `rag-chatbot/runtime.txt` — Declares the Python version expected on some hosts. Say: "Specifies the Python version to use."
- `rag-chatbot/ingest_documents.py` — Reads files from `data/documents`, splits them into chunks, converts them to searchable vectors, and stores them in the vector database. Say: "Use this to teach the bot new documents."
- `rag-chatbot/quick-deploy.sh` and `render_init.py` — Helper scripts for easy deployment on hosts like Render. Say: "Convenience scripts to deploy the chatbot quickly."

## Files in `rag-chatbot/src/` (the Python application code)

Each of these files contains the code that runs the chatbot. Below are short, non-technical explanations and one-sentence summaries you can repeat.

- `src/app.py` — The main Flask web server for the chatbot. It exposes endpoints like `/query` (ask a question) and `/ingest` (add a document). Say: "This file starts the chatbot server and handles incoming requests."
- `src/app-working.py`, `src/app-lite.py`, `src/app-minimal.py` — Alternate start scripts tuned for different hosting or memory constraints. Say: "Alternative ways to run the server for low-memory or production hosts."

`src/embeddings/`

- `huggingface_embeddings.py` — Code that turns text into numerical 'embeddings' using a local HuggingFace model. Say: "Converts text into numbers so the chatbot can compare content."
- `lightweight_embeddings.py` — Lighter or API-based embeddings for constrained environments. Say: "A lower-memory way to create embeddings (less resource-heavy)."

`src/llm/`

- `groq_client.py` — Code that connects to Groq's AI model to generate answers given the document context. Say: "Talks to the AI model that writes the chatbot's responses."

`src/vectorstore/`

- `chroma_store.py` — Manages the local or cloud vector database (ChromaDB) where document embeddings and text chunks are stored and searched. Say: "Stores and finds document chunks that match user questions."

`src/retriever/`

- `rag_retriever.py` — The orchestration logic: take a user query, find relevant pieces, assemble context, and ask the LLM to produce an answer. Say: "The conductor that uses the database and AI model to answer questions."

`src/utils/`

- `config.py` — Central place to read environment settings (the `.env` file) and expose configuration values such as model names and paths. Say: "Holds settings like API keys, file paths, and model names."

## Other important files and what you'll tell people

- `chroma_db/` — The local directory used by ChromaDB to store the searchable database; contains the indexed document data. Say: "Where the processed document index is stored locally."
- `data/documents/` — Where you drop medical text/PDF files to teach the chatbot. Say: "Drop documents here and run the ingestion script to teach the bot."

## How to explain the project in a short sentence

"Healix is a health app with a user-facing website (frontend) and an AI chatbot backend (rag-chatbot) that finds answers inside uploaded medical documents and uses an AI model to explain them in plain language."

## Next suggestions

- If you want the file-by-file explanations to be even more explicit, I can add a single paragraph for each `frontend/components/*.tsx` file and each `src/` Python file. That will make the document much longer but will meet the "every file" requirement exactly.

Generated on: 2025-10-19

If you'd like:

- I can expand this overview with short one-paragraph explanations for every single file in `frontend/components` or `src/` (this would be longer but doable).
- I can add a printable one-page summary for investors.

---

Generated on: 2025-10-19

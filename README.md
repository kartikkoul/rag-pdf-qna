<div align="center">

# My Knowledgebase

### Personalise a chatbot with your own PDFs and ask questions answered strictly from your documents.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-myknowledgebase.kartikkoul.com-9333ea?style=for-the-badge)](https://myknowledgebase.kartikkoul.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-async-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Pinecone](https://img.shields.io/badge/Pinecone-Vector%20DB-1F6FEB?style=flat-square)](https://www.pinecone.io/)
[![Docker](https://img.shields.io/badge/Docker-Cloud%20Run-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#license)

</div>

---

## Overview

**My Knowledgebase** is a full-stack Retrieval-Augmented Generation (RAG) application that lets users upload PDF documents to build a private, personal knowledge base, then ask questions that are answered **strictly from the uploaded content** — with token-by-token streaming, hybrid retrieval, and per-user data isolation.

> *"If the answer isn't in your documents, the bot will say so."*

---

## Architecture

The diagram below illustrates the complete RAG pipeline — from document ingestion through retrieval to answer generation.

<div align="center">

![RAG Pipeline Architecture](./docs/architecture.png)

*Replace `docs/architecture.png` with your own diagram if you'd like to update it.*

</div>

---

## Highlights

- **Hybrid Retrieval** — combines dense semantic embeddings (`all-MiniLM-L6-v2`) with sparse lexical embeddings (SPLADE) for both meaning-based and keyword-based recall.
- **Cross-Encoder Re-ranking** — top-k candidates are re-scored by `cross-encoder/ms-marco-MiniLM-L-6-v2` for higher answer precision.
- **Semantic Chunking** — `LangChain SemanticChunker` splits documents along true semantic boundaries instead of fixed windows.
- **Streaming Answers (SSE)** — responses stream token-by-token from the LLM straight to the UI.
- **Multi-tenant Isolation** — every user's vectors live in their own Pinecone namespace, keyed by `user_id + username`.
- **Google OAuth + JWT** — secure login flow with session tokens.
- **Markdown-rich answers** — responses use GitHub-Flavoured Markdown rendered with `react-markdown`.

---

## Tech Stack

| Layer | Tools |
| --- | --- |
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS, Redux Toolkit, react-markdown (GFM), Google OAuth, JWT, Zod |
| **Backend** | FastAPI (async) + Uvicorn, SSE streaming, PyMuPDF, sentence-transformers, LangChain |
| **Vector DB** | Pinecone (dot-product index, hybrid dense + sparse) |
| **App DB / ORM** | PostgreSQL + Prisma (users / auth) |
| **LLM** | `openai/gpt-oss-120b` via OpenRouter |
| **Embeddings** | Dense: `all-MiniLM-L6-v2` &nbsp;·&nbsp; Sparse: `naver/splade-cocondenser-ensembledistil` |
| **Re-ranker** | `cross-encoder/ms-marco-MiniLM-L-6-v2` |
| **Infra** | Docker, Google Cloud Run (backend), Vercel (frontend) |

---

## RAG Pipeline — Step by Step

### 1. Ingestion

```text
PDF upload  →  PyMuPDF text extraction (page-by-page)
            →  Semantic chunking (LangChain SemanticChunker)
            →  Metadata enrichment (filename, page, user, timestamp)
            →  Dual embedding (dense + sparse)
            →  Stored in Pinecone under user namespace
```

### 2. Retrieval

```text
User query  →  Encode dense (MiniLM) + sparse (SPLADE)
            →  Alpha-weighted hybrid search (α = 0.75)  →  Pinecone top-k = 10
            →  Cross-encoder re-rank → top-k = 2
            →  Build augmented prompt with retrieved context
```

### 3. Generation

```text
Augmented prompt  →  OpenRouter (openai/gpt-oss-120b)
                  →  Stream tokens via SSE  →  Render Markdown in UI
```

If no relevant context is found, a graceful fallback message is streamed instead of hallucinating an answer.

---

## Project Structure

```text
rag-pdf-qna/
├── backend/                        # FastAPI service (Dockerised, Cloud Run)
│   ├── app/
│   │   ├── main.py                 # FastAPI entrypoint
│   │   ├── routes/v1/              # /v1 routes (upload, query, docs)
│   │   ├── services/
│   │   │   ├── ingestion/          # extract, chunk, embed, store
│   │   │   ├── retrieval/          # hybrid search, reranker, augment_query
│   │   │   └── generation/         # OpenRouter streaming
│   │   ├── middlewares/auth/       # JWT / user identity
│   │   ├── models/schemas.py       # Pydantic schemas
│   │   └── db/pc_client.py         # Pinecone client
│   ├── Dockerfile
│   └── pyproject.toml
│
├── frontend/                       # Next.js app (Vercel)
│   ├── src/
│   │   ├── app/                    # App Router pages & API routes
│   │   ├── components/             # UI components (Home, KB, Chat…)
│   │   ├── state/                  # Redux Toolkit store & slices
│   │   ├── services/               # API clients
│   │   └── utils/                  # Helpers
│   ├── prisma/schema.prisma        # User model
│   └── package.json
│
└── docs/
    └── architecture.png            # ← architecture diagram lives here
```

---

## Getting Started Locally

### Prerequisites

- Node.js 20+ and npm
- Python 3.13+ and [uv](https://docs.astral.sh/uv/)
- Docker (optional, for containerised backend)
- A Pinecone project (dot-product index)
- An OpenRouter API key
- A HuggingFace token
- A Google Cloud OAuth client (for sign-in)
- PostgreSQL (local or hosted)

### 1. Clone

```bash
git clone https://github.com/<your-username>/rag-pdf-qna.git
cd rag-pdf-qna
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env        # fill in the values below
uv sync
uv run uvicorn app.main:app --reload --port 8080
```

`backend/.env`:

```bash
PINECONE_API_KEY=""
OPENROUTER_API_KEY=""
HF_TOKEN=""
NEXTJS_SERVER_URL="http://localhost:3000"
ENV="DEV"
```

Health check: `POST http://localhost:8080/health-check`

### 3. Frontend setup

```bash
cd ../frontend
cp .env.example .env        # fill in the values below
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

`frontend/.env`:

```bash
DATABASE_URL="postgresql://user:pass@localhost:5432/myknowledgebase"
JWT_SECRET="<a long random string>"
FASTAPI_BASE_URL="http://localhost:8080/v1"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

> Add `http://localhost:3000/api/v1/auth/oauth/google/callback` as an authorised redirect URI in your Google OAuth client.

Open <http://localhost:3000> and sign in.

### 4. Run backend with Docker (optional)

```bash
cd backend
docker build -t rag-pdf-qna-backend .
docker run --env-file .env -p 8080:8080 rag-pdf-qna-backend
```

---

## API (v1)

All routes are prefixed with `/v1` and require a valid JWT (set after Google OAuth login).

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/v1/upload` | Upload one or more PDFs (≤ 5 MB each). Runs the full ingestion pipeline. |
| `POST` | `/v1/query` | Ask a question — returns a Server-Sent Events stream of tokens. |
| `GET` | `/v1/docs` | List the current user's uploaded documents. |
| `POST` | `/health-check` | Liveness probe. |

### Example: querying with SSE

```bash
curl -N -X POST http://localhost:8080/v1/query \
  -H "Content-Type: application/json" \
  -H "Cookie: <auth cookie>" \
  -d '{"query": "What does chapter 3 say about retrieval?"}'
```

The stream emits `data: "<token>"` frames followed by a final `data: [DONE]`.

---

## Deployment

| Component | Platform | Notes |
| --- | --- | --- |
| **Backend** | Google Cloud Run | Container built from `backend/Dockerfile`, exposed on port `8080`. |
| **Frontend** | Vercel | Auto-deployed from the `frontend/` directory. |
| **Postgres** | Any managed Postgres (Neon, Supabase, RDS…) | Used only for users/auth. |
| **Pinecone** | Pinecone Cloud | Single index, namespaced per user. |

---

## Roadmap

- [ ] Source citations with page-level highlighting in the UI
- [ ] Conversation memory (multi-turn context)
- [ ] Support for non-PDF formats (DOCX, MD, HTML)
- [ ] Per-document deletion & re-indexing
- [ ] Usage analytics dashboard
- [ ] Optional local LLM via Ollama

---

## Contributing

Issues and pull requests are welcome. For larger changes, please open an issue first to discuss what you'd like to change.

```bash
git checkout -b feat/your-feature
# ...make changes...
git commit -m "feat: short description"
git push origin feat/your-feature
```

---

## License

Released under the [MIT License](LICENSE).

---

<div align="center">

**Built by [Kartik Koul](https://kartikkoul.com)** &nbsp;·&nbsp; If you find this useful, consider giving the repo a star.

</div>

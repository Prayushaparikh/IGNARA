# DreamPath CodeX 🚀

AI-powered career discovery + interactive coding platform for high school students.

## Quick Start (Docker)

```bash
docker-compose up --build
```

Then open: http://localhost:3000

---

## Manual Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env        # fill in your values
npm run migrate             # create DB tables + seed careers
npm run dev                 # starts on :4000
```

**Build status, issues & learnings:** [`docs/IGNARA_BUILD_STATUS.md`](docs/IGNARA_BUILD_STATUS.md)  
**Security overview (external-friendly):** [`docs/SECURITY.md`](docs/SECURITY.md)  
**Production (HTTPS, RDS migrations, API, E2E):** [`docs/PRODUCTION_DEPLOY_RUNBOOK.md`](docs/PRODUCTION_DEPLOY_RUNBOOK.md)  
**ignaracodex.com AWS (zone, cert, CloudFront script):** [`docs/IGNARACODEX_AWS_SETUP.md`](docs/IGNARACODEX_AWS_SETUP.md)  
**Domain cost + free HTTPS alternatives:** [`docs/DOMAIN_AND_HTTPS_OPTIONS.md`](docs/DOMAIN_AND_HTTPS_OPTIONS.md)  
**Vercel deploy (GitHub + `ignara.vercel.app`):** [`docs/VERCEL_DEPLOY.md`](docs/VERCEL_DEPLOY.md)

### Frontend
```bash
cd frontend
npm install
npm run dev                 # starts on :3000
```

---

## Project Structure

```
dreampath-codex/
├── backend/
│   ├── src/
│   │   ├── index.js                  # Express app entry
│   │   ├── routes/                   # auth, quiz, challenges, compiler, progress, teacher
│   │   ├── services/
│   │   │   └── ai/
│   │   │       ├── careerScorer.js       # Cosine similarity career matching
│   │   │       └── challengeRecommender.js # Struggle-aware next challenge
│   │   ├── middleware/auth.js        # JWT + role guards
│   │   ├── db/connection.js          # PostgreSQL pool
│   │   └── data/quizSchema.js        # Quiz questions with weights
│   └── migrations/001_init.sql       # Full DB schema + career seeds
│
├── frontend/
│   └── src/
│       ├── pages/                    # Landing, Login, Register, Dashboard,
│       │                             # Quiz, QuizResults, Careers, Challenges,
│       │                             # Compiler, TeacherDashboard
│       ├── components/shared/        # Layout (sidebar nav)
│       ├── store/authStore.js        # Zustand auth state
│       ├── services/api.js           # Axios with JWT interceptor
│       └── styles/globals.css        # Design system (Syne + JetBrains Mono)
│
└── docker-compose.yml                # postgres + redis + api + frontend
```

---

## API Endpoints

| Method | Route                              | Description                    |
|--------|-------------------------------------|-------------------------------|
| POST   | /api/auth/register                  | Create student/teacher account |
| POST   | /api/auth/login                     | Get JWT token                  |
| GET    | /api/quiz/questions                 | Fetch quiz (weights hidden)    |
| POST   | /api/quiz/submit                    | Score + save results           |
| GET    | /api/challenges                     | List challenges                |
| GET    | /api/challenges/next                | AI next challenge              |
| POST   | /api/compiler/run                   | Free-form code run             |
| POST   | /api/compiler/submit                | Run against test cases         |
| GET    | /api/progress/me                    | Student dashboard data         |
| GET    | /api/teacher/classes/:id/analytics  | Teacher class analytics        |

---

## AI Logic

**Career Scoring**: Cosine similarity between normalized student trait vector and career trait vectors across 6 dimensions (PROBLEM_SOLVING, SYSTEMS_THINKING, CREATIVITY, COLLABORATION, DATA_AFFINITY, CURIOSITY).

**Challenge Recommender**: Scores uncompleted challenges by career tag overlap, missing skill gaps, and difficulty band calculated from rolling struggle score (fail rate over last 10 submissions).

**Phase 2 upgrade path**: Swap cosine scorer → collaborative filtering, swap difficulty bucketing → ε-greedy bandit. API contracts stay identical.

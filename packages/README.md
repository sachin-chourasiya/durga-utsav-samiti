# Durga Samiti - Full Project (Backend + Frontend)

## Structure
- backend/    -> Node.js + Express API
- frontend/   -> React + Vite + Tailwind frontend

## Quick Start (local)
1. Backend:
   - cd backend
   - copy .env.example to .env and set MONGO_URI and JWT_SECRET
   - npm install
   - npm run dev

2. Frontend:
   - cd frontend
   - npm install
   - npm run dev
   - Open http://localhost:5173

Notes:
- Use `/init/create-admin` endpoint to create your first admin (POST name, phone, password).
- Admin can add members using /admin/add-member (requires Authorization header with token).

# Professional Cloud Web Application - Backend

This is the enterprise-grade FastAPI backend for the Professional Cloud Web Application.

## Architecture
- **Framework**: FastAPI (Python 3.12+)
- **Database**: MySQL 8
- **ORM**: SQLAlchemy 2.x
- **Migrations**: Alembic
- **Authentication**: JWT & OAuth2 with bcrypt password hashing
- **Validation**: Pydantic v2
- **Containerization**: Docker & Docker Compose

## Layered Design
The codebase follows a clean architecture pattern:
`Router -> Service -> Repository -> Database`
- Business logic is strictly kept inside the `services/` layer.
- Database queries are isolated in the `repositories/` layer.

## Setup & Installation

### 1. Environment Variables
Copy `.env.example` to `.env` and fill in your secrets.
```bash
cp .env.example .env
```

### 2. Running with Docker (Recommended)
You can start the entire stack (MySQL + FastAPI) with a single command:
```bash
docker-compose up --build -d
```
The API will be available at `http://localhost:8000`.
Swagger Documentation will be available at `http://localhost:8000/docs`.

### 3. Running Locally (Without Docker)
Make sure you have MySQL running locally.

1. Install dependencies:
```bash
pip install -r requirements.txt
```
2. Run database migrations:
```bash
alembic upgrade head
```
3. Start the Uvicorn server:
```bash
uvicorn app.main:app --reload
```

## Mock Data
To populate the database with mock data for testing the dashboard:
```bash
python utils/init_db.py
```

## Frontend Compatibility
This backend provides all data via clean JSON REST endpoints starting with `/api`. It is fully compatible with the existing React frontend out-of-the-box via enabled CORS.

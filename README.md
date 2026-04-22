# Event Management System

A full-stack event management platform with user authentication, role-based access control, and event CRUD operations.

## Technology Stack

Backend: FastAPI, PostgreSQL, JWT Authentication, SQLAlchemy ORM
Frontend: React with Vite, React Router, Fetch API

## Setup Instructions

### Prerequisites

Python 3.11 or higher
Node.js 16 or higher
PostgreSQL (Docker or local installation)
Git

### Backend Setup

1. Start PostgreSQL with Docker
```bash
docker run --name postgres-event -e POSTGRES_PASSWORD=password -p 5433:5432 -d postgres
```

2. Create the database
```bash
psql -U postgres -h localhost -p 5433 -c "CREATE DATABASE events_db;"
```

3. Install Python dependencies
```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

4. Configure environment variables
Create or update .env file in the backend folder:
```
DATABASE_URL=postgresql://postgres:password@localhost:5433/events_db
SECRET_KEY=your-random-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
```

5. Run the FastAPI server
```bash
uvicorn main:app --reload --port 8001
```

The backend will be available at http://localhost:8001

### Frontend Setup

1. Install Node dependencies
```bash
cd frontend
npm install
```

2. Start the development server
```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## API Documentation

Interactive API documentation is available at http://localhost:8001/docs

### Authentication Endpoints

POST /api/v1/auth/register
Register a new user with email and password. Returns JWT token and user information.

POST /api/v1/auth/login
Login with email and password. Returns JWT token and user information.

### Event Endpoints

GET /api/v1/events/
Retrieve all events in the system.

POST /api/v1/events/
Create a new event. Requires authentication. Event will be owned by the logged-in user.

GET /api/v1/events/{id}
Get details for a specific event.

PUT /api/v1/events/{id}
Update an event. Only the creator can update their own events.

DELETE /api/v1/events/{id}
Delete an event. Only the creator or admin can delete events.

### Attendee Endpoints

POST /api/v1/events/{id}/join
Join an event. Requires authentication. User cannot join if already joined or if event is full.

POST /api/v1/events/{id}/leave
Leave an event. Requires authentication.

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

Tokens expire after 15 minutes.

## Database Schema

Users Table:
id (primary key), email (unique), password_hash, role (user or admin), created_at

Events Table:
id (primary key), title, description, date, capacity, user_id (foreign key), cancelled (boolean), created_at

Attendees Table:
id (primary key), event_id (foreign key), user_id (foreign key), joined_at

## Features Implemented

User Authentication: Secure registration and login with JWT tokens and bcrypt password hashing.

Event Management: Create, read, update, and delete events with proper access control.

Attendee System: Users can join and leave events with capacity validation.

Role-Based Access: Users can manage their own events. Admins can delete any event.

API Documentation: Auto-generated Swagger UI documentation for all endpoints.

Input Validation: Request validation using Pydantic schemas.

Error Handling: Proper HTTP status codes and error messages.

## Project Structure

backend/
  main.py (FastAPI application entry point)
  database.py (PostgreSQL connection and session management)
  models.py (SQLAlchemy ORM models for User, Event, Attendee)
  schemas.py (Pydantic request and response validation schemas)
  auth.py (JWT token and password hashing utilities)
  routes/
    auth_routes.py (registration and login endpoints)
    events_routes.py (event CRUD endpoints)
    attendees_routes.py (join and leave endpoints)
  .env (environment configuration)
  requirements.txt (Python dependencies)

frontend/
  src/
    pages/
      Login.jsx (user login page)
      Register.jsx (user registration page)
      Dashboard.jsx (event listing and creation)
      AdminPanel.jsx (admin event management)
    components/
      EventCard.jsx (individual event display)
    utils/
      api.js (API communication functions)
    App.jsx (main application component)
    main.jsx (React entry point)
    index.css (global styles)
  package.json (Node dependencies)

## Security Considerations

Implemented Security Features:
Password hashing with bcrypt
JWT token-based authentication
Input validation with Pydantic
CORS configured for frontend access
Role-based access control
Secure token storage in localStorage

Production Recommendations:
Use a strong random SECRET_KEY value
Deploy with HTTPS in production
Implement rate limiting on authentication endpoints
Add token refresh mechanism
Implement email verification for registration
Use environment-specific configuration files
Add comprehensive logging and monitoring
Implement request rate limiting across all endpoints

## Scalability Notes

Current Architecture:
Single FastAPI server instance
Single PostgreSQL database
In-memory token validation
Synchronous request processing

Scaling Recommendations for Production:

Horizontal Scaling:
Deploy multiple FastAPI instances behind a load balancer (Nginx or HAProxy)
Use connection pooling for database connections (PgBouncer)
Implement read replicas for the PostgreSQL database

Caching Layer:
Add Redis for caching frequently accessed data
Cache event listings and user sessions
Reduce database load with strategic caching

Database Optimization:
Add indexes on user_id, event_id, and email columns
Implement connection pooling
Set up automated backups
Monitor query performance

Asynchronous Processing:
Use Celery with Redis for background tasks
Handle email notifications asynchronously
Generate reports without blocking requests

Microservices Architecture:
Separate authentication service from event management
Create dedicated notification service
Build analytics service independently

Recommended Production Stack:
Load Balancer: Nginx or HAProxy
Web Server: FastAPI on Uvicorn with multiple workers
Database: PostgreSQL with replication
Cache: Redis
Message Queue: RabbitMQ or Redis
Container Orchestration: Docker and Kubernetes
Monitoring: Prometheus and Grafana
Logging: ELK Stack or similar

## Testing

Backend tests:
```bash
cd backend
pytest
```

Frontend tests:
```bash
cd frontend
npm test
```

## Usage

1. Register a new account or login with existing credentials
2. Create an event by clicking "Create Event" on the dashboard
3. Join other events by clicking the join button on event cards
4. Leave events by clicking the leave button
5. Edit or delete your own events
6. Admin users can access the admin panel to view system statistics and delete any event

## Troubleshooting

PostgreSQL connection error: Ensure PostgreSQL is running on port 5433 with password "password"

CORS errors: Check that frontend is running on localhost:5173 and backend allows it

Token expired: Tokens expire after 15 minutes. Login again to get a new token

Admin panel access denied: User must have role set to "admin" in the database

## Future Enhancements

Email notifications for event updates
Event categories and advanced filtering
User ratings and event reviews
Enhanced admin dashboard with more statistics
Email verification for new accounts
Two-factor authentication
Event search and recommendation system
Real-time notifications using WebSockets
Social sharing features
Payment integration for paid events

## License

MIT License

## Author

Built for internship evaluation.
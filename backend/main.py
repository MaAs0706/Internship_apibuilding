from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routes import auth_routes,events_routes, attendees_routes


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Event Management API",
    description="API for managing events",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_routes.router)
app.include_router(events_routes.router)
app.include_router(attendees_routes.router)

@app.get("/")
def root():
    return {"message": "Events Manager API"}

@app.get("/health")
def test():
    return {"status": "ok"}
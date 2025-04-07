from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from .routes import router
import logging
import os

app = FastAPI()

frontend_url = os.getenv("FRONTEND_URL")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Manually handle OPTIONS preflight request
@app.options("/{full_path:path}")
async def preflight_handler(full_path: str, response: Response):
    response.headers["Access-Control-Allow-Origin"] = frontend_url
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

# Include your routes (in routes.py)
app.include_router(router)

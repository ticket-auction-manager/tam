import os
from dataclasses import dataclass

import uvicorn
from db import init_db
from fastapi import FastAPI, Header
from routers import imp_routers
from system.auth import AuthRepo

tam_env = os.getenv("TAM_ENV", "prod")

@dataclass
class MainRoute:
    whoami: str = "TAM Server"
    authenticated: bool = False
    healthy: bool = True

init_db()

app = FastAPI(
    title="TAM Server",
    description="Server for Ticket Auction Manager",
    version="0.0.1",
    docs_url=None if tam_env == "prod" else "/docs",
    redoc_url=None,
    openapi_url=None if tam_env == "prod" else "/openapi.json"
)

@app.get("/api")
def get_main_route(tam_key: str = Header("")):
    return MainRoute(authenticated=AuthRepo().check_key(tam_key))

imp_routers(app)

if __name__ == "__main__":
  uvicorn.run(app, port=8000)

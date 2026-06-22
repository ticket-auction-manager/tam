from fastapi import FastAPI
from system.auth import auth_router
from system.prefixes import prefix_router

def imp_routers(app: FastAPI):
    app.include_router(auth_router)
    app.include_router(prefix_router)

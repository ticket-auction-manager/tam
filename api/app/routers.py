from fastapi import FastAPI
from system.auth import auth_router
from system.backuprestore import backuprestore_router
from system.prefixes import prefix_router
from data.tickets import tickets_router
from data.baskets import basket_router
from data.drawing import drawing_router
from data.reports import reports_router
from data.search import search_router

def imp_routers(app: FastAPI):
  app.include_router(auth_router)
  app.include_router(prefix_router)
  app.include_router(tickets_router)
  app.include_router(basket_router)
  app.include_router(drawing_router)
  app.include_router(reports_router)
  app.include_router(search_router)
  app.include_router(backuprestore_router)

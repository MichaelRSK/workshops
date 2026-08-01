from contextlib import asynccontextmanager

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

import routes
from database import db_manager


@asynccontextmanager
async def lifespan(app_instance: FastAPI):
    db_manager.start()
    yield
    await db_manager.client.close()

origins = [
    "http://localhost:5173",
]

app = FastAPI(lifespan=lifespan)
app.add_middleware(CORSMiddleware,
                   allow_origins=origins,
                   allow_methods=["*"],)
app.include_router(routes.api_router)
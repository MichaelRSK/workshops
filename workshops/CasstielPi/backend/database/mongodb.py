import os

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from models.notice import Notice


client: AsyncIOMotorClient | None = None


async def initialize_database() -> None:
    global client

    mongodb_uri = os.getenv("MONGODB_URI")

    if not mongodb_uri:
        raise RuntimeError("MONGODB_URI environment variable is not set")

    client = AsyncIOMotorClient(mongodb_uri)

    database = client.get_database("notice_board_db")

    await init_beanie(
        database=database,
        document_models=[Notice],
    )


async def close_database() -> None:
    if client is not None:
        client.close()
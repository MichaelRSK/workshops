from pymongo import AsyncMongoClient
from dotenv import load_dotenv
import os

load_dotenv()
class DatabaseManager:
    def __init__(self):
        self.client = None
        self.db = None


    def start(self):
        if self.client is not None:
            return

        uri = os.getenv("MONGODB_URI")
        if not uri:
            raise RuntimeError("MONGODB_URI environment variable missing")

        self.client = AsyncMongoClient(uri)
        self.db = self.client["board"]

    def close(self):
        self.client.close()


db_manager = DatabaseManager()

async def get_db():
    if db_manager.client is None:
        db_manager.start()
    return db_manager.db

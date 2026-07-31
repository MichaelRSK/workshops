import os

from dotenv import load_dotenv
from pymongo import MongoClient


load_dotenv()


def get_database():
    mongo_uri = os.getenv("MONGO_URI")
    mongo_db = os.getenv("MONGO_DB", "Noticeboard")

    if not mongo_uri:
        raise RuntimeError("MONGO_URI is not set. Create a .env file and provide MONGO_URI.")

    client = MongoClient(mongo_uri)
    return client[mongo_db]

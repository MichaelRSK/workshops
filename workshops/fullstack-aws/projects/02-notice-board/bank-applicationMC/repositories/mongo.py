import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from pymongo import ASCENDING, MongoClient, ReturnDocument


DATABASE_NAME = "bank_application"
ACCOUNTS_COLLECTION = "accounts"
USERS_COLLECTION = "users"
TRANSACTIONS_COLLECTION = "transactions"
COUNTERS_COLLECTION = "counters"


# Load local settings from either supported credentials filename. Existing
# environment variables take precedence because python-dotenv does not override.
project_root = Path(__file__).resolve().parent.parent

load_dotenv(project_root / ".env")
load_dotenv(project_root / "atlas-credentials.env")


@lru_cache(maxsize=1)
def get_database():
    # The connection URI is the only required MongoDB environment setting.
    mongodb_uri = os.getenv("MONGODB_URI")

    if not mongodb_uri:
        raise ValueError("MONGODB_URI is not set. Add it to your .env file.")

    # Create one client/database object and reuse it.
    client = MongoClient(mongodb_uri)
    database = client[DATABASE_NAME]

    # Make sure required indexes exist before repositories use collections.
    _ensure_indexes(database)
    return database


def _ensure_indexes(database):
    # Unique indexes keep our numeric IDs from duplicating.
    database[ACCOUNTS_COLLECTION].create_index([("account_id", ASCENDING)], unique=True)
    database[USERS_COLLECTION].create_index([("user_id", ASCENDING)], unique=True)
    database[TRANSACTIONS_COLLECTION].create_index(
        [("transaction_id", ASCENDING)],
        unique=True,
    )

    # Query helper index for account transaction history lookups.
    database[TRANSACTIONS_COLLECTION].create_index(
        [("account_id", ASCENDING), ("created_at", ASCENDING)]
    )

    # The counters collection uses MongoDB's built-in unique _id index.
    # Creating another unique index on _id is invalid in MongoDB Atlas.


def get_next_sequence(sequence_name: str) -> int:
    # Keep counters compatible with databases that already contain documents.
    collection_settings = {
        "user_id": (USERS_COLLECTION, "user_id"),
        "account_id": (ACCOUNTS_COLLECTION, "account_id"),
        "transaction_id": (TRANSACTIONS_COLLECTION, "transaction_id"),
    }
    if sequence_name not in collection_settings:
        raise ValueError(f"Unknown sequence: {sequence_name}")

    database = get_database()
    collection_name, id_field = collection_settings[sequence_name]
    highest_document = database[collection_name].find_one(
        {id_field: {"$type": "number"}},
        sort=[(id_field, -1)],
        projection={id_field: 1},
    )
    highest_existing_id = int(highest_document[id_field]) if highest_document else 0

    # The update pipeline atomically chooses at least the current maximum, then
    # increments it. This also repairs missing or stale counters.
    counter = database[COUNTERS_COLLECTION].find_one_and_update(
        {"_id": sequence_name},
        [
            {
                "$set": {
                    "value": {
                        "$add": [
                            {"$max": [{"$ifNull": ["$value", 0]}, highest_existing_id]},
                            1,
                        ]
                    }
                }
            }
        ],
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    return int(counter["value"])

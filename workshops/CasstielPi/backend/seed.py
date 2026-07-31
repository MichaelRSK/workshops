import asyncio

from dotenv import load_dotenv

from database.mongodb import close_database, initialize_database
from models.notice import Notice


SEED_NOTICES = [
    {
        "title": "Welcome",
        "message": "Welcome to the Notice Board application.",
    },
    {
        "title": "Workshop Reminder",
        "message": "Remember to review your partner's pull request.",
    },
    {
        "title": "AWS Deployment",
        "message": "Complete the deployment tiers before submitting.",
    },
]


async def seed_database() -> None:
    load_dotenv()

    await initialize_database()

    try:
        await Notice.delete_all()

        notices = [Notice(**notice) for notice in SEED_NOTICES]
        await Notice.insert_many(notices)

        print(f"Inserted {len(notices)} notices.")
    finally:
        await close_database()


if __name__ == "__main__":
    asyncio.run(seed_database())
from models.user import User
from repositories.mongo import USERS_COLLECTION, get_database, get_next_sequence


class UserRepository:
    def __init__(self, database=None, sequence_generator=get_next_sequence):
        # Connect to MongoDB and select the users collection.
        selected_database = get_database() if database is None else database
        self.users = selected_database[USERS_COLLECTION]
        self.sequence_generator = sequence_generator

    def save(self, user):
        # Assign a new numeric ID when creating a user.
        if user.user_id is None:
            user.user_id = self.sequence_generator("user_id")

        # Store model fields in MongoDB.
        self.users.insert_one(
            {
                "user_id": user.user_id,
                "name": user.name,
                "email": user.email,
                "password_hash": user.password_hash,
                "created_at": user.created_at,
            }
        )
        return user

    def get_by_id(self, user_id):
        # Find one user by business user_id.
        document = self.users.find_one({"user_id": user_id})
        if document is None:
            return None

        # Convert MongoDB document back into User model.
        return User(
            user_id=document["user_id"],
            name=document["name"],
            email=document["email"],
            password_hash=document.get("password_hash"),
            created_at=document.get("created_at"),
        )

    def get_by_email(self, email):
        document = self.users.find_one({"email": email.strip().lower()})
        if document is None:
            return None

        return User(
            user_id=document["user_id"],
            name=document["name"],
            email=document["email"],
            password_hash=document.get("password_hash"),
            created_at=document.get("created_at"),
        )

    def get_all(self):
        # Return users sorted by numeric ID.
        documents = self.users.find().sort("user_id", 1)
        return [
            User(
                user_id=document["user_id"],
                name=document["name"],
                email=document["email"],
                password_hash=document.get("password_hash"),
                created_at=document.get("created_at"),
            )
            for document in documents
        ]

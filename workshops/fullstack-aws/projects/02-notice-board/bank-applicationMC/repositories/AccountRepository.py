from models.account import Account
from repositories.mongo import ACCOUNTS_COLLECTION, get_database, get_next_sequence


class AccountRepository:
    def __init__(self, database=None, sequence_generator=get_next_sequence):
        # Connect to MongoDB and select the accounts collection.
        selected_database = get_database() if database is None else database
        self.accounts = selected_database[ACCOUNTS_COLLECTION]
        self.sequence_generator = sequence_generator

    def save(self, account):
        # Assign a new numeric ID when creating a fresh account.
        if account.account_id is None:
            account.account_id = self.sequence_generator("account_id")

        # Store the account model fields as one MongoDB document.
        self.accounts.insert_one(
            {
                "account_id": account.account_id,
                "user_id": account.user_id,
                "account_type": account.account_type,
                "balance": account.balance,
                "created_at": account.created_at,
            }
        )
        return account

    def get_by_id(self, account_id):
        # Find account by business ID (not Mongo _id).
        document = self.accounts.find_one({"account_id": account_id})
        if document is None:
            return None

        # Map MongoDB document back into our Account model.
        account = Account(
            account_id=document["account_id"],
            user_id=document["user_id"],
            account_type=document["account_type"],
            balance=document.get("balance", 0.0),
        )
        account.created_at = document.get("created_at", account.created_at)
        return account

    def get_all(self):
        # Return accounts in ID order so responses stay predictable.
        documents = self.accounts.find().sort("account_id", 1)
        accounts = []
        for document in documents:
            account = Account(
                account_id=document["account_id"],
                user_id=document["user_id"],
                account_type=document["account_type"],
                balance=document.get("balance", 0.0),
            )
            account.created_at = document.get("created_at", account.created_at)
            accounts.append(account)

        return accounts

    def get_by_user_id(self, user_id):
        documents = self.accounts.find({"user_id": user_id}).sort("account_id", 1)
        accounts = []
        for document in documents:
            account = Account(
                account_id=document["account_id"],
                user_id=document["user_id"],
                account_type=document["account_type"],
                balance=document.get("balance", 0.0),
            )
            account.created_at = document.get("created_at", account.created_at)
            accounts.append(account)
        return accounts

    def get_by_user_and_type(self, user_id, account_type):
        # Query MongoDB directly for an account owned by user + type.
        document = self.accounts.find_one(
            {
                "user_id": user_id,
                "account_type": account_type,
            }
        )
        if document is None:
            return None

        account = Account(
            account_id=document["account_id"],
            user_id=document["user_id"],
            account_type=document["account_type"],
            balance=document.get("balance", 0.0),
        )
        account.created_at = document.get("created_at", account.created_at)
        return account

    def update_balance(self, account_id, balance):
        # Update only the balance field for one account.
        result = self.accounts.update_one(
            {"account_id": account_id},
            {"$set": {"balance": balance}},
        )
        return result.matched_count == 1

from models.transaction import Transaction
from repositories.mongo import TRANSACTIONS_COLLECTION, get_database, get_next_sequence


class TransactionRepository:
    def __init__(self, database=None, sequence_generator=get_next_sequence):
        # Connect to MongoDB and select the transactions collection.
        selected_database = get_database() if database is None else database
        self.transactions = selected_database[TRANSACTIONS_COLLECTION]
        self.sequence_generator = sequence_generator

    def save(self, transaction):
        # Assign numeric ID for new transaction records.
        if transaction.transaction_id is None:
            transaction.transaction_id = self.sequence_generator("transaction_id")

        # Save the transaction as one MongoDB document.
        self.transactions.insert_one(
            {
                "transaction_id": transaction.transaction_id,
                "account_id": transaction.account_id,
                "transaction_type": transaction.transaction_type,
                "amount": transaction.amount,
                "created_at": transaction.created_at,
            }
        )
        return transaction

    def get_by_id(self, transaction_id):
        # Find transaction by business transaction_id.
        document = self.transactions.find_one({"transaction_id": transaction_id})
        if document is None:
            return None

        # Convert MongoDB document back into Transaction model.
        transaction = Transaction(
            transaction_id=document["transaction_id"],
            account_id=document["account_id"],
            transaction_type=document["transaction_type"],
            amount=document.get("amount", 0.0),
        )
        transaction.created_at = document.get("created_at", transaction.created_at)
        return transaction

    def get_by_account_id(self, account_id):
        # Get newest transactions first for account history views.
        documents = self.transactions.find({"account_id": account_id}).sort("created_at", -1)
        transactions = []
        for document in documents:
            transaction = Transaction(
                transaction_id=document["transaction_id"],
                account_id=document["account_id"],
                transaction_type=document["transaction_type"],
                amount=document.get("amount", 0.0),
            )
            transaction.created_at = document.get("created_at", transaction.created_at)
            transactions.append(transaction)

        return transactions

    def get_all(self):
        # Return all transactions sorted by ID.
        documents = self.transactions.find().sort("transaction_id", 1)
        transactions = []
        for document in documents:
            transaction = Transaction(
                transaction_id=document["transaction_id"],
                account_id=document["account_id"],
                transaction_type=document["transaction_type"],
                amount=document.get("amount", 0.0),
            )
            transaction.created_at = document.get("created_at", transaction.created_at)
            transactions.append(transaction)

        return transactions

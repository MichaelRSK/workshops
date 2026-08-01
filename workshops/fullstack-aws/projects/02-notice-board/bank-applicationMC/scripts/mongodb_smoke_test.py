"""Insert and verify a complete banking flow in the configured MongoDB database."""

from datetime import datetime, timezone
from pathlib import Path
import sys
import uuid


# Allow this file to be run directly from the project root or scripts directory.
PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

from models.user import User
from repositories.AccountRepository import AccountRepository
from repositories.TransactionRepository import TransactionRepository
from repositories.UserRepository import UserRepository
from repositories.mongo import get_database
from services.account_service import AccountService
from services.transaction_service import TransactionService


def main():
    database = get_database()
    database.client.admin.command("ping")

    user_repository = UserRepository()
    account_repository = AccountRepository()
    transaction_repository = TransactionRepository()
    account_service = AccountService(account_repository, user_repository)
    transaction_service = TransactionService(account_repository, transaction_repository)

    marker = uuid.uuid4().hex[:8]
    user = user_repository.save(
        User(
            name=f"Mongo Smoke Test {marker}",
            email=f"mongo-smoke-{marker}@example.com",
            created_at=datetime.now(timezone.utc),
        )
    )
    account = account_service.create_account(user.user_id, "CHECKING")
    transaction_service.deposit(account.account_id, 125.50)
    transaction_service.withdraw(account.account_id, 25.25)

    saved_user = user_repository.get_by_id(user.user_id)
    saved_account = account_repository.get_by_id(account.account_id)
    transactions = transaction_repository.get_by_account_id(account.account_id)

    assert saved_user is not None
    assert saved_account is not None
    assert saved_account.balance == 100.25
    assert len(transactions) == 2
    assert {item.transaction_type for item in transactions} == {"DEPOSIT", "WITHDRAW"}

    print("MongoDB smoke test passed.")
    print(f"Database: {database.name}")
    print(f"Created user_id: {user.user_id}")
    print(f"Created account_id: {account.account_id}")
    print(f"Final balance: {saved_account.balance:.2f}")
    print(f"Transaction records: {len(transactions)}")


if __name__ == "__main__":
    main()

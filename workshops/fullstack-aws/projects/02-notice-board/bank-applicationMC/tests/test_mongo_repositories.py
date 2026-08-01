import unittest
from datetime import datetime
from unittest.mock import MagicMock

from models.account import Account
from models.user import User
from repositories.AccountRepository import AccountRepository
from repositories.UserRepository import UserRepository


class UserRepositoryTests(unittest.TestCase):
    def setUp(self):
        self.collection = MagicMock()
        self.repository = UserRepository(
            database={"users": self.collection},
            sequence_generator=lambda sequence_name: 4,
        )

    def test_save_inserts_user_document(self):
        user = User(name="Ada Lovelace", email="ada@example.com")

        saved_user = self.repository.save(user)

        self.assertEqual(saved_user.user_id, 4)
        self.collection.insert_one.assert_called_once_with(
            {
                "user_id": 4,
                "name": "Ada Lovelace",
                "email": "ada@example.com",
                "password_hash": None,
                "created_at": user.created_at,
            }
        )

    def test_get_by_id_returns_user_model(self):
        created_at = datetime(2026, 7, 29, 10, 30)
        self.collection.find_one.return_value = {
            "_id": "mongo-generated-id",
            "user_id": 2,
            "name": "Grace Hopper",
            "email": "grace@example.com",
            "created_at": created_at,
        }

        user = self.repository.get_by_id(2)

        self.collection.find_one.assert_called_once_with({"user_id": 2})
        self.assertIsInstance(user, User)
        self.assertEqual(user.name, "Grace Hopper")
        self.assertEqual(user.created_at, created_at)


class AccountRepositoryTests(unittest.TestCase):
    def setUp(self):
        self.collection = MagicMock()
        self.repository = AccountRepository(
            database={"accounts": self.collection},
            sequence_generator=lambda sequence_name: 8,
        )

    def test_save_inserts_account_document(self):
        account = Account(
            user_id=2,
            account_type="CHECKING",
            balance=125.50,
        )

        saved_account = self.repository.save(account)

        self.assertEqual(saved_account.account_id, 8)
        self.collection.insert_one.assert_called_once_with(
            {
                "account_id": 8,
                "user_id": 2,
                "account_type": "CHECKING",
                "balance": 125.50,
                "created_at": account.created_at,
            }
        )

    def test_get_by_user_and_type_returns_account_model(self):
        created_at = datetime(2026, 7, 29, 11, 0)
        self.collection.find_one.return_value = {
            "account_id": 8,
            "user_id": 2,
            "account_type": "CHECKING",
            "balance": 125.50,
            "created_at": created_at,
        }

        account = self.repository.get_by_user_and_type(2, "CHECKING")

        self.collection.find_one.assert_called_once_with(
            {"user_id": 2, "account_type": "CHECKING"}
        )
        self.assertIsInstance(account, Account)
        self.assertEqual(account.balance, 125.50)
        self.assertEqual(account.created_at, created_at)


if __name__ == "__main__":
    unittest.main()

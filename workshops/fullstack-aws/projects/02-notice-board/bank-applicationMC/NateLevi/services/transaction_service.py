from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from typing import Any

from models.transaction import Transaction


class TransactionService:
    # Receive repository instances from main.py, same style as AccountService.
    def __init__(self, account_repository, transaction_repository):
        self.account_repository = account_repository
        self.transaction_repository = transaction_repository

    def _validate_account_id(self, account_id: int) -> int:
        if not isinstance(account_id, int) or account_id <= 0:
            raise ValueError("Account ID must be a positive integer")
        return account_id

    def _validate_amount(self, amount: Any) -> Decimal:
        # Convert through string so both 12.5 and "12.5" are accepted.
        try:
            validated_amount = Decimal(str(amount))
        except (InvalidOperation, TypeError, ValueError):
            raise ValueError("Amount must be a valid number")

        if validated_amount <= 0:
            raise ValueError("Amount must be greater than zero")

        # Keep money values to 2 decimal places.
        return validated_amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    def _get_owned_account(self, account_id: int, user_id: int):
        account = self.account_repository.get_by_id(account_id)
        if account is None:
            raise ValueError("Account not found")
        if account.user_id != user_id:
            raise PermissionError("You do not have access to this account")
        return account

    def deposit(self, account_id: int, amount: Any, user_id: int):
        """Add money to an account and create a matching deposit transaction."""
        # Validate all inputs first so business rules run before DB writes.
        validated_account_id = self._validate_account_id(account_id)
        validated_amount = self._validate_amount(amount)

        # Confirm account exists before attempting updates.
        account = self._get_owned_account(validated_account_id, user_id)

        current_balance = Decimal(str(account.balance))
        updated_balance = current_balance + validated_amount

        # Persist balance in MongoDB before writing transaction history.
        was_balance_updated = self.account_repository.update_balance(
            validated_account_id,
            float(updated_balance),
        )
        if not was_balance_updated:
            raise ValueError("Failed to update account balance")

        account.balance = float(updated_balance)

        # Store an explicit DEPOSIT record for audit/history.
        transaction = Transaction(
            account_id=validated_account_id,
            transaction_type="DEPOSIT",
            amount=float(validated_amount),
        )
        saved_transaction = self.transaction_repository.save(transaction)

        return {
            "accountId": account.account_id,
            "previousBalance": float(current_balance),
            "balance": float(updated_balance),
            "transaction": {
                "transactionId": saved_transaction.transaction_id,
                "accountId": saved_transaction.account_id,
                "type": saved_transaction.transaction_type,
                "amount": saved_transaction.amount,
                "date": saved_transaction.created_at,
            },
        }

    def withdraw(self, account_id: int, amount: Any, user_id: int):
        """Remove money from an account and create a matching withdrawal transaction."""
        # Validate account ID and amount format/rules.
        validated_account_id = self._validate_account_id(account_id)
        validated_amount = self._validate_amount(amount)

        # Confirm the account exists.
        account = self._get_owned_account(validated_account_id, user_id)

        current_balance = Decimal(str(account.balance))
        # Stop withdrawal if requested amount is greater than available balance.
        if validated_amount > current_balance:
            raise ValueError("Insufficient balance. Cannot withdraw more than current balance")

        updated_balance = current_balance - validated_amount

        # Persist new balance before saving withdrawal record.
        was_balance_updated = self.account_repository.update_balance(
            validated_account_id,
            float(updated_balance),
        )
        if not was_balance_updated:
            raise ValueError("Failed to update account balance")

        account.balance = float(updated_balance)

        # Store a WITHDRAW record so the transaction ledger stays complete.
        transaction = Transaction(
            account_id=validated_account_id,
            transaction_type="WITHDRAW",
            amount=float(validated_amount),
        )
        saved_transaction = self.transaction_repository.save(transaction)

        return {
            "accountId": account.account_id,
            "previousBalance": float(current_balance),
            "balance": float(updated_balance),
            "transaction": {
                "transactionId": saved_transaction.transaction_id,
                "accountId": saved_transaction.account_id,
                "type": saved_transaction.transaction_type,
                "amount": saved_transaction.amount,
                "date": saved_transaction.created_at,
            },
        }

    def get_transactions(self, account_id: int, user_id: int):
        """Return transaction history for one account."""
        # Validate account first and then fetch history.
        validated_account_id = self._validate_account_id(account_id)

        self._get_owned_account(validated_account_id, user_id)

        transactions = self.transaction_repository.get_by_account_id(validated_account_id)
        return [
            {
                "transactionId": txn.transaction_id,
                "accountId": txn.account_id,
                "type": txn.transaction_type,
                "amount": txn.amount,
                "date": txn.created_at,
            }
            for txn in transactions
        ]

from datetime import datetime


class Transaction:
    def __init__(
        self,
        account_id,
        transaction_type,
        amount,
        transaction_id=None
    ):
        self.transaction_id = transaction_id
        self.account_id = account_id
        self.transaction_type = transaction_type
        self.amount = amount
        self.created_at = datetime.now()
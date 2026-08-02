from datetime import datetime


class Account:
    def __init__(self, user_id, account_type, balance=0.0, account_id=None):
        self.account_id = account_id
        self.user_id = user_id
        self.account_type = account_type
        self.balance = balance
        self.created_at = datetime.now()
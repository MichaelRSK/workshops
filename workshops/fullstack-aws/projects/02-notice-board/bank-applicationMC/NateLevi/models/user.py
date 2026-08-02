from datetime import datetime

class User:
    def __init__(self, name, email, password_hash=None, user_id=None, created_at=None):
        self.user_id = user_id
        self.name = name
        self.email = email
        self.password_hash = password_hash
        self.created_at = created_at or datetime.now()

from models.account import Account


class AccountService:

    ## Receive the AccountRepository instance from main.py, so AccountService can call its data access methods

    def __init__(self, account_repository, user_repository):
        self.account_repository = account_repository
        self.user_repository = user_repository

    def create_account(self, user_id, account_type):

        # Check if account type is valid

        if not isinstance(account_type, str):
            raise ValueError("Account type must be CHECKING or SAVINGS")

        account_type = account_type.strip().upper()

        if account_type not in ["CHECKING", "SAVINGS"]:
            raise ValueError("Account type must be CHECKING or SAVINGS")

        if user_id is None or not isinstance(user_id, int) or user_id <= 0:
            raise ValueError("User ID must be a positive integer")

        if self.user_repository.get_by_id(user_id) is None:
            raise ValueError("User not found")

        existing_account = self.account_repository.get_by_user_and_type(
            user_id,
            account_type,
        )

        if existing_account is not None:
            raise ValueError(
            f"User already has a {account_type} account"
        )

        account = Account(user_id, account_type)
        return self.account_repository.save(account)
    
    def get_account(self, account_id):

        ## get account by id from repository

        account = self.account_repository.get_by_id(account_id)

        if account is None:
            raise ValueError("Account not found")

        return account

    def get_all_accounts(self):

        ## get all accounts from repository

        return self.account_repository.get_all()

    def get_accounts_for_user(self, user_id):
        return self.account_repository.get_by_user_id(user_id)

    def get_account_for_user(self, account_id, user_id):
        account = self.get_account(account_id)
        if account.user_id != user_id:
            raise PermissionError("You do not have access to this account")
        return account

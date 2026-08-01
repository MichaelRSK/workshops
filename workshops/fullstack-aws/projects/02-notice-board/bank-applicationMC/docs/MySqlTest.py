from sqlalchemy import create_engine
from fastapi import FastAPI
from sqlalchemy import text
from pydantic import BaseModel

DATABASE_URL = "mysql+pymysql://root:Group3@localhost/bank"

engine = create_engine(DATABASE_URL)

app = FastAPI()

#GET methods for accounts, users and transactions

@app.get("/accounts")
def get_accounts():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM accounts"))
        return [dict(row._mapping) for row in result]

print("Accounts: ", get_accounts())

@app.get("/users")
def get_users(): #GET Call
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM users"))
        return [dict(row._mapping) for row in result]

print("Users: ", get_users())

@app.get("/transactions")
def get_transactions(): #GET Call
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM transactions"))
        return [dict(row._mapping) for row in result]

print("Transactions: ", get_transactions())

#POST methods for the three tables

class Account(BaseModel): #Classes for entries on each table
    account_type: str
    balance: float #IDs are not included because they autopopulate
    user_id: int
    
class User(BaseModel):
    name: str
    email: str

class Transaction(BaseModel):
    txn_type: str
    amount: float
    

@app.post("/accounts")
def create_account(account: Account):
    with engine.begin() as conn:
        conn.execute(
            text("""
                INSERT INTO accounts(account_type, balance, user_id)
                VALUES (:account_type, :balance, :user_id)
            """),
            {
                "account_type": account.account_type,
                "balance": account.balance,
                "user_id": account.user_id
            }
        )

    return "account added"

@app.post("/users")
def create_user(user: User):
    with engine.begin() as conn:
        conn.execute(
            text("""
                INSERT INTO users(name, email)
                VALUES (:name, :email)
            """),
            {
                "name": user.name,
                "email": user.email
            }
        )

    return "user added"

@app.post("/transactions")
def create_transaction(transaction: Transaction):
    with engine.begin() as conn:
        conn.execute(
            text("""
                INSERT INTO transactions(txn_type, amount)
                VALUES (:txn_type, :amount)
            """),
            {
                "txn_type": transaction.txn_type,
                "amount": transaction.amount
            }
        )

    return "transaction added"

'''tx = Transaction( #Example POST test, works as intended
    txn_type = "Deposit",
    amount = 72
)

print(create_transaction(tx))'''

#PUT methods for the three tables

@app.put("/accounts/{id}")
def update_account(id: int, account: Account, newBalance):
    with engine.begin() as conn:
        conn.execute(
            text("""
                UPDATE accounts
                SET balance=:balance
                WHERE user_id=:user_id
            """),
            {
                "user_id": id,
                "balance" : newBalance #Update balance
            }
        )

    return "Updated balance"

@app.put("/users/{id}")
def update_user(id: int, user: User): #Not changing anything only blueprint
    with engine.begin() as conn:
        conn.execute(
            text("""
                UPDATE users
                WHERE user_id=:user_id
            """),
            {
                "user_id": id,
            }
        )

    return "Updated balance"

@app.put("/transactions/{id}")
def update_transaction(id: int, transaction: Transaction): #Not changing anything only blueprint
    with engine.begin() as conn:
        conn.execute(
            text("""
                UPDATE transactions
                WHERE user_id=:user_id
            """),
            {
                "user_id": id,
            }
        )

    return "Updated transaction"

x = Account(
    account_type = "Checking",
    balance = 1000,
    user_id = 1
)
y = Account(
    account_type = "Checking",
    balance = 1000,
    user_id = 4
)
print(update_account(1, x, 1000)) #Update account x to balance of $1000 test


#DELETE methods for the three tables

@app.delete("/accounts/{id}")
def delete_account(id: int):
    with engine.begin() as conn:
        conn.execute(
            text("DELETE FROM accounts WHERE user_id=:user_id"),
            {"user_id": id}
        )

    return "Deleted Account"

@app.delete("/transactions/{id}")
def delete_account(id: int):
    with engine.begin() as conn:
        conn.execute(
            text("DELETE FROM transactions WHERE txn_id=:txn_id"),
            {"txn_id": id}
        )

    return "Deleted Transaction"

@app.delete("/users/{id}")
def delete_user(id: int):
    with engine.begin() as conn:
        conn.execute(
            text("DELETE FROM users WHERE user_id=:user_id"),
            {"user_id": id}
        )

    return "Deleted User"




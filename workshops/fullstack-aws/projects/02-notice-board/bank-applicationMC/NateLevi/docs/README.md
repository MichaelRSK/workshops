# Bank Application

A simple banking system for learning backend architecture and service-layer business rules.

## Features

- Register and log in
- Create an account
- View account details
- Deposit money
- Withdraw money
- View transaction history

## Current Implementation

This repository now uses MongoDB repositories for persistence.

- AccountRepository reads and writes account data in MongoDB
- UserRepository reads and writes user data in MongoDB
- TransactionRepository reads and writes transaction data in MongoDB
- TransactionService contains deposit and withdraw validation and business logic

## Project Structure

```
models/
    account.py
    user.py
    transaction.py

repositories/
    AccountRepository.py
    UserRepository.py
    TransactionRepository.py
    mongo.py

services/
    account_service.py
    transaction_service.py

BankAPI.py
main.py
```

## Architecture

1. API layer receives request
2. Service layer applies business rules
3. Repository layer stores and retrieves data
4. Model layer defines data objects

## Business Rules

- Deposit amount must be a valid positive number
- Withdraw amount must be a valid positive number
- Cannot withdraw more than current account balance
- Every successful deposit and withdraw creates a transaction record

## Quick Start

### 1. Create and activate a virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure MongoDB

```bash
cp .env.example .env
```

Set the following values in `.env`:

- MONGODB_URI (Atlas connection string)
- MONGODB_DB_NAME (example: bank_application)

Optional values:

- MONGODB_USERS_COLLECTION
- MONGODB_ACCOUNTS_COLLECTION
- MONGODB_TRANSACTIONS_COLLECTION

### 4. Run the API

```bash
py -m uvicorn BankAPI:app --reload
```

### 5. Test with real MongoDB entries

After configuring `.env`, run the smoke test from the project root:

```bash
python scripts/mongodb_smoke_test.py
```

The test connects to the configured database and leaves behind one uniquely named
sample user, one checking account, a deposit, and a withdrawal. It verifies that
the final balance is `100.25` and that both transaction records can be read back.

You can inspect the entries in MongoDB Atlas under **Database > Browse Collections**,
or start the API and use its interactive documentation at:

```text
http://127.0.0.1:8000/docs
```

## API Endpoints

### Auth

- POST /auth/register
- POST /auth/token
- GET /auth/me

### Accounts

- GET /accounts
- GET /accounts/{account_id}
- POST /accounts

### Users

- GET /users
- GET /users/{user_id}
- POST /users

### Transactions

- POST /accounts/{account_id}/deposit
- POST /accounts/{account_id}/withdraw
- GET /accounts/{account_id}/transactions

## Team Notes

- Keep repository classes focused on data access only
- Keep service classes focused on validation and business logic only
- Keep credentials in environment variables and do not commit `.env`

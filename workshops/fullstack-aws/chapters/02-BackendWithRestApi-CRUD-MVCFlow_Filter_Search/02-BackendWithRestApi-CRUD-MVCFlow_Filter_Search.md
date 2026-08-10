# 02-BackendWithRestApi-CRUD-MVCFlow

## 🎯 Phase Goal
Architect a modular Python RESTful API using the Model-View-Controller (MVC) or Layered Architecture pattern to handle CRUD operations for the Bank Management System.

## 🛠️ Concepts & Topics Covered
* **Framework:** Flask / FastAPI (Python).
* **Architecture:** Controller/Router -> Service/Logic -> Repository/Data layer.
* **REST Constraints:** HTTP Methods (`GET`, `POST`, `PUT`, `DELETE`), Status Codes (`200`, `201`, `400`, `404`, `500`).
* **CRUD Operations:** Managing Customers, Accounts, Branches, and Transactions.

## 📋 Module Roadmap & Tasks

### Step 1: Project Architecture Setup
* Setup directory layout:

app/
├── controllers/   # API Routes & Request Handling
├── services/      # Business & Domain Logic
├── models/        # In-Memory / DB Schemas
└── main.py        # Entry Point

### Step 2: Implement Core Banking CRUD Endpoints
* **Customer Endpoints:**
* `POST /api/v1/customers` (Create customer profile)
* `GET /api/v1/customers` (List customers)
* `GET /api/v1/customers/{id}` (Get customer details)
* `PUT /api/v1/customers/{id}` (Update info)
* `DELETE /api/v1/customers/{id}` (Deactivate account)
* **Account & Transaction Endpoints:**
* `POST /api/v1/accounts` (Open new account)
* `POST /api/v1/transactions/transfer` (Process money transfer)

### Step 3: Filtering & Search Capabilities
* Implement query parameter filtering:
* `GET /api/v1/accounts?branch_id=123&min_balance=1000`
* `GET /api/v1/transactions?start_date=2026-01-01&type=TRANSFER`
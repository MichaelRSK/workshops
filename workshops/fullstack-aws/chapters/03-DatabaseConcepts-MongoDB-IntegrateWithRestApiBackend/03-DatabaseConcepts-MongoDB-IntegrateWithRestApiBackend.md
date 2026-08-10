# 03-DatabaseConcepts-MongoDB-IntegrateWithRestApiBackend

## 🎯 Phase Goal
Transition from in-memory storage to a persistent NoSQL database (MongoDB / AWS DocumentDB) using document modeling best practices.

## 🛠️ Concepts & Topics Covered
* **Document Databases:** Collections, Documents, BSON/JSON storage.
* **Schema Design:** Embedding vs. Referencing in banking (e.g., embedding recent transactions vs. linking separate transaction histories).
* **Database Driver / ODM:** Motor / PyMongo / Beanie.
* **Aggregation Pipelines:** Computing branch analytics and summaries.

## 📋 Module Roadmap & Tasks

### Step 1: Schema & Data Modeling
* Define MongoDB collections: `users`, `accounts`, `transactions`, `branches`.
* Apply indexes: Index on `account_number`, `branch_code`, and `created_at` for high-performance querying.

### Step 2: Database Driver Integration
* Configure database client connection pooling.
* Map incoming HTTP request bodies to MongoDB documents.

### Step 3: Advanced Queries & Aggregations
* Write aggregation pipelines to address analytical requirements:
  * Calculate monthly branch-wise transfer volumes.
  * Find branches where the non-direct/contract staff ratio exceeds 20%.
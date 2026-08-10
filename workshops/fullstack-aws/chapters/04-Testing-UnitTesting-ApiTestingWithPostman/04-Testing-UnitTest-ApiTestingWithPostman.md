# 04-Testing-UnitTest-ApiTestingWithPostman

## 🎯 Phase Goal
Ensure service reliability, error resilience, and correct logic enforcement using automated unit tests and manual/automated API verification via Postman.

## 🛠️ Concepts & Topics Covered
* **Unit Testing:** `pytest` / `unittest` in Python.
* **API Testing:** Postman Collections, Environment Variables, Pre-request Scripts, Tests/Assertions.
* **Mocking:** Isolation of service layers from database calls.

## 📋 Module Roadmap & Tasks

### Step 1: Unit Testing Banking Logic
* Write unit tests for core financial logic:
  * Test overdraft protection logic.
  * Test transfer failure scenarios (insufficient funds, negative amounts).
  * Mock DB repositories during service layer unit tests.

### Step 2: Postman Collection Setup
* Build a structured Postman Collection: `Bank System API Suite`.
* Create environment variables: `{{base_url}}`, `{{customer_id}}`, `{{account_number}}`.

### Step 3: Postman Test Scripts
* Write tests verifying HTTP status codes, response schemas, and payloads:
  ```javascript
  pm.test("Status code is 201 Created", function () {
      pm.response.to.have.status(201);
  });
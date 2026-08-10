# 05-B-PostmanTesting-With-JWT-Using-Postman

## 🎯 Phase Goal
Automate authentication flows within Postman to test role-restricted routes effectively.

## 🛠️ Concepts & Topics Covered
* **Postman Auth Inheritance:** Inheriting bearer tokens across dynamic request hierarchies.
* **Scripting:** Extracting dynamic tokens from `/login` responses into collection variables.
* **Role Simulation:** Testing access denials (`401 Unauthorized` / `403 Forbidden`).

## 📋 Module Roadmap & Tasks

### Step 1: Token Capture Scripting
* Add a post-response script to the `POST /login` route:
  ```javascript
  var jsonData = pm.response.json();
  pm.collectionVariables.set("jwt_token", jsonData.access_token);

  Step 2: Collection-Level Authentication
Set authentication type to Bearer Token with value {{jwt_token}} for all sub-folders.

Step 3: Security Test Matrix
Execute test suites checking:

Valid login -> Access granted (200 OK).

CUSTOMER accessing Manager analytics -> Access denied (403 Forbidden).

Expired/Malformed token -> Rejection (401 Unauthorized).
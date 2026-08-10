### Folder: `05-A-AddingSecurity-Authentication-Authorization-JWT-RBAC-ToBackend/README.md`

```markdown
# 05-A-AddingSecurity-Authentication-Authorization-JWT-RBAC-ToBackend

## 🎯 Phase Goal
Secure the application using JSON Web Tokens (JWT) and enforce Role-Based Access Control (RBAC) to distinguish between Customers, Tellers, Branch Managers, and Admins.

## 🛠️ Concepts & Topics Covered
* **Authentication:** Password hashing (`bcrypt`), login routes, access/refresh tokens.
* **Authorization:** Role-Based Access Control (RBAC).
* **JWT:** Payload structure, signing key, token verification middleware.

## 📋 Module Roadmap & Tasks

### Step 1: Identity & Password Management
* Implement secure user registration and login endpoints.
* Store passwords using `bcrypt` salted hashing.

### Step 2: JWT Issuance & Verification Middleware
* Issue JWT tokens upon successful authentication containing `sub`, `email`, and `roles`.
* Intercept incoming requests with standard authorization headers (`Bearer <token>`).

### Step 3: Implement RBAC Rules
* **Roles:** `CUSTOMER`, `TELLER`, `BRANCH_MANAGER`, `ADMIN`.
* Restrict endpoints:
  * `CUSTOMER`: Can view only their *own* accounts and execute transfers.
  * `TELLER`: Can deposit/withdraw on behalf of customers.
  * `BRANCH_MANAGER`: Can view branch performance metadata and staff metrics.
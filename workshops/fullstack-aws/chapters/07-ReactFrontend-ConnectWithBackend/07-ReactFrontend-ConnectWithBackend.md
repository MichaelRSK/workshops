# 07-ReactFrontend-ConnectWithBackend

## 🎯 Phase Goal
Build an interactive, responsive frontend application in React using UI component libraries (e.g., Material-UI) and connect it securely to the backend REST API.

## 🛠️ Concepts & Topics Covered
* **React Concepts:** Components, State (`useState`), Effects (`useEffect`), Context API.
* **Component Library:** Material-UI (MUI) components for responsive dashboards.
* **HTTP Client:** Axios / Fetch API with request interceptors for JWT.
* **UI Features:** Responsive grid, transaction search/filter tables, role-based view rendering.

## 📋 Module Roadmap & Tasks

### Step 1: Frontend Application Setup
* Scaffold React application with Material-UI (`@mui/material`).
* Setup layout structure: Navigation Bar, Dashboard, Analytics View, Account View.

### Step 2: Auth Integration & Interceptors
* Build Auth Context to persist JWT in memory/local storage.
* Configure Axios interceptor to attach JWT token to outgoing API requests.

### Step 3: Build Core Banking Views
* **Customer Portal:** View balance, account history, perform money transfer.
* **Manager Dashboard:** Data grid displaying branch staff distribution and performance indicators.
* **Responsive Layout:** Ensure compatibility across mobile and desktop views using `React-Responsive` / `MUI Grid`.
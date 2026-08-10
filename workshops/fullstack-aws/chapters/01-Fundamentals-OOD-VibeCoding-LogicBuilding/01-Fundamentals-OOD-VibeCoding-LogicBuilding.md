# 01-Fundamentals-OOD-VibeCoding-LogicBuilding

## 🎯 Phase Goal
Understand core Object-Oriented Design (OOD) principles, establish logical flows for banking entities, and leverage AI coding assistants ("Vibe Coding") effectively to prototype core business logic.

## 🛠️ Concepts & Topics Covered
* **Object-Oriented Programming (OOP) in Python:** Classes, Objects, Inheritance, Encapsulation, Polymorphism.
* **Domain Modeling:** Designing models for `Bank`, `Account` (Savings/Checking), `Customer`, `Transaction`, and `Branch`.
* **Business Logic & Validation:** Enforcing rules (e.g., minimum balance requirements, transfer limits, non-negative deposits).
* **Vibe Coding Workflow:** Prompt engineering for code scaffolding, rapid prototyping, and algorithmic problem-solving.

## 📋 Module Roadmap & Tasks

### Step 1: Banking Domain Analysis
* Identify entities:
  * **Customer**: ID, Name, Email, Accounts list, Branch ID.
  * **Account**: Account Number, Type (Checking/Savings), Balance, Owner ID.
  * **Transaction**: ID, FromAccount, ToAccount, Amount, Timestamp, Type (Deposit/Withdrawal/Transfer).
  * **Branch**: Branch Code, Location, Manager ID, Staff list.

### Step 2: Implement OOP Models
* Create base classes and subclasses:
  * `Account` class with methods: `deposit()`, `withdraw()`, `get_balance()`.
  * `SavingsAccount` extending `Account` with minimum balance enforcement.
  * `CheckingAccount` extending `Account` with overdraft limit logic.

### Step 3: Implement Business Logic Rules
* Build logic to answer domain questions:
  * Which accounts belong to a specific branch?
  * What is the total transaction volume for a branch per month?
  * Which branches have a staff-to-manager ratio over a specified limit?

### Step 4: Logic Building & Vibe Coding Exercises
* **Task:** Use an AI coding assistant to generate edge-case validation scenarios (e.g., concurrent withdrawal handling logic, negative inputs).
* Refactor auto-generated code to adhere to clean code principles.
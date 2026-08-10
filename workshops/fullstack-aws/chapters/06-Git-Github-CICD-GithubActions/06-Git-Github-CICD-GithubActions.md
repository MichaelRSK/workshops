---

### Folder: `06-Git-Github-CICD-GithubActions`

```markdown
# 06-Git-Github-CICD-GithubActions

## 🎯 Phase Goal
Implement modern software delivery workflows through Git version control practices and continuous integration/deployment (CI/CD) pipelines using GitHub Actions.

## 🛠️ Concepts & Topics Covered
* **Git Workflows:** Feature branching, PR reviews, merge strategies.
* **GitHub Actions:** Workflows, jobs, steps, triggers (`push`, `pull_request`).
* **Automated Quality Gate:** Running unit tests and linters automatically on pull requests.

## 📋 Module Roadmap & Tasks

### Step 1: Git Branching Strategy
* Establish branch protection rules on `main`.
* Enforce workflow: `feature/branch-management` -> Pull Request -> `main`.

### Step 2: Continuous Integration Workflow (`.github/workflows/ci.yml`)
* Configure automated pipeline triggers:
  * Install dependencies.
  * Execute `flake8` / `black` linter check.
  * Run `pytest` test suite.

### Step 3: CI Feedback Rules
* Block merging of PRs if automated tests fail or coverage drops below thresholds.
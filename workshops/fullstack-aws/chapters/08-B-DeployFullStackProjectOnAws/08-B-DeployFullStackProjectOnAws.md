# 08-B-DeployFullStackProjectOnAws

## 🎯 Phase Goal
Deploy the complete Bank Design full-stack application onto AWS cloud infrastructure with production-ready patterns.

## 🛠️ Concepts & Topics Covered
* **Frontend Hosting:** CloudFront + S3 (Static Website Hosting).
* **Backend Hosting:** Containerized / EC2 execution or API Gateway + Lambda.
* **Database Hosting:** Amazon DocumentDB / Managed MongoDB cluster.
* **Domain & Security:** HTTPS/SSL, CORS configuration between frontend and backend.

## 📋 Module Roadmap & Tasks

### Step 1: Backend Deployment
* Provision EC2/App Runner instance, build Python backend runtime environment, and connect to DocumentDB.
* Configure environment secrets using AWS Systems Manager Parameter Store.

### Step 2: Frontend Deployment
* Build production bundle (`npm run build`).
* Upload build artifacts to S3 bucket and distribute globally via CloudFront CDN.

### Step 3: CORS & End-to-End Verification
* Configure CORS headers on backend allowing incoming traffic from the CloudFront URL.
* Conduct end-to-end integration tests on the production URL.
# 🧪 SmartWallet AI - Postman Testing Guide

This guide provides instructions on how to test the SmartWallet AI API using Postman.

## 🚀 Getting Started

1.  **Start the Server**: Ensure your backend is running (`npm run dev`).
2.  **Base URL**: `http://localhost:3000/api`

---

## 🔐 Authentication Flow

### 1. Register a New User
- **Method**: `POST`
- **URL**: `{{BaseURL}}/auth/register`
- **Body** (JSON):
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```
- **Expected Response**: `201 Created` with a `token`.

### 2. Login
- **Method**: `POST`
- **URL**: `{{BaseURL}}/auth/login`
- **Body** (JSON):
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
- **Expected Response**: `200 OK` with a `token`.

### 3. Setup Authorization in Postman
- Copy the `token` from the login response.
- In Postman, go to the **Auth** tab of your collection or request.
- Select **Bearer Token** and paste the token there.

---

## 📂 Testing Controllers

### User Profile
- **Get Profile**: `GET {{BaseURL}}/user-profile/{{userId}}`
- **Update Profile**: `POST {{BaseURL}}/user-profile/{{userId}}`
  - Body: `{"monthlyRevenue": 5000, "preferredCurrency": "EUR"}`

### Accounts
- **Create Account**: `POST {{BaseURL}}/accounts`
  - Body: `{"user": "{{userId}}", "name": "Main Savings", "type": "Savings", "balance": 1000}`
- **Get User Accounts**: `GET {{BaseURL}}/accounts/user/{{userId}}`

### Transactions
- **Create Transaction**: `POST {{BaseURL}}/transactions`
  - Body: 
  ```json
  {
    "user": "{{userId}}",
    "account": "{{accountId}}",
    "category": "{{categoryId}}",
    "amount": 50,
    "type": "Expense",
    "description": "Grocery Shopping"
  }
  ```

### Savings Goals
- **Create Goal**: `POST {{BaseURL}}/savings-goals`
  - Body: `{"user": "{{userId}}", "name": "New Car", "targetAmount": 20000}`
- **Add Contribution**: `PUT {{BaseURL}}/savings-goals/{{goalId}}/contribute`
  - Body: `{"amount": 500}`

### 🤖 AI Financial Advisor
- **Get Financial Advice**: `POST {{BaseURL}}/ai/advice`
  - Body (JSON):
  ```json
  {
    "userData": {
      "income": 3000,
      "expenses": 2500,
      "topCategory": "Food"
    }
  }
  ```
- **Predict Expenses**: `POST {{BaseURL}}/ai/predict`
  - Body (JSON):
  ```json
  {
    "history": [
      {"date": "2023-11-01", "amount": 120, "category": "Utilities"},
      {"date": "2023-11-05", "amount": 50, "category": "Food"}
    ]
  }
  ```

---

## 🛠 Pro Tips for Postman

- **Environments**: Use Postman Environments to store `BaseURL`, `token`, and `userId` as variables.
- **Pre-request Scripts**: You can automate token handling if needed.
- **Tests Tab**: Add basic tests like `pm.response.to.have.status(200);` to verify responses automatically.

---

---

> [!TIP]
> Use the **Tests** tab in Postman to automatically save variables:
> `pm.environment.set("token", pm.response.json().token);`

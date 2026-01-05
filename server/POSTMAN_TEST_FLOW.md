# 🧪 SmartWallet AI - Full API Testing Flow (Step-by-Step)

This guide walks you through a complete testing scenario to verify every route in the SmartWallet AI backend.

## 🛠 Preparation
1. **Start Server**: `npm run dev` (Ensure it's running on port 3000).
2. **Postman Environment**: Create an environment and add:
   - `BaseURL`: `http://localhost:3000/api`
   - `token`: (leave empty)
   - `userId`: (leave empty)
   - `accountId`: (leave empty)
   - `categoryId`: (leave empty)
   - `goalId`: (leave empty)

---

## 🏎️ Phase 1: Authentication & User Setup

### 1. Register a User
- **POST** `{{BaseURL}}/auth/register`
- **Body**:
```json
{
  "username": "tester",
  "email": "tester@test.com",
  "password": "password123"
}
```
- **Action**: Copy the `token` from response to your environment variables.

### 2. Login
- **POST** `{{BaseURL}}/auth/login`
- **Body**: `{"email": "tester@test.com", "password": "password123"}`
- **Action**: Update `token` and copy `user.id` to your `userId` variable.

### 3. Get Current User (Verify Auth)
- **GET** `{{BaseURL}}/auth/me`
- **Header**: Bearer Token `{{token}}`

### 4. Create/Update Profile
- **POST** `{{BaseURL}}/users/{{userId}}/profile`
- **Body**:
```json
{
  "monthlyRevenue": 5000,
  "preferredCurrency": "USD",
  "riskLevel": "Low"
}
```

---

## 🏦 Phase 2: Financial Infrastructure

### 5. Create a Category
- **POST** `{{BaseURL}}/categories`
- **Body**: `{"name": "Food", "icon": "🍔", "color": "#FF5733"}`
- **Action**: Save the `_id` to `categoryId`.

### 6. Create an Account
- **POST** `{{BaseURL}}/accounts`
- **Body**: 
```json
{
  "user": "{{userId}}",
  "name": "Checking Account",
  "type": "Checking",
  "balance": 2000
}
```
- **Action**: Save the `_id` to `accountId`.

---

## 💸 Phase 3: Transactions & Budgets

### 7. Create a Budget
- **POST** `{{BaseURL}}/budgets`
- **Body**:
```json
{
  "user": "{{userId}}",
  "month": 1,
  "year": 2026,
  "totalLimit": 1000,
  "categories": [
    { "category": "{{categoryId}}", "limit": 200 }
  ]
}
```

### 8. Create a Transaction (Expense)
- **POST** `{{BaseURL}}/transactions`
- **Body**:
```json
{
  "user": "{{userId}}",
  "account": "{{accountId}}",
  "category": "{{categoryId}}",
  "amount": 50,
  "type": "Expense",
  "description": "Lunch"
}
```
- **Note**: This will automatically trigger a background budget check!

### 9. Get User Transactions
- **GET** `{{BaseURL}}/transactions/user/{{userId}}`

---

## 🎯 Phase 4: Goals & Social

### 10. Create a Savings Goal
- **POST** `{{BaseURL}}/savings-goals`
- **Body**: `{"user": "{{userId}}", "name": "New Laptop", "targetAmount": 1500}`
- **Action**: Save `_id` to `goalId`.

### 11. Add Contribution to Goal
- **PUT** `{{BaseURL}}/savings-goals/{{goalId}}/contribute`
- **Body**: `{"amount": 100}`

### 12. Create a Shared Budget
- **POST** `{{BaseURL}}/budgets/shared`
- **Body**: `{"name": "Family Trip", "participants": [{"user": "{{userId}}", "role": "Admin"}]}`

---

## 🤖 Phase 5: AI & Notifications

### 13. Get AI Advice
- **POST** `{{BaseURL}}/ai/advice`
- **Body**: 
```json
{
  "userData": {
    "income": 5000,
    "expenses": 3000,
    "topCategory": "Food"
  }
}
```

### 14. Check Notifications
- **GET** `{{BaseURL}}/notifications/user/{{userId}}`
- **Action**: Verify if the budget alert or registration notice is there.

---

## 🧹 Phase 6: Cleanup (Optional)
- **DELETE** `{{BaseURL}}/transactions/{{transId}}`
- **DELETE** `{{BaseURL}}/accounts/{{accountId}}`
- **DELETE** `{{BaseURL}}/users/{{userId}}`

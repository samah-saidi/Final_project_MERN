# 🧪 SmartWallet AI - Postman Testing Guide

Ce guide vous explique comment tester vos API, ajouter des données et automatiser la gestion du jeton d'authentification (JWT).

## 🚀 Configuration Initiale

1.  **Server** : Assurez-vous que le backend tourne (`npm run dev`).
2.  **Variables d'Environnement** : Créez un environnement Postman avec :
    - `BaseURL`: `http://localhost:3000/api`
    - `token`: (laissé vide)

---

## 🔐 Authentification & Persistance (Automatique)

### 1. Login (POST)
- **URL** : `{{BaseURL}}/auth/login`
- **Body (JSON)** :
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Script de Sauvegarde (Onglet "Tests")
Collez ce code dans l'onglet **Tests** de votre requête Login :
```javascript
const response = pm.response.json();
if (response.token) {
    pm.environment.set("token", response.token);
    console.log("Token JWT sauvegardé !");
}
```

### 3. Usage global
Allez dans la configuration de votre **Collection** Postman -> onglet **Authorization** :
- Type : `Bearer Token`
- Token : `{{token}}`
*Toutes les requêtes de la collection utiliseront désormais ce jeton automatiquement.*

---

## 📂 Endpoints Principaux

### 🏦 Accounts (Comptes)
- **Créer** : `POST {{BaseURL}}/accounts`
```json
{
    "name": "Compte Courant",
    "type": "Checking",
    "balance": 2500,
    "currency": "DT",
    "icon": "🏦"
}
```

### 📁 Categories
- **Créer** : `POST {{BaseURL}}/categories`
```json
{
    "name": "Alimentation",
    "type": "Expense",
    "icon": "🍎"
}
```

### 💸 Transactions
- **Créer** : `POST {{BaseURL}}/transactions`
```json
{
    "account": "ID_COMPTE_MONGO",
    "category": "ID_CATEGORIE_MONGO",
    "amount": 50,
    "type": "Expense",
    "description": "Courses"
}
```

### 🎯 Savings Goals (Objectifs)
- **Créer** : `POST {{BaseURL}}/savings-goals`
```json
{
    "name": "Voyage",
    "targetAmount": 5000,
    "deadline": "2025-12-31"
}
```

### 🤖 AI Financial Advisor
- **Conseils** : `POST {{BaseURL}}/ai/advice`
```json
{
    "userData": {
      "income": 3000,
      "expenses": 2500,
      "topCategory": "Food"
    }
}
```

---

> [!TIP]
> Utilisez l'onglet **Console** de Postman (en bas à gauche) pour voir si le script de sauvegarde du token s'est bien exécuté.

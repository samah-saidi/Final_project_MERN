# 🎨 SmartWallet AI - Frontend

SmartWallet AI is a modern, high-end financial management dashboard built with React 19 and Vite. It provides a sleek, glassmorphic user interface for managing personal finances with real-time synchronization and proactive notifications.

---

## 📑 Table of Contents
- [✨ Key Features](#-key-features)
- [🧩 Entity & Architecture Deep Dive](#-entity--architecture-deep-dive)
- [🛠 Technologies & Stack](#-technologies--stack)
- [📂 Project Structure](#-project-structure)
- [🚀 Performance & Design](#-performance--design)
- [⚙️ Installation & Setup](#-installation--setup)

---

## ✨ Key Features

- **🔐 Secure Access**: Integrated authentication flow with JWT storage and protected routing.
- **📊 Interactive Dashboard**: Real-time overview of financial health (Profiles & Stats).
- **🏦 Multi-Account Management**: 
    - Create and track multiple bank accounts (Checking, Savings, etc.).
    - Real-time balance updates linked to transactions.
- **💸 Transaction Hub**: 
    - Categorized income and expense tracking.
    - Automatic account balance adjustment upon creation or deletion.
- **🎯 Savings Goals**: Visual milestone tracking with progress bars and completion badges.
- **📁 Smart Categories**: Custom categories with icon and color customization.
- **🤖 AI Financial Advisor**: Centralized page for personalized advice, market trends, and finance quizzes.
- **💬 Interactive Chatbot**: Floating 24/7 assistant for real-time financial guidance.
- **🔔 Notification Center**: Real-time alerts for budgets and system info.

---

## 🧩 Entity & Architecture Deep Dive

The frontend is designed around **Highly Reactive Entities**. Every action in one module propagates changes to others instantly.

### 1. 👤 The User Entity (Auth State)
- **Role**: The core of the application state. 
- **State Management**: Handled via `AuthContext`.
- **Data Persistence**: Token and basic user info (ID, name) are stored in `localStorage` for session persistence.
- **Logic**: All data fetching across the app depends on the `user` object being finalized to prevent race conditions (Unauthorized errors).

### 2. 🏦 Accounts (The Wallet)
- **Properties**: Name, Type (Checking, Savings, Crypto...), Balance, Currency.
- **Frontend Logic**: Accounts are the "Source of Truth" for funds. Each transaction must be associated with an account ID. 
- **Sync**: When a transaction is added, the frontend triggers a re-fetch of the account list to show the updated balance immediately.

### 3. 💸 Transactions (The Flow)
- **Properties**: Type (Income/Expense), Amount, Category, Account, Date.
- **Frontend Logic**: This is the most active entity. 
- **Interactions**:
    - **To Account**: Adjusts the balance.
    - **To Budget**: Increases the "Spent" amount for the related category.
    - **To AI**: Supplies raw data for spending analysis.

### 4. 📊 Budgets (The Guardrail)
- **Properties**: Category, Limit Amount, Period (Weekly/Monthly/Yearly), Start/End Dates.
- **Frontend Logic**: Budgets do not store "Spent" data directly; the frontend displays a **virtual spending calculation** fetched from the server's budget service.
- **Visuals**: Dynamic progress bars change colors (Blue -> Orange -> Red) based on percentage used.

### 5. 🎯 Savings Goals (The Milestone)
- **Properties**: Name, Target Amount, Current Amount, Deadline.
- **Frontend Logic**: Tracks progress toward long-term objectives. 
- **Feature**: Automatic "Goal Achieved" badge when `Current >= Target`.

### 6. 📁 Categories (The Organization)
- **Properties**: Name, Type, Icon (Emoji), Color.
- **Frontend Logic**: Provides the metadata for both Transactions and Budgets. Users can customize their financial taxonomy here.

### 7. 🔔 Notifications (The Feedback)
- **Properties**: Title, Message, Type (Info, BudgetExceeded), Status (Read/Unread).
- **Frontend Logic**: Keeps the user informed of background events (like a budget overflow triggered by a transaction).

### 8. 🤖 AI Intelligence (The Brain)
- **Components**: `AIAdvisor` (Full Page), `AIChatbot` (Floating).
- **Frontend Logic**: Aggregates history and current financial state to generate high-context prompts for Gemini AI. 
- **Latency Optimization**: Uses loading skeletal states and micro-animations to improve perceived performance during AI generation.

---

## 🛠 Technologies & Stack

- **Framework**: [React 19](https://react.dev/) (Functional Components & Hooks)
- **Build Tool**: [Vite](https://vitejs.dev/) (Ultra-fast HMR)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **API Client**: [Axios](https://axios-http.com/)
- **UI Feedback**: [SweetAlert2](https://sweetalert2.github.io/)
- **Styling**: Vanilla CSS with CSS Variables for theme consistency.

---

## 📂 Project Structure

```text
client/
├── src/
│   ├── api/            # Axios instance & interceptors
│   ├── components/     # Reusable UI (Navbar, AIChatbot, ProtectedRoute)
│   ├── context/        # AuthContext & FinancialContext logic
│   ├── pages/          # Full-page components (AIAdvisor, Dashboard...)
│   ├── assets/         # CSS design system & assets
│   ├── App.jsx         # Routing & Layout initialization
│   └── index.css       # Core typography & reset
└── package.json        
```

---

## 🚀 Performance & Design

- **Glassmorphism**: Premium frosted-glass aesthetics for cards and modals.
- **Reactive Dependencies**: All `useEffect` hooks for data fetching include `[user]` to ensure synchronization with the auth lifecycle.
- **Micro-animations**: Smooth hover transitions and loading skeletons for a seamless feel.

---

## ⚙️ Installation & Setup

1. **Install Dependencies**: `npm install`
2. **Setup .env**: Create `VITE_API_URL=http://localhost:3000/api`
3. **Run Dev Server**: `npm run dev`

---

*SmartWallet AI - Bridging Finance and Intelligence.*

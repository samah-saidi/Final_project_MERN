// server/scripts/seedData.js

const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const Account = require('../models/Account');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const SavingsGoal = require('../models/SavingsGoal');

const CONFIG = {
  USERS_COUNT: 30,              // Reduced for testing, can be increased
  ACCOUNTS_PER_USER: 2,
  TRANSACTIONS_PER_USER: 200,
  SAVINGS_GOALS_PER_USER: 2
};

const CATEGORY_TEMPLATES = [
  { name: 'Alimentation', type: 'Expense', icon: '🍔', color: '#FF6B6B' },
  { name: 'Transport', type: 'Expense', icon: '🚗', color: '#4ECDC4' },
  { name: 'Logement', type: 'Expense', icon: '🏠', color: '#45B7D1' },
  { name: 'Loisirs', type: 'Expense', icon: '🎮', color: '#FFA07A' },
  { name: 'Shopping', type: 'Expense', icon: '🛍️', color: '#98D8C8' },
  { name: 'Santé', type: 'Expense', icon: '💊', color: '#F7DC6F' },
  { name: 'Salaire', type: 'Income', icon: '💰', color: '#52C41A' },
  { name: 'Freelance', type: 'Income', icon: '💼', color: '#73D13D' }
];

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartwallet';
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');
};

async function cleanDatabase() {
  console.log('🗑️  Cleaning database...');
  await Promise.all([
    User.deleteMany({}),
    UserProfile.deleteMany({}),
    Account.deleteMany({}),
    Category.deleteMany({}),
    Transaction.deleteMany({}),
    Budget.deleteMany({}),
    SavingsGoal.deleteMany({})
  ]);
  console.log('✅ Database cleaned');
}

async function seed() {
  try {
    await connectDB();
    await cleanDatabase();

    for (let i = 0; i < CONFIG.USERS_COUNT; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const user = await User.create({
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        password: 'password123'
      });

      await UserProfile.create({
        user: user._id,
        monthlyIncome: faker.number.int({ min: 2000, max: 8000 }),
        currency: 'DT'
      });

      // Create categories for this user
      const userCategories = await Category.insertMany(
        CATEGORY_TEMPLATES.map(ct => ({ ...ct, user: user._id }))
      );

      const accounts = [];
      const accountTypes = ['Checking', 'Savings', 'Investment'];
      for (let j = 0; j < CONFIG.ACCOUNTS_PER_USER; j++) {
        const acc = await Account.create({
          user: user._id,
          name: `${faker.helpers.arrayElement(accountTypes)} Account`,
          type: faker.helpers.arrayElement(accountTypes),
          balance: faker.number.float({ min: 1000, max: 10000, precision: 0.01 }),
          currency: 'DT'
        });
        accounts.push(acc);
      }

      const transactions = [];
      const expenseCats = userCategories.filter(c => c.type === 'Expense');
      const incomeCats = userCategories.filter(c => c.type === 'Income');

      for (let j = 0; j < CONFIG.TRANSACTIONS_PER_USER; j++) {
        const isExpense = Math.random() < 0.8;
        const category = faker.helpers.arrayElement(isExpense ? expenseCats : incomeCats);
        const account = faker.helpers.arrayElement(accounts);

        transactions.push({
          user: user._id,
          account: account._id,
          category: category._id,
          amount: faker.number.float({ min: 10, max: 500, precision: 0.01 }),
          type: isExpense ? 'Expense' : 'Income',
          date: faker.date.recent({ days: 30 }),
          description: faker.commerce.productName()
        });
      }
      await Transaction.insertMany(transactions);

      // Create Budget
      const randomCategory = faker.helpers.arrayElement(expenseCats);
      await Budget.create({
        user: user._id,
        category: randomCategory._id,
        amount: faker.number.int({ min: 1000, max: 2000 }),
        period: 'Monthly'
      });

      // Create Savings Goals
      for (let j = 0; j < CONFIG.SAVINGS_GOALS_PER_USER; j++) {
        await SavingsGoal.create({
          user: user._id,
          name: faker.helpers.arrayElement(['Vacations', 'New Car', 'Emergency Fund']),
          targetAmount: faker.number.int({ min: 5000, max: 20000 }),
          currentAmount: faker.number.int({ min: 100, max: 2000 }),
          priority: faker.helpers.arrayElement(['Low', 'Medium', 'High'])
        });
      }
      console.log(`👤 Seeded user ${i + 1}/${CONFIG.USERS_COUNT}: ${user.name}`);
    }

    console.log('\n✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();

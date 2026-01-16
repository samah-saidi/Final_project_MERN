// server/scripts/importCSV.js

const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

async function importTransactionsFromCSV() {
  const transactions = [];
  
  fs.createReadStream('./data/transactions.csv')
    .pipe(csv())
    .on('data', (row) => {
      transactions.push({
        user: row.userId,
        account: row.accountId,
        category: row.categoryId,
        amount: parseFloat(row.amount),
        type: row.type,
        description: row.description,
        date: new Date(row.date)
      });
    })
    .on('end', async () => {
      await Transaction.insertMany(transactions);
      console.log(`✅ ${transactions.length} transactions importées`);
      process.exit(0);
    });
}

importTransactionsFromCSV();
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();
const Transaction = require('./models/Transaction');
const Category = require('./models/Category');

async function exportToCSV() {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartwallet';
        await mongoose.connect(uri);
        console.log('✅ Connected for export');

        const transactions = await Transaction.find().populate('category').lean();

        if (transactions.length === 0) {
            console.log('No transactions found to export.');
            process.exit(0);
        }

        const header = 'Date,Description,Category,Amount,Type\n';
        const rows = transactions.map(t => {
            const date = t.date ? new Date(t.date).toISOString().split('T')[0] : '';
            const desc = (t.description || '').replace(/,/g, ' '); // Avoid CSV break
            const cat = t.category ? t.category.name : 'Uncategorized';
            const amount = t.amount || 0;
            const type = t.type || 'Expense';

            return `${date},${desc},${cat},${amount},${type}`;
        }).join('\n');

        const csvContent = header + rows;
        fs.writeFileSync('SmartWallet_Export.csv', csvContent);

        console.log(`✅ Success! Exported ${transactions.length} transactions to SmartWallet_Export.csv`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Export error:', err);
        process.exit(1);
    }
}

exportToCSV();

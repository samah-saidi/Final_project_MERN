const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const Transaction = require('./models/Transaction');
const Category = require('./models/Category');

const TARGET_USER = '696578e711e1f34687aa0511'; // Leif Powlowski
const TARGET_ACCOUNT = '696578e711e1f34687aa0520'; // Checking Account

async function importData() {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartwallet';
        await mongoose.connect(uri);
        console.log('✅ Connected for import');

        // Fetch user categories for mapping
        const userCats = await Category.find({ user: TARGET_USER });
        const catMap = {};
        userCats.forEach(c => {
            catMap[c.name.toLowerCase()] = c._id;
        });

        // Manual mapping for CSV specific names
        const specificMapping = {
            'food & drink': catMap['alimentation'],
            'rent': catMap['logement'],
            'utilities': catMap['logement'], // Use Logement for utilities if specific one doesn't exist
            'investments': catMap['freelance'],
            'salary': catMap['salaire'],
            'entertainment': catMap['loisirs'],
            'health & fitness': catMap['santé'],
            'shopping': catMap['shopping'],
            'travel': catMap['transport'],
            'other': catMap['alimentation'] // Fallback
        };

        const transactions = [];

        fs.createReadStream('Personal_Finance_Dataset.csv')
            .pipe(csv())
            .on('data', (row) => {
                const csvCat = row.Category.toLowerCase();
                const categoryId = specificMapping[csvCat] || catMap[csvCat] || userCats[0]._id;

                transactions.push({
                    user: TARGET_USER,
                    account: TARGET_ACCOUNT,
                    category: categoryId,
                    amount: parseFloat(row.Amount),
                    type: row.Type === 'expense' ? 'Expense' : 'Income',
                    description: row['Transaction Description'],
                    date: new Date(row.Date),
                    tags: {
                        isImportant: Math.random() < 0.1
                    }
                });
            })
            .on('end', async () => {
                console.log(`Inserting ${transactions.length} transactions...`);
                // Insert in batches of 500
                for (let i = 0; i < transactions.length; i += 500) {
                    const batch = transactions.slice(i, i + 500);
                    await Transaction.insertMany(batch);
                    console.log(`... batch ${i / 500 + 1} done`);
                }
                console.log('✅ Dataset imported successfully!');
                process.exit(0);
            });

    } catch (err) {
        console.error('❌ Import error:', err);
        process.exit(1);
    }
}

importData();

const express = require('express');
const router = express.Router();
const {
    getTransactionsByUser,
    createTransaction,
    updateTransaction,
    deleteTransaction
} = require('../controllers/transactionController');
const auth = require('../middleware/authMiddleware');

router.route('/')
    .post(auth, createTransaction);

router.route('/user/:userId')
    .get(auth, getTransactionsByUser);

router.route('/:id')
    .put(auth, updateTransaction)
    .delete(auth, deleteTransaction);

module.exports = router;

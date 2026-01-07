const express = require('express');
const router = express.Router();
const {
    getAccounts,
    createAccount,
    updateAccount,
    deleteAccount
} = require('../controllers/accountController');
const auth = require('../middleware/authMiddleware');

// @route   GET api/accounts
// @route   POST api/accounts
router.route('/')
    .get(auth, getAccounts)
    .post(auth, createAccount);

// @route   PUT api/accounts/:id
// @route   DELETE api/accounts/:id
router.route('/:id')
    .put(auth, updateAccount)
    .delete(auth, deleteAccount);

module.exports = router;

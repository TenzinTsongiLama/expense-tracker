const router = require('express').Router();
const {
  getExpenses,
  getSummary,
  createExpense,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');

router.get('/summary', getSummary);
router.get('/',        getExpenses);
router.post('/',       createExpense);
router.put('/:id',    updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
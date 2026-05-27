const router = require('express').Router();
const {
  getExpenses,
  getSummary,
  getMonthlyTrend,
  createExpense,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');

router.get('/summary', getSummary);
router.get('/monthly-trend', getMonthlyTrend);
router.get('/', getExpenses);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  amount:   { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['Food', 'Travel', 'Bills', 'Entertainment', 'Health', 'Shopping', 'Other'], 
    default: 'Other' 
  },
  date:  { type: Date, default: Date.now },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
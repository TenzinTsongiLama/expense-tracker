import { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { Trash2, Pencil, Plus, Search, X } from 'lucide-react';
import AddExpenseModal from '../components/AddExpenseModal';

const CATEGORIES = ['All', 'Food', 'Travel', 'Bills', 'Entertainment', 'Health', 'Shopping', 'Other'];

export default function Expenses() {
  const [filter, setFilter] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { expenses, loading, addExpense, updateExpense, deleteExpense } = useExpenses(filter);

  const handleCategoryFilter = (cat) => {
    setFilter(prev => ({
      ...prev,
      category: cat === 'All' ? undefined : cat
    }));
  };

  const handleDateFilter = () => {
    setFilter(prev => ({ ...prev, startDate, endDate }));
  };

  const handleClearFilters = () => {
    setFilter({});
    setSearch('');
    setStartDate('');
    setEndDate('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense?')) await deleteExpense(id);
  };

  const handleEdit = (expense) => {
    setEditExpense(expense);
    setShowModal(true);
  };

  const handleSubmit = async (data) => {
    if (editExpense) {
      await updateExpense(editExpense._id, data);
    } else {
      await addExpense(data);
    }
    setShowModal(false);
    setEditExpense(null);
  };

  const filteredExpenses = expenses.filter(exp =>
    exp.title.toLowerCase().includes(search.toLowerCase())
  );

  const hasActiveFilters = search || startDate || endDate || filter.category;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">All Expenses</h1>
        <button
          onClick={() => { setEditExpense(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={18} /> Add Expense
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search expenses by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <p className="text-sm font-medium text-gray-600 mb-3">📅 Filter by Date Range</p>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <input
              type="date" value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <input
              type="date" value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={handleDateFilter}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
          >
            Apply
          </button>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 px-3 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition"
            >
              <X size={14} /> Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryFilter(cat)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition
              ${(filter.category === cat || (!filter.category && cat === 'All'))
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-indigo-600">{filteredExpenses.length}</span> expense{filteredExpenses.length !== 1 ? 's' : ''}
          {hasActiveFilters && ' (filtered)'}
        </p>
      )}

      {/* Expenses Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <p className="text-gray-400 text-lg">No expenses found.</p>
          {hasActiveFilters && (
            <button onClick={handleClearFilters} className="mt-3 text-indigo-600 hover:underline text-sm">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Title</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Category</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Amount</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredExpenses.map(exp => (
                <tr key={exp._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{exp.title}</p>
                    {exp.notes && <p className="text-sm text-gray-400">{exp.notes}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                      {exp.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(exp.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-indigo-600">
                    £{exp.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(exp)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(exp._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <AddExpenseModal
          onClose={() => { setShowModal(false); setEditExpense(null); }}
          onSubmit={handleSubmit}
          initial={editExpense}
        />
      )}
    </div>
  );
}
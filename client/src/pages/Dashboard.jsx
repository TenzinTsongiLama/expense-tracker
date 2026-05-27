import { useExpenses } from '../hooks/useExpenses';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, ShoppingBag } from 'lucide-react';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
  const { expenses, summary, monthlyTrend, loading } = useExpenses();

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  const chartData = summary.byCategory.map(item => ({
    name: item._id,
    value: item.total,
    count: item.count
  }));

  const recentExpenses = expenses.slice(0, 5);

  // Analytics calculations
  const avgExpense = expenses.length > 0 ? summary.totalAmount / expenses.length : 0;
  const biggestExpense = expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 0;
  const biggestCategory = summary.byCategory.length > 0 ? summary.byCategory[0]._id : 'N/A';

  const currentMonth = new Date().getMonth();
  const currentMonthExpenses = expenses.filter(e => new Date(e.date).getMonth() === currentMonth);
  const currentMonthTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthExpenses = expenses.filter(e => new Date(e.date).getMonth() === lastMonth);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const monthlyChange = lastMonthTotal > 0
    ? (((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1)
    : null;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Expenses</p>
            
          </div>
          <p className="text-3xl font-bold text-indigo-600">£{summary.totalAmount.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">This Month</p>
            {monthlyChange !== null && (
              monthlyChange > 0
                ? <TrendingUp size={18} className="text-red-400" />
                : <TrendingDown size={18} className="text-green-400" />
            )}
          </div>
          <p className="text-3xl font-bold text-indigo-600">£{currentMonthTotal.toFixed(2)}</p>
          {monthlyChange !== null && (
            <p className={`text-xs mt-1 ${monthlyChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {monthlyChange > 0 ? '▲' : '▼'} {Math.abs(monthlyChange)}% vs last month
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Avg per Expense</p>
            <ShoppingBag size={18} className="text-indigo-400" />
          </div>
          <p className="text-3xl font-bold text-indigo-600">£{avgExpense.toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">{expenses.length} total transactions</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Biggest Expense</p>
            <TrendingUp size={18} className="text-red-400" />
          </div>
          <p className="text-3xl font-bold text-indigo-600">£{biggestExpense.toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">Top category: {biggestCategory}</p>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      {monthlyTrend.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">📈 Monthly Spending Trend</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `£${v}`} />
              <Tooltip formatter={(value) => [`£${value.toFixed(2)}`, 'Total Spent']} />
              <Legend />
              <Line
                type="monotone" dataKey="total" stroke="#6366f1"
                strokeWidth={3} dot={{ fill: '#6366f1', r: 5 }}
                activeDot={{ r: 8 }} name="Monthly Spending"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Pie + Bar Charts */}
      {chartData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">🍕 Spending by Category</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `£${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">📊 Amount by Category</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `£${v}`} />
                <Tooltip formatter={(value) => `£${value.toFixed(2)}`} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
          <p className="text-gray-400 text-lg">No expenses yet. Add some to see charts!</p>
        </div>
      )}

      {/* Insights */}
      {expenses.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">💡 Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 rounded-lg p-4">
              <p className="text-sm text-indigo-600 font-medium">Most spent on</p>
              <p className="text-xl font-bold text-indigo-800 mt-1">{biggestCategory}</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-amber-600 font-medium">Average transaction</p>
              <p className="text-xl font-bold text-amber-800 mt-1">£{avgExpense.toFixed(2)}</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <p className="text-sm text-emerald-600 font-medium">This month's spending</p>
              <p className="text-xl font-bold text-emerald-800 mt-1">£{currentMonthTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Expenses */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">🕐 Recent Expenses</h2>
        {recentExpenses.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No expenses found.</p>
        ) : (
          <div className="space-y-3">
            {recentExpenses.map(exp => (
              <div key={exp._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{exp.title}</p>
                  <p className="text-sm text-gray-500">{exp.category} • {new Date(exp.date).toLocaleDateString()}</p>
                </div>
                <p className="font-bold text-indigo-600">£{exp.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
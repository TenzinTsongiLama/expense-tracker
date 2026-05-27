import { useExpenses } from '../hooks/useExpenses';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
  const { expenses, summary, loading } = useExpenses();

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

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500">Total Expenses</p>
          <p className="text-3xl font-bold text-indigo-600">
            £{summary.totalAmount.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="text-3xl font-bold text-indigo-600">{expenses.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500">Categories Used</p>
          <p className="text-3xl font-bold text-indigo-600">{summary.byCategory.length}</p>
        </div>
      </div>

      {/* Charts */}
      {chartData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Spending by Category</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `£${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Amount by Category</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
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

      {/* Recent Expenses */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Expenses</h2>
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
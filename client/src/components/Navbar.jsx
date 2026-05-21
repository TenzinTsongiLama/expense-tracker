import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, List } from 'lucide-react';

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-bold text-indigo-600">💰 ExpenseTracker</h1>
          <div className="flex gap-4">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
                ${pathname === '/' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link
              to="/expenses"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
                ${pathname === '/expenses' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <List size={16} /> Expenses
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
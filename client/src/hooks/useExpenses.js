import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export function useExpenses(filters = {}) {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ byCategory: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [expRes, sumRes] = await Promise.all([
        axios.get(`${API}/expenses`, { params: filters }),
        axios.get(`${API}/expenses/summary`)
      ]);
      setExpenses(expRes.data);
      setSummary(sumRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [JSON.stringify(filters)]);

  const addExpense = async (data) => {
    await axios.post(`${API}/expenses`, data);
    fetchAll();
  };

  const updateExpense = async (id, data) => {
    await axios.put(`${API}/expenses/${id}`, data);
    fetchAll();
  };

  const deleteExpense = async (id) => {
    await axios.delete(`${API}/expenses/${id}`);
    fetchAll();
  };

  return { expenses, summary, loading, error, addExpense, updateExpense, deleteExpense };
}
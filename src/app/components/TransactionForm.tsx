'use client';
import { useState } from 'react';

type Props = { onAdd: () => void; };

export default function TransactionForm({ onAdd }: Props) {
  const [form, setForm] = useState({
    amount: '', type: 'income', category: '', note: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/transactions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ amount: '', type: 'income', category: '', note: '' });
    onAdd();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-4"
    >
      <h3 className="text-xl font-semibold text-gray-700">Add Transaction</h3>

      <input
        type="number"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        placeholder="Amount"
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        required
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <input
        type="text"
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category"
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        required
      />

      <input
        type="text"
        name="note"
        value={form.note}
        onChange={handleChange}
        placeholder="Optional note"
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
        Add Transaction
      </button>
    </form>
  );
}

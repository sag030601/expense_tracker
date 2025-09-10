"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Modal } from "./components/Modal";

type Transaction = {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  note?: string | null;
  createdAt: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      fetchTransactions();
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setIsEditing(true);
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setIsEditing(false);
    setSelectedTransaction(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsEditing(false);
    setSelectedTransaction(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight drop-shadow-sm">
          Transactions
        </h2>

        {/* Add Transaction Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 text-white font-semibold rounded-lg shadow-lg transition duration-300"
            aria-label="Add Transaction"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Transaction
          </button>
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          transaction={selectedTransaction}
          onAdd={fetchTransactions}
          onEdit={fetchTransactions}
        />

        {/* Transactions Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg ring-1 ring-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-100">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-semibold text-indigo-900 uppercase tracking-wide"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-semibold text-indigo-900 uppercase tracking-wide"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-semibold text-indigo-900 uppercase tracking-wide"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-semibold text-indigo-900 uppercase tracking-wide"
                >
                  Note
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-semibold text-indigo-900 uppercase tracking-wide"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-sm font-semibold text-indigo-900 uppercase tracking-wide"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-indigo-50 transition-colors duration-200 cursor-pointer"
                  tabIndex={0}
                  aria-label={`Transaction: ${tx.category}, amount ${tx.amount}, type ${tx.type}`}
                >
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    {tx.category}
                  </td>
                  <td
                    className={`px-6 py-4 font-semibold ${
                      tx.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.amount.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </td>
                  <td className="px-6 py-4 capitalize text-gray-700 font-medium">
                    {tx.type}
                  </td>
                  <td className="px-6 py-4 text-gray-600 italic">
                    {tx.note ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(tx)}
                      className="px-3 py-1 rounded-md bg-yellow-400 hover:bg-yellow-500 text-white font-semibold shadow-md transition duration-200"
                      aria-label={`Edit transaction ${tx.category}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md transition duration-200"
                      aria-label={`Delete transaction ${tx.category}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {transactions.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-gray-400 italic"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

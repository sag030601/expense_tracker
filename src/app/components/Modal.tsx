// components/Modal.tsx
import { useState, useEffect } from "react";

type Transaction = {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  note?: string | null;
  createdAt: string;
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onAdd: () => void;
  onEdit: () => void;
};

export const Modal = ({ isOpen, onClose, transaction, onAdd, onEdit }: ModalProps) => {
  const [formData, setFormData] = useState({
    amount: "",
    type: "income",
    category: "",
    note: "",
  });

  // Populate form for editing existing transaction
  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount.toString(),
        type: transaction.type,
        category: transaction.category,
        note: transaction.note ?? "",
      });
    } else {
      setFormData({
        amount: "",
        type: "income",
        category: "",
        note: "",
      });
    }
  }, [transaction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = transaction ? "PUT" : "POST";
    const url = transaction ? `/api/transactions/${transaction.id}` : "/api/transactions";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    onAdd(); // After adding or editing, fetch new data
    onClose(); // Close modal after action
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl max-w-lg w-full">
          <h2 className="text-2xl font-semibold mb-4">{transaction ? "Edit" : "Add"} Transaction</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="amount" className="block text-gray-700">Amount</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="block text-gray-700">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="type" className="block text-gray-700">Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="note" className="block text-gray-700">Note</label>
              <input
                type="text"
                id="note"
                name="note"
                value={formData.note}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {transaction ? "Save Changes" : "Add Transaction"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

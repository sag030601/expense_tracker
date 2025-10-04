'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import TransactionList from "../components/TransactionList";
import { Modal } from "../components/Modal";
// import Navbar from "./components/Navbar";
// import TransactionList from "./components/TransactionList";
// import { Modal } from "./components/Modal";


// Modal

type Transaction = {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  note?: string | null;
  createdAt: string;
};

export default function TransactionsPage() {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const userId = session?.user?.id; // <-- Ensure `id` is part of the session

  const fetchTransactions = async () => {
    if (!userId) return;

    const res = await fetch(`/api/transactions?userId=${userId}`);
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    if (session) fetchTransactions();
  }, [session]);

  const handleDelete = async (id: string) => {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    fetchTransactions();
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  return (
    <div>
      <Navbar transactions={transactions} />
      {/* Add + Modal logic here */}
      <TransactionList transactions={transactions} onDelete={handleDelete} />
    </div>
  );
}

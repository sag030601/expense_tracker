"use client";

import { useEffect, useState } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import dynamic from "next/dynamic";

const ChatAssistant = dynamic(() => import("../components/ChatAssistant"), {
  ssr: false,
});

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type Transaction = {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  note?: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [aiInsight, setAiInsight] = useState<string>("");

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then(setTransactions);
  }, []);

  // === Basic stats ===
  const income = Math.round(
    transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const expense = Math.round(
    transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const balance = income - expense;

  // Average monthly saving rate (income - expense) / income * 100
  const monthsCount = (() => {
    if (transactions.length === 0) return 1;
    const firstDate = new Date(
      transactions.reduce(
        (min, t) => (new Date(t.createdAt) < new Date(min) ? t.createdAt : min),
        transactions[0].createdAt
      )
    );
    const lastDate = new Date(
      transactions.reduce(
        (max, t) => (new Date(t.createdAt) > new Date(max) ? t.createdAt : max),
        transactions[0].createdAt
      )
    );
    return Math.max(
      1,
      (lastDate.getFullYear() - firstDate.getFullYear()) * 12 +
        (lastDate.getMonth() - firstDate.getMonth()) +
        1
    );
  })();

  const savingRate =
    income > 0 ? (((income - expense) / income) * 100).toFixed(1) : "N/A";
  const avgExpense = (expense / monthsCount).toFixed(2);
  const avgIncome = (income / monthsCount).toFixed(2);

  // === Transactions grouped by date for line chart ===
  const dateMap: Record<string, { income: number; expense: number }> = {};

  transactions.forEach((t) => {
    const date = new Date(t.createdAt).toLocaleDateString();
    if (!dateMap[date]) dateMap[date] = { income: 0, expense: 0 };
    dateMap[date][t.type] += t.amount;
  });

  const sortedDates = Object.keys(dateMap).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const lineChartData = {
    labels: sortedDates,
    datasets: [
      {
        label: "Income",
        data: sortedDates.map((d) => dateMap[d].income),
        borderColor: "rgb(34,197,94)",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.3,
      },
      {
        label: "Expense",
        data: sortedDates.map((d) => dateMap[d].expense),
        borderColor: "rgb(239,68,68)",
        backgroundColor: "rgba(239,68,68,0.2)",
        tension: 0.3,
      },
    ],
  };

  // === Pie chart: expense by category ===
  const expenseByCategory: Record<string, number> = {};

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      expenseByCategory[t.category] =
        (expenseByCategory[t.category] || 0) + t.amount;
    });

  const pieData = {
    labels: Object.keys(expenseByCategory),
    datasets: [
      {
        data: Object.values(expenseByCategory),
        backgroundColor: [
          "#ef4444",
          "#f97316",
          "#eab308",
          "#22c55e",
          "#3b82f6",
          "#8b5cf6",
          "#ec4899",
          "#64748b",
        ],
      },
    ],
  };

  // === Bar chart: monthly income & expense ===
  const monthMap: Record<string, { income: number; expense: number }> = {};

  transactions.forEach((t) => {
    const d = new Date(t.createdAt);
    const month = `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    if (!monthMap[month]) monthMap[month] = { income: 0, expense: 0 };
    monthMap[month][t.type] += t.amount;
  });

  const months = Object.keys(monthMap).sort();

  const barData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: months.map((m) => monthMap[m].income),
        backgroundColor: "rgba(34,197,94,0.6)",
      },
      {
        label: "Expense",
        data: months.map((m) => monthMap[m].expense),
        backgroundColor: "rgba(239,68,68,0.6)",
      },
    ],
  };

  // === AI Insight update ===
  useEffect(() => {
    if (transactions.length === 0) {
      setAiInsight("No transactions yet. Start adding some!");
      return;
    }

    const topExpense = transactions
      .filter((t) => t.type === "expense")
      .sort((a, b) => b.amount - a.amount)[0];

    const frequentCategory = transactions.reduce<Record<string, number>>(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
      },
      {}
    );

    const mostFreq = Object.entries(frequentCategory).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];

    const alertMessage =
      expense > income
        ? "⚠️ You are spending more than you earn. Consider budgeting."
        : "";

    setAiInsight(
      `💡 Biggest expense: ₹${topExpense?.amount} on ${topExpense?.category}. ` +
        `Frequently spent on: "${mostFreq}". ` +
        `Avg monthly income: ₹${avgIncome}, expenses: ₹${avgExpense}. ` +
        `Saving rate: ${savingRate}%. ${alertMessage}`
    );
  }, [transactions, expense, income, avgExpense, avgIncome, savingRate]);

  return (
    <div className="bg-gray-50 min-h-screen p-6  mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card title="Income" amount={`₹${income}`} color="green" />
        <Card title="Expenses" amount={`₹${expense}`} color="red" />
        <Card title="Balance" amount={`₹${balance}`} color="blue" />
        {/* <Card title="Saving Rate" amount={`${savingRate}%`} color="yellow" /> */}
      </div>

      {/* AI Insight */}
      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <p className="text-gray-700 font-medium mb-2">AI Insight</p>
        <p className="text-gray-600 text-lg">{aiInsight}</p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Income vs Expense Over Time
          </h2>
          <Line data={lineChartData} />
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Expenses by Category</h2>
          <Pie data={pieData} />
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Monthly Income & Expenses
          </h2>
          <Bar data={barData} />
        </section>
      </div>

      {/* Recent Transactions */}
      <h2 className="text-3xl font-semibold text-gray-700 mb-6">
        Recent Transactions
      </h2>
      <ul className="space-y-3 max-h-96 overflow-y-auto">
        {transactions
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((tx) => (
            <li
              key={tx.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center border border-gray-200 hover:shadow-lg transition"
            >
              <div>
                <p className="font-medium text-gray-700">{tx.category}</p>
                {tx.note && <p className="text-gray-500 text-sm">{tx.note}</p>}
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(tx.createdAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`font-semibold text-lg ${
                  tx.type === "income" ? "text-green-600" : "text-red-600"
                }`}
              >
                {tx.type === "income" ? "+" : "-"} ₹{tx.amount}
              </span>
            </li>
          ))}
      </ul>

      {/* Floating AI assistant */}
      <ChatAssistant context={transactions} title="Budget Buddy" />
    </div>
  );
}

function Card({
  title,
  amount,
  color,
}: {
  title: string;
  amount: string;
  color: "green" | "red" | "blue" | "yellow";
}) {
  const colorMap = {
    green: "text-green-600 bg-green-100",
    red: "text-red-600 bg-red-100",
    blue: "text-blue-600 bg-blue-100",
    yellow: "text-yellow-600 bg-yellow-100",
  };

  return (
    <div
      className={`rounded-xl shadow p-5 flex flex-col items-center justify-center ${colorMap[color]}`}
    >
      <p className="text-gray-700 font-medium">{title}</p>
      <p className="font-extrabold text-3xl mt-2">{amount}</p>
    </div>
  );
}

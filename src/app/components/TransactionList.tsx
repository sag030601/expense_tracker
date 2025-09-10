'use client';

type Transaction = {
  id: string;
  amount: number;
  type: string;
  category: string;
  note?: string | null;
  createdAt: string;
};

type Props = { transactions: Transaction[]; onDelete: (id: string) => void; };

export default function TransactionList({ transactions, onDelete }: Props) {
  return (
    <ul className="space-y-4">
      {transactions.map(tx => (
        <li
          key={tx.id}
          className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold text-gray-700">{tx.category} <span className="text-sm text-gray-500">({tx.type.toUpperCase()})</span></p>
            <p className="text-gray-600">₹{tx.amount} {tx.note && <>– <em>{tx.note}</em></>}</p>
            <p className="text-gray-400 text-xs">{new Date(tx.createdAt).toLocaleString()}</p>
          </div>
          <button
            onClick={() => onDelete(tx.id)}
            className="text-red-500 font-semibold hover:text-red-700 transition"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

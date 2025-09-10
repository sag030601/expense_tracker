type Transaction = { amount: number; type: string; };

type Props = { transactions: Transaction[]; };

export default function BudgetProgress({ transactions }: Props) {
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 my-6 flex justify-around">
      <div className="text-center">
        <p className="text-gray-500 font-medium">Income</p>
        <p className="text-green-600 font-bold text-lg">₹{income}</p>
      </div>
      <div className="text-center">
        <p className="text-gray-500 font-medium">Expenses</p>
        <p className="text-red-600 font-bold text-lg">₹{expense}</p>
      </div>
      <div className="text-center">
        <p className="text-gray-500 font-medium">Balance</p>
        <p className="text-blue-600 font-bold text-lg">₹{income - expense}</p>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">💰 Budget Tracker</h1>
      <div className="space-x-4">
        <Link
          href="/dashboard"
          className="hover:bg-blue-500 px-3 py-1 rounded transition"
        >
          Home
        </Link>
        <Link
          href="/transactions"
          className="hover:bg-blue-500 px-3 py-1 rounded transition"
        >
          Transactions
        </Link>
      </div>
    </nav>
  );
}

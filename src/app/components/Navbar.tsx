// src/app/components/Navbar.tsx
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-3xl font-bold text-white tracking-wide">💰 Budget Tracker</h1>

      <div className="flex items-center space-x-6">
        <div className="hidden md:flex space-x-6">
          <Link
            href="/dashboard"
            className="hover:bg-blue-500 px-3 py-1 rounded-lg transition-colors duration-200"
          >
            Dashboard
          </Link>
          <Link
            href="/transactions"
            className="hover:bg-blue-500 px-3 py-1 rounded-lg transition-colors duration-200"
          >
            Transactions
          </Link>
        </div>

        {/* Conditionally render login/logout button */}
        {!session ? (
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-200"
          >
            Sign In
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold">{`Hello, ${session.user?.name}`}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-200"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

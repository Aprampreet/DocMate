// src/pages/NotFound.jsx

import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600">404</h1>
        <p className="text-2xl mt-4 text-slate-700 font-semibold">Page Not Found</p>
        <p className="mt-2 text-slate-500">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

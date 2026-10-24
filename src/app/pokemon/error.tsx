"use client";

import { IoWarning } from "react-icons/io5";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="p-8">
      <div className="max-w-xl mx-auto bg-white text-gray-700 rounded-xl shadow-lg p-8 text-center">
        <IoWarning size={60} className="inline-block text-purple-700" />
        <h2 className="text-2xl font-bold mt-4">¡Ups! Algo salió mal</h2>
        <p className="text-gray-500 mt-2">{error.message}</p>
        <button
          onClick={() => reset()}
          className="mt-6 bg-purple-700 text-white font-bold px-6 py-2 rounded-lg hover:bg-purple-900 transition"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}

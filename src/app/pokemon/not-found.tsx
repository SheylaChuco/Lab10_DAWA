import Link from "next/link";
import { IoSearch } from "react-icons/io5";

export default function NotFound() {
  return (
    <div className="p-8">
      <div className="max-w-xl mx-auto bg-white text-gray-700 rounded-xl shadow-lg p-8 text-center">
        <IoSearch size={60} className="inline-block text-purple-700" />
        <h2 className="text-2xl font-bold mt-4">Pokémon no encontrado</h2>
        <p className="text-gray-500 mt-2">
          No pudimos encontrar lo que buscabas en la Pokédex.
        </p>
        <Link
          href="/pokemon"
          className="inline-block mt-6 bg-purple-700 text-white font-bold px-6 py-2 rounded-lg hover:bg-purple-900 transition"
        >
          Volver a la lista
        </Link>
      </div>
    </div>
  );
}

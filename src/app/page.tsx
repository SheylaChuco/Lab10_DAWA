import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-linear-to-br from-slate-950 via-slate-900 to-purple-950 px-4 py-16 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold md:text-5xl">Next.js · SSG e ISR</h1>
        <p className="mt-3 text-slate-300">Laboratorio 10 – Enrutamiento y Páginas</p>
      </div>

      <div className="grid w-full max-w-3xl gap-6 md:grid-cols-2">
        <Link
          href="/pokemon"
          className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-xl backdrop-blur transition hover:-translate-y-1 hover:border-purple-400"
        >
          <p className="text-5xl">⚡</p>
          <h2 className="mt-4 text-2xl font-bold">Pokédex</h2>
          <p className="mt-1 text-slate-400">Ejercicio 1 · PokeAPI</p>
        </Link>
        <Link
          href="/rickandmorty"
          className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-xl backdrop-blur transition hover:-translate-y-1 hover:border-lime-400"
        >
          <p className="text-5xl">🛸</p>
          <h2 className="mt-4 text-2xl font-bold">Rick and Morty</h2>
          <p className="mt-1 text-slate-400">Tarea · Rick and Morty API</p>
        </Link>
      </div>
    </main>
  );
}

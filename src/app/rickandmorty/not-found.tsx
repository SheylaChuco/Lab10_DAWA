import Link from "next/link";

export default function NotFound() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-xl rounded-3xl border border-cyan-400/40 bg-white/5 p-10 text-center shadow-[0_0_40px_rgba(34,211,238,0.25)] backdrop-blur-xl">
        <p className="animate-bounce text-7xl">🛸</p>
        <h2 className="mt-4 font-[family-name:var(--font-orbitron)] text-2xl font-black text-white">
          PERSONAJE NO ENCONTRADO
        </h2>
        <p className="mt-2 text-slate-400">
          Este personaje no existe en esta dimensión.
        </p>
        <Link
          href="/rickandmorty"
          className="mt-6 inline-block rounded-full bg-linear-to-r from-cyan-400 to-sky-500 px-7 py-3 font-[family-name:var(--font-orbitron)] text-sm font-black uppercase tracking-wider text-slate-900 shadow-[0_0_22px_rgba(34,211,238,0.5)] transition hover:scale-105"
        >
          Volver a la lista
        </Link>
      </div>
    </div>
  );
}
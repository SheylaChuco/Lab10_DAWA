"use client";

import { IoWarning } from "react-icons/io5";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-xl rounded-3xl border border-rose-500/40 bg-white/5 p-10 text-center shadow-[0_0_40px_rgba(244,63,94,0.25)] backdrop-blur-xl">
        <IoWarning size={70} className="inline-block text-rose-400" />
        <h2 className="mt-4 font-[family-name:var(--font-orbitron)] text-2xl font-black text-white">
          ¡UPS! ALGO SALIÓ MAL
        </h2>
        <p className="mt-2 text-slate-400">{error.message}</p>
        <button
          onClick={() => reset()}
          className="mt-6 rounded-full bg-linear-to-r from-cyan-400 to-sky-500 px-7 py-3 font-[family-name:var(--font-orbitron)] text-sm font-black uppercase tracking-wider text-slate-900 shadow-[0_0_22px_rgba(34,211,238,0.5)] transition hover:scale-105"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
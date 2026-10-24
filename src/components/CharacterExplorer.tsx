"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoSearch, IoClose } from "react-icons/io5";
import { CharacterResponse } from "@/types/character";
import StatusBadge from "./StatusBadge";

const API = "https://rickandmortyapi.com/api/character";

interface Filters {
  name: string;
  status: string;
  type: string;
  gender: string;
}

const emptyFilters: Filters = { name: "", status: "", type: "", gender: "" };

const inputClass =
  "w-full rounded-xl border border-cyan-400/30 bg-[#0a1128] px-4 py-3 font-semibold text-white placeholder-slate-500 outline-none transition focus:border-cyan-300 focus:shadow-[0_0_18px_rgba(34,211,238,0.45)]";

const navButton =
  "rounded-full bg-linear-to-r from-cyan-400 to-sky-500 px-6 py-2.5 font-[family-name:var(--font-orbitron)] text-sm font-black uppercase tracking-wider text-slate-900 shadow-[0_0_22px_rgba(34,211,238,0.5)] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none disabled:hover:scale-100";

export default function CharacterExplorer({
  initialData,
}: {
  initialData: CharacterResponse;
}) {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<CharacterResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasFilters = Object.values(filters).some((v) => v.trim() !== "");
  // Sin filtros y en la página 1 se usa la lista que llegó del servidor
  const showInitial = !hasFilters && page === 1;
  const current = showInitial ? initialData : data;

  useEffect(() => {
    if (showInitial) return;

    const controller = new AbortController();

    // debounce: espera a que el usuario termine de escribir
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: String(page) });
        (Object.keys(filters) as (keyof Filters)[]).forEach((key) => {
          if (filters[key].trim()) params.set(key, filters[key].trim());
        });

        const res = await fetch(`${API}?${params.toString()}`, {
          signal: controller.signal,
        });

        // La API responde 404 cuando no hay coincidencias
        if (res.status === 404) {
          setData(null);
          return;
        }
        if (!res.ok) throw new Error("Error en la búsqueda");
        setData(await res.json());
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setError("Ocurrió un error al buscar personajes");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters, page, showInitial]);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(emptyFilters);
    setPage(1);
  };

  const totalPages = current?.info.pages ?? 1;

  return (
    <section>
      {/* Filtros */}
      <div className="rounded-3xl border border-cyan-400/30 bg-white/5 p-6 shadow-[0_0_40px_rgba(34,211,238,0.12)] backdrop-blur-xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <IoSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300" />
            <input
              type="text"
              value={filters.name}
              onChange={(e) => updateFilter("name", e.target.value)}
              placeholder="Nombre (ej. rick)"
              className={`${inputClass} pl-11`}
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className={inputClass}
          >
            <option value="">Estado: todos</option>
            <option value="alive">Vivo</option>
            <option value="dead">Muerto</option>
            <option value="unknown">Desconocido</option>
          </select>

          <input
            type="text"
            value={filters.type}
            onChange={(e) => updateFilter("type", e.target.value)}
            placeholder="Tipo (ej. parasite)"
            className={inputClass}
          />

          <select
            value={filters.gender}
            onChange={(e) => updateFilter("gender", e.target.value)}
            className={inputClass}
          >
            <option value="">Género: todos</option>
            <option value="female">Femenino</option>
            <option value="male">Masculino</option>
            <option value="genderless">Sin género</option>
            <option value="unknown">Desconocido</option>
          </select>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1.5 text-sm font-bold text-cyan-200">
            {current ? current.info.count : 0} personajes encontrados
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 rounded-full bg-yellow-300 px-4 py-1.5 text-sm font-bold text-slate-900 shadow-[0_0_16px_rgba(253,224,71,0.5)] transition hover:bg-yellow-200"
            >
              <IoClose /> Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Resultados */}
      {error && <p className="mt-10 text-center text-rose-400">{error}</p>}

      {!error && !current && !loading && (
        <div className="mt-16 text-center">
          <p className="animate-bounce text-7xl">🛸</p>
          <p className="mt-4 font-[family-name:var(--font-orbitron)] text-2xl font-black text-white">
            SIN SEÑAL EN ESTA DIMENSIÓN
          </p>
          <p className="text-slate-400">No encontramos personajes con esos filtros.</p>
        </div>
      )}

      {current && (
        <div
          className={`mt-10 grid grid-cols-1 gap-7 transition-opacity sm:grid-cols-2 lg:grid-cols-4 ${
            loading ? "opacity-40" : "opacity-100"
          }`}
        >
          {current.results.map((character) => (
            <Link
              key={character.id}
              href={`/rickandmorty/${character.id}`}
              className="group rounded-3xl bg-linear-to-br from-cyan-400/70 via-indigo-500/20 to-yellow-300/70 p-0.5 transition duration-300 hover:-translate-y-2 hover:from-cyan-300 hover:via-sky-400 hover:to-yellow-300 hover:shadow-[0_0_35px_rgba(34,211,238,0.55)]"
            >
              <div className="relative overflow-hidden rounded-[22px] bg-[#0a1128]">
                <Image
                  width={300}
                  height={300}
                  src={character.image}
                  alt={character.name}
                  className="aspect-square w-full object-cover transition duration-500 group-hover:scale-110"
                  priority={false} // carga bajo demanda (lazy loading)
                />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-[#050816] via-[#050816]/75 to-transparent" />
                <div className="absolute left-3 top-3">
                  <StatusBadge status={character.status} />
                </div>
                <span className="absolute right-3 top-3 rounded-md bg-black/60 px-2 py-0.5 font-[family-name:var(--font-orbitron)] text-[11px] font-bold text-cyan-200">
                  ID-{character.id.toString().padStart(3, "0")}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h2 className="truncate font-[family-name:var(--font-orbitron)] text-base font-black tracking-wide text-white group-hover:text-cyan-200">
                    {character.name}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-cyan-400/20 px-3 py-0.5 text-xs font-bold text-cyan-100">
                      {character.species}
                    </span>
                    <span className="rounded-full bg-yellow-300/20 px-3 py-0.5 text-xs font-bold text-yellow-100">
                      {character.gender}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Paginación */}
      {current && totalPages > 1 && (
        <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className={navButton}
          >
            ← Anterior
          </button>
          <span className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-slate-300">
            Página <strong className="text-cyan-300">{page}</strong> de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
            className={navButton}
          >
            Siguiente →
          </button>
        </div>
      )}
    </section>
  );
}
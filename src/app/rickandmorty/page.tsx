import Image from "next/image";
import Link from "next/link";
import { getCharacters, getMultiverseStats } from "@/lib/rickandmorty";
import CharacterExplorer from "@/components/CharacterExplorer";
import StatusBadge from "@/components/StatusBadge";

// Server Component: todo se pide en el servidor con async/await.
// Se fuerza el caché (cache: "force-cache") porque estos datos casi no
// cambian, así se sirven rápido y no se le pide lo mismo a la API en cada
// visita (SSG).
export default async function RickAndMortyPage() {
  const [initialData, stats] = await Promise.all([
    getCharacters(1),
    getMultiverseStats(),
  ]);

  const total = initialData.info.count;
  const rick = stats.iconic[0];
  const pct = (n: number) => `${((n / total) * 100).toFixed(1)}%`;

  const cards = [
    { label: "Personajes", value: total, color: "text-cyan-300", border: "border-cyan-400/40" },
    { label: "Ubicaciones", value: stats.locations, color: "text-yellow-300", border: "border-yellow-300/40" },
    { label: "Episodios", value: stats.episodes, color: "text-indigo-300", border: "border-indigo-400/40" },
    { label: "Páginas", value: initialData.info.pages, color: "text-sky-300", border: "border-sky-400/40" },
  ];

  return (
    <main>
      {/* HERO */}
      <section className="relative isolate overflow-hidden px-4 pb-24 pt-16 text-center">
        {/* Portal */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 opacity-80">
          <div className="absolute inset-0 animate-[spin_14s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#22d3ee,#6366f1,#facc15,#0ea5e9,#22d3ee)] blur-3xl" />
          <div className="absolute inset-12 animate-[spin_9s_linear_infinite_reverse] rounded-full border-[14px] border-dashed border-cyan-300/40" />
          <div className="absolute inset-24 rounded-full border-4 border-cyan-200/70 shadow-[0_0_60px_#22d3ee,inset_0_0_60px_#22d3ee]" />
          <div className="absolute inset-28 rounded-full bg-[radial-gradient(circle,#0b1a3a_0%,#050816_75%)]" />
        </div>

        {/* Rick y Morty flotando */}
        {stats.iconic.slice(0, 2).map((c, i) => (
          <div
            key={c.id}
            className={`pointer-events-none absolute top-24 hidden h-44 w-44 animate-[bounce_4s_ease-in-out_infinite] overflow-hidden rounded-full border-4 shadow-[0_0_40px_rgba(34,211,238,0.7)] lg:block xl:h-48 xl:w-48 ${
              i === 0
                ? "left-[3%] border-cyan-300"
                : "right-[3%] border-yellow-300 [animation-delay:1.5s]"
            }`}
          >
            <Image
              src={c.image}
              alt={c.name}
              width={300}
              height={300}
              className="h-full w-full object-cover"
            />
          </div>
        ))}

        <p className="font-[family-name:var(--font-orbitron)] text-sm font-bold uppercase tracking-[0.5em] text-cyan-300">
          Dimensión C-137
        </p>
        <h1 className="mt-4 bg-linear-to-b from-white via-cyan-200 to-cyan-500 bg-clip-text font-[family-name:var(--font-orbitron)] text-5xl font-black leading-tight tracking-wider text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.7)] md:text-6xl">
          EXPLORADOR
          <br />
          DEL MULTIVERSO
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300">
          Busca entre {total} personajes de todas las dimensiones. Cruza el portal y
          descubre quién es quién.
        </p>
        <a
          href="#personajes"
          className="mt-8 inline-block rounded-full bg-linear-to-r from-cyan-400 to-sky-500 px-8 py-3 font-[family-name:var(--font-orbitron)] text-sm font-black uppercase tracking-widest text-slate-900 shadow-[0_0_30px_rgba(34,211,238,0.7)] transition hover:scale-105 hover:shadow-[0_0_45px_rgba(34,211,238,0.95)]"
        >
          Cruzar el portal ↓
        </a>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-4 pb-20">
        {/* ESTADÍSTICAS */}
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {cards.map((c) => (
            <div
              key={c.label}
              className={`rounded-2xl border bg-white/5 p-5 text-center backdrop-blur ${c.border}`}
            >
              <p className={`font-[family-name:var(--font-orbitron)] text-4xl font-black ${c.color}`}>
                {c.value}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                {c.label}
              </p>
            </div>
          ))}
        </section>

        {/* ESTADO DEL MULTIVERSO */}
        <section className="rounded-3xl border border-cyan-400/30 bg-white/5 p-6 backdrop-blur md:p-8">
          <h2 className="font-[family-name:var(--font-orbitron)] text-2xl font-black tracking-wider text-cyan-200">
            ESTADO DEL MULTIVERSO
          </h2>
          <div className="mt-6 flex h-6 overflow-hidden rounded-full bg-slate-800">
            <div className="bg-cyan-400" style={{ width: pct(stats.alive) }} />
            <div className="bg-rose-500" style={{ width: pct(stats.dead) }} />
            <div className="bg-yellow-300" style={{ width: pct(stats.unknown) }} />
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
              <p><strong className="text-xl text-cyan-300">{stats.alive}</strong> vivos</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e]" />
              <p><strong className="text-xl text-rose-400">{stats.dead}</strong> muertos</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded-full bg-yellow-300 shadow-[0_0_10px_#fde047]" />
              <p><strong className="text-xl text-yellow-300">{stats.unknown}</strong> desconocidos</p>
            </div>
          </div>
          {rick && (
            <p className="mt-6 rounded-xl border border-yellow-300/30 bg-yellow-300/10 px-4 py-3 text-sm text-yellow-100">
              💡 <strong>Dato curioso:</strong> {rick.name} aparece en{" "}
              <strong>{rick.episode.length}</strong> episodios, y es uno de los
              personajes más vistos de toda la serie.
            </p>
          )}
        </section>

        {/* PERSONAJES ICÓNICOS */}
        <section>
          <h2 className="font-[family-name:var(--font-orbitron)] text-2xl font-black tracking-wider text-cyan-200">
            PERSONAJES ICÓNICOS
          </h2>
          <p className="mt-1 text-slate-400">La familia Smith y compañía.</p>
          <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-5">
            {stats.iconic.map((c) => (
              <Link
                key={c.id}
                href={`/rickandmorty/${c.id}`}
                className="group relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-slate-900 transition duration-300 hover:-translate-y-2 hover:border-yellow-300 hover:shadow-[0_0_30px_rgba(250,204,21,0.45)]"
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  width={300}
                  height={300}
                  className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#050816] via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="font-[family-name:var(--font-orbitron)] text-sm font-black tracking-wide">
                    {c.name}
                  </p>
                  <div className="mt-1">
                    <StatusBadge status={c.status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* EXPLORADOR */}
        <section id="personajes" className="scroll-mt-24">
          <h2 className="font-[family-name:var(--font-orbitron)] text-3xl font-black tracking-wider text-cyan-200">
            EXPLORA TODOS LOS PERSONAJES
          </h2>
          <p className="mb-6 mt-1 text-slate-400">
            Filtra por nombre, estado, tipo o género.
          </p>
          {/* Búsqueda en tiempo real: Client Component (CSR) */}
          <CharacterExplorer initialData={initialData} />
        </section>
      </div>
    </main>
  );
}
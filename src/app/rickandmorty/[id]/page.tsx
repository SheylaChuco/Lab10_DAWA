import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCharacter, getAllCharacterIds } from "@/lib/rickandmorty";
import StatusBadge from "@/components/StatusBadge";

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

// ISR: la página se regenera como máximo cada 10 días
export const revalidate = 864000; // 60 * 60 * 24 * 10

// SSG: genera en el build una ruta por cada personaje (por id, porque
// los nombres se repiten, ej. varios "Rick Sanchez")
export async function generateStaticParams() {
  const ids = await getAllCharacterIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: CharacterPageProps): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacter(id);
  if (!character) return { title: "Personaje no encontrado" };

  return {
    title: `${character.name} - Rick and Morty`,
    description: `${character.name}: ${character.species}, ${character.status}`,
  };
}

const accents = {
  cyan: "border-cyan-400/40 bg-cyan-400/10 text-cyan-300",
  yellow: "border-yellow-300/40 bg-yellow-300/10 text-yellow-200",
  indigo: "border-indigo-400/40 bg-indigo-400/10 text-indigo-300",
  sky: "border-sky-400/40 bg-sky-400/10 text-sky-300",
};

function Field({
  icon,
  label,
  value,
  accent,
}: {
  icon: string;
  label: string;
  value: string;
  accent: keyof typeof accents;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 backdrop-blur transition hover:-translate-y-1 ${accents[accent]}`}
    >
      <p className="font-[family-name:var(--font-orbitron)] text-[11px] font-bold uppercase tracking-widest">
        {icon} {label}
      </p>
      <p className="mt-2 text-xl font-bold text-white">{value || "—"}</p>
    </div>
  );
}

export default async function CharacterDetail({ params }: CharacterPageProps) {
  const { id } = await params;
  const character = await getCharacter(id);

  if (!character) notFound();

  // Los episodios vienen como URL; se toma el número del final
  const episodes = character.episode.map((url) => url.split("/").pop());

  const created = new Date(character.created).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/rickandmorty"
          className="inline-block rounded-full border border-cyan-400/40 px-5 py-2 text-sm font-bold text-cyan-100 transition hover:bg-cyan-400/10 hover:shadow-[0_0_14px_rgba(34,211,238,0.5)]"
        >
          ← Volver a la lista
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[380px_1fr]">
          {/* Imagen con portal */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-6 animate-[spin_14s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#22d3ee,#6366f1,#facc15,#0ea5e9,#22d3ee)] opacity-60 blur-2xl" />
            <div className="relative rounded-[2rem] bg-linear-to-br from-cyan-300 via-sky-500 to-yellow-300 p-1 shadow-[0_0_50px_rgba(34,211,238,0.5)]">
              <div className="relative overflow-hidden rounded-[1.8rem] bg-[#0a1128]">
                <Image
                  width={300}
                  height={300}
                  src={character.image}
                  alt={character.name}
                  className="aspect-square w-full object-cover"
                />
                <div className="absolute left-4 top-4">
                  <StatusBadge status={character.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Datos */}
          <div>
            <p className="font-[family-name:var(--font-orbitron)] text-sm font-bold tracking-[0.4em] text-yellow-300">
              ID-{character.id.toString().padStart(3, "0")}
            </p>
            <h1 className="mt-2 bg-linear-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text font-[family-name:var(--font-orbitron)] text-4xl font-black leading-tight tracking-wide text-transparent drop-shadow-[0_0_25px_rgba(34,211,238,0.5)] md:text-6xl">
              {character.name}
            </h1>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field icon="🧬" label="Especie" value={character.species} accent="cyan" />
              <Field icon="⚧" label="Género" value={character.gender} accent="yellow" />
              <Field icon="💠" label="Estado" value={character.status} accent="indigo" />
              <Field icon="🏷️" label="Tipo" value={character.type} accent="sky" />
              <Field icon="🌍" label="Origen" value={character.origin.name} accent="yellow" />
              <Field icon="📍" label="Última ubicación" value={character.location.name} accent="cyan" />
              <Field icon="📅" label="Creado" value={created} accent="sky" />
              <Field icon="📺" label="Episodios" value={String(character.episode.length)} accent="indigo" />
            </div>
          </div>
        </div>

        {/* Episodios */}
        <div className="mt-14 rounded-3xl border border-cyan-400/30 bg-white/5 p-6 backdrop-blur-xl">
          <h3 className="mb-4 font-[family-name:var(--font-orbitron)] text-xl font-black tracking-wider text-cyan-200">
            📺 APARECE EN LOS EPISODIOS
          </h3>
          <div className="flex flex-wrap gap-2">
            {episodes.map((ep) => (
              <span
                key={ep}
                className="rounded-full bg-linear-to-r from-cyan-400 to-sky-500 px-3 py-1 text-sm font-extrabold text-slate-900"
              >
                Ep. {ep}
              </span>
            ))}
          </div>
          <p className="mt-6 break-all text-xs text-slate-500">
            API: {character.url}
          </p>
        </div>
      </div>
    </main>
  );
}
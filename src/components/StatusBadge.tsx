import { CharacterStatus } from "@/types/character";

const styles: Record<CharacterStatus, { box: string; label: string }> = {
  Alive: {
    box: "bg-cyan-300 text-slate-900 shadow-[0_0_14px_rgba(34,211,238,0.9)]",
    label: "Vivo",
  },
  Dead: {
    box: "bg-rose-500 text-white shadow-[0_0_14px_rgba(244,63,94,0.9)]",
    label: "Muerto",
  },
  unknown: {
    box: "bg-yellow-300 text-slate-900 shadow-[0_0_14px_rgba(253,224,71,0.8)]",
    label: "Desconocido",
  },
};

export default function StatusBadge({ status }: { status: CharacterStatus }) {
  const s = styles[status] ?? styles.unknown;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-[family-name:var(--font-orbitron)] text-[11px] font-bold uppercase tracking-widest ${s.box}`}
    >
      <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
      {s.label}
    </span>
  );
}
import { ReactNode } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Orbitron, Exo_2 } from "next/font/google";
import { IoPlanet } from "react-icons/io5";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const exo = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo",
});

export const metadata: Metadata = {
  title: "Rick and Morty - Next.js",
  description: "Explora los personajes de Rick and Morty",
};

export default function RickAndMortyLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${orbitron.variable} ${exo.variable} relative min-h-screen overflow-hidden bg-[#050816] font-[family-name:var(--font-exo)] text-white`}
    >
      {/* Estrellas */}
      <div className="pointer-events-none fixed inset-0 opacity-70 [background-image:radial-gradient(1px_1px_at_20px_30px,#fff,transparent),radial-gradient(1.5px_1.5px_at_120px_80px,#a5f3fc,transparent),radial-gradient(1px_1px_at_200px_150px,#fde68a,transparent),radial-gradient(1px_1px_at_60px_170px,#fff,transparent)] [background-size:240px_200px]" />
      {/* Nebulosas */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full bg-indigo-600/30 blur-[140px]" />
        <div className="absolute -right-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-cyan-500/20 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-yellow-400/10 blur-[140px]" />
      </div>

      <nav className="sticky top-0 z-50 border-b border-cyan-400/20 bg-[#050816]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link
            href="/rickandmorty"
            className="flex items-center gap-3 font-[family-name:var(--font-orbitron)] text-xl font-black tracking-widest"
          >
            <IoPlanet
              size={32}
              className="animate-[spin_8s_linear_infinite] text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]"
            />
            <span className="bg-linear-to-r from-cyan-200 to-yellow-200 bg-clip-text text-transparent">
              RICK AND MORTY
            </span>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-cyan-400/40 px-4 py-1.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/10 hover:shadow-[0_0_14px_rgba(34,211,238,0.5)]"
          >
            Inicio
          </Link>
        </div>
      </nav>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
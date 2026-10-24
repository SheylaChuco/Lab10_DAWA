import { Character, CharacterResponse } from "@/types/character";

const API = "https://rickandmortyapi.com/api/character";

// 10 días en segundos (ISR)
export const REVALIDATE_10_DIAS = 60 * 60 * 24 * 10;

// Durante el build se hacen cientos de peticiones seguidas; si la API
// responde con error temporal (ej. 429), se reintenta con una pequeña espera
async function fetchConReintentos(
  url: string,
  options: RequestInit & { next?: { revalidate: number } },
  intentos = 8
): Promise<Response> {
  let res = await fetch(url, options);
  for (let i = 1; i < intentos && (res.status === 429 || res.status >= 500); i++) {
    await new Promise((r) => setTimeout(r, 1000 * i));
    // Next reutiliza peticiones iguales dentro del mismo render, por eso
    // se agrega un parámetro distinto en cada reintento
    const sep = url.includes("?") ? "&" : "?";
    res = await fetch(`${url}${sep}reintento=${i}`, options);
  }
  return res;
}

// Lista inicial: caché forzado en la petición (SSG)
export async function getCharacters(page = 1): Promise<CharacterResponse> {
  const res = await fetchConReintentos(`${API}?page=${page}`, {
    cache: "force-cache",
  });
  if (!res.ok) throw new Error("Error al cargar los personajes");
  return res.json();
}

// Trae TODOS los personajes (42 peticiones en total) y los guarda en memoria.
// Así el build no hace una petición por cada personaje (826) y la API no
// responde con el error 429 (demasiadas peticiones).
// Los datos se revalidan cada 10 días (ISR).
let todosCache: Promise<Character[]> | null = null;

export function getAllCharacters(): Promise<Character[]> {
  if (!todosCache) {
    todosCache = (async () => {
      const primera = await fetchConReintentos(`${API}?page=1`, {
        next: { revalidate: REVALIDATE_10_DIAS },
      });
      if (!primera.ok) throw new Error("Error al cargar los personajes");
      const first: CharacterResponse = await primera.json();
      const todos = [...first.results];

      // Una página a la vez, para no saturar la API
      for (let p = 2; p <= first.info.pages; p++) {
        const res = await fetchConReintentos(`${API}?page=${p}`, {
          next: { revalidate: REVALIDATE_10_DIAS },
        });
        if (!res.ok) throw new Error("Error al cargar los personajes");
        const data: CharacterResponse = await res.json();
        todos.push(...data.results);
      }
      return todos;
    })().catch((e) => {
      todosCache = null;
      throw e;
    });
  }
  return todosCache;
}

// Detalle: se busca por id en la lista guardada (ISR, 10 días).
// Si no está (ej. un personaje nuevo), se pide directo a la API por id.
export async function getCharacter(id: string): Promise<Character | null> {
  const todos = await getAllCharacters();
  const encontrado = todos.find((c) => String(c.id) === id);
  if (encontrado) return encontrado;

  const res = await fetchConReintentos(`${API}/${id}`, {
    next: { revalidate: REVALIDATE_10_DIAS },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Error al cargar el personaje (${res.status}) ${id}`);
  return res.json();
}

// Ids de todos los personajes para generateStaticParams
export async function getAllCharacterIds(): Promise<string[]> {
  const todos = await getAllCharacters();
  return todos.map((c) => String(c.id));
}

// ---------- Datos para la portada ----------
const BASE = "https://rickandmortyapi.com/api";

async function getCount(url: string): Promise<number> {
  const res = await fetchConReintentos(url, { cache: "force-cache" });
  if (!res.ok) return 0;
  const data = await res.json();
  return data.info.count as number;
}

// Estadísticas del multiverso (todo con caché forzado)
export async function getMultiverseStats() {
  const [alive, dead, unknown, locations, episodes, iconicRes] =
    await Promise.all([
      getCount(`${API}?status=alive`),
      getCount(`${API}?status=dead`),
      getCount(`${API}?status=unknown`),
      getCount(`${BASE}/location`),
      getCount(`${BASE}/episode`),
      fetchConReintentos(`${API}/1,2,3,4,5`, { cache: "force-cache" }),
    ]);

  const iconic: Character[] = iconicRes.ok ? await iconicRes.json() : [];

  return { alive, dead, unknown, locations, episodes, iconic };
}
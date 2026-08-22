import { ImageCandidate } from "@/lib/brave/search";

const BASE_URL = "https://www.steamgriddb.com/api/v2";

interface SteamGridDbGame {
  id: number;
  name: string;
}

interface SteamGridDbLogo {
  url: string;
  thumb: string;
  width: number;
  height: number;
}

async function steamGridDbFetch<T>(
  path: string,
  apiKey: string,
): Promise<T[] | null> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!response.ok) return null;

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("[SteamGridDB] Exception durant l'appel API :", error);
    return null;
  }
}

// Sans accents, minuscule, espaces normalisés : pour comparer deux titres de façon fiable
function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0),
  );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// Ratio de similarité (1 = identique, 0 = totalement différent), tolérant les fautes de frappe
// mineures mais rejetant un titre plausible mais différent (ex: "Violette" vs "Violet").
function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  return maxLen === 0 ? 1 : 1 - levenshtein(a, b) / maxLen;
}

const MIN_TITLE_SIMILARITY = 0.75;

/**
 * Recherche le jeu correspondant sur SteamGridDB et retourne son ID exact. Priorise une
 * correspondance de nom stricte pour éviter tout autre opus/édition de la même franchise
 * (ex: Pokémon Violet vs Emerald), sinon retombe sur le premier résultat SI son nom reste assez
 * proche du titre demandé (évite d'accepter aveuglément un jeu totalement différent en cas de
 * faute de frappe qui ressemble à un autre mot réel, ex: "Violette" -> "Pokémon Pinball").
 */
async function findGameId(
  title: string,
  apiKey: string,
): Promise<number | null> {
  const games = await steamGridDbFetch<SteamGridDbGame>(
    `/search/autocomplete/${encodeURIComponent(title)}`,
    apiKey,
  );
  if (!games || games.length === 0) return null;

  const normalized = normalize(title);
  const exactMatch = games.find((g) => normalize(g.name) === normalized);
  if (exactMatch) return exactMatch.id;

  const best = games[0];
  return similarity(normalized, normalize(best.name)) >= MIN_TITLE_SIMILARITY
    ? best.id
    : null;
}

/**
 * Récupère les logos officiels d'un jeu SteamGridDB par son ID confirmé, garantissant
 * qu'ils appartiennent tous au bon jeu (contrairement à une recherche d'image générique).
 */
export async function getSteamGridDbLogoCandidates(
  title: string,
  consoleName?: string,
): Promise<ImageCandidate[]> {
  const apiKey = process.env.STEAMGRIDDB_API_KEY;
  if (!apiKey) return [];

  const gameId = await findGameId(title, apiKey);
  if (!gameId) return [];

  const logos = await steamGridDbFetch<SteamGridDbLogo>(
    `/logos/game/${gameId}`,
    apiKey,
  );
  if (!logos) return [];

  return logos.map((logo) => ({
    url: logo.url,
    thumbnailUrl: logo.thumb,
    width: logo.width,
    height: logo.height,
  }));
}

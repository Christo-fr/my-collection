import { ImageCandidate } from "@/lib/brave/search";

// =========================================================================
// 1. TYPES & CONSTANTES
// =========================================================================

const BASE_URL = "https://www.steamgriddb.com/api/v2";
const STEAM_CDN_BASE =
  "https://shared.steamstatic.com/store_item_assets/steam/apps";
// Seuil de similarité en dessous duquel un résultat approximatif est rejeté (voir findGameId)
const MIN_TITLE_SIMILARITY = 0.75;

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

interface SteamGridDbHero {
  url: string;
  thumb: string;
  width: number;
  height: number;
}

interface SteamPlatformEntry {
  id: string;
  metadata: {
    store_asset_mtime?: number;
    library_logo_full?: { image2x?: Record<string, string> };
    library_hero_full?: { image2x?: Record<string, string> };
  };
}

interface SteamGridDbGameDetail {
  id: number;
  external_platform_data?: { steam?: SteamPlatformEntry[] };
}

// =========================================================================
// 2. CLIENT API
// =========================================================================

// Requête générique vers un endpoint SteamGridDB renvoyant une liste de résultats
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

// Requête générique vers un endpoint SteamGridDB renvoyant un objet unique
async function steamGridDbFetchObject<T>(
  path: string,
  apiKey: string,
): Promise<T | null> {
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

// =========================================================================
// 3. CORRESPONDANCE DE TITRE
// =========================================================================

// Sans accents, minuscule, espaces normalisés : pour comparer deux titres de façon fiable
function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

// Distance d'édition (nombre d'insertions/suppressions/substitutions) entre deux chaînes
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

// Ratio de similarité (1 = identique, 0 = totalement différent) dérivé de la distance de Levenshtein
function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  return maxLen === 0 ? 1 : 1 - levenshtein(a, b) / maxLen;
}

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

// =========================================================================
// 4. FALLBACK ASSETS STEAM D'ORIGINE
// =========================================================================

/**
 * Reconstruit l'URL de l'asset Steam d'origine (logo/hero, résolution x2) quand aucun
 * asset communautaire n'existe encore sur SteamGridDB pour ce jeu : SteamGridDB relie
 * chaque jeu Steam à son appid et à ses noms de fichiers d'assets via cet endpoint,
 * permettant de retomber sur les visuels officiels de la fiche Steam elle-même.
 */
async function getSteamStoreAssetFallback(
  gameId: number,
  apiKey: string,
  asset: "logo" | "hero",
): Promise<ImageCandidate | null> {
  const detail = await steamGridDbFetchObject<SteamGridDbGameDetail>(
    `/games/id/${gameId}?platformdata=steam`,
    apiKey,
  );
  const steamEntry = detail?.external_platform_data?.steam?.[0];
  if (!steamEntry) return null;

  const { id: appId, metadata } = steamEntry;
  const image2x =
    asset === "logo"
      ? metadata.library_logo_full?.image2x
      : metadata.library_hero_full?.image2x;
  // Prend la première langue disponible du dictionnaire (souvent "english") sans clé fixe
  const filename = image2x && Object.values(image2x)[0];
  if (!filename || !metadata.store_asset_mtime) return null;

  const url = `${STEAM_CDN_BASE}/${appId}/${filename}?t=${metadata.store_asset_mtime}`;
  return { url, thumbnailUrl: url };
}

// =========================================================================
// 5. RÉCUPÉRATION DES VISUELS
// =========================================================================

/**
 * Récupère les logos officiels d'un jeu SteamGridDB par son ID confirmé, garantissant
 * qu'ils appartiennent tous au bon jeu (contrairement à une recherche d'image générique).
 */
export async function getSteamGridDbLogoCandidates(
  title: string,
): Promise<ImageCandidate[]> {
  const apiKey = process.env.STEAMGRIDDB_API_KEY;
  if (!apiKey) return [];

  const gameId = await findGameId(title, apiKey);
  if (!gameId) return [];

  const logos = await steamGridDbFetch<SteamGridDbLogo>(
    `/logos/game/${gameId}`,
    apiKey,
  );
  if (logos && logos.length > 0) {
    return logos.map((logo) => ({
      url: logo.url,
      thumbnailUrl: logo.thumb,
      width: logo.width,
      height: logo.height,
    }));
  }

  const fallback = await getSteamStoreAssetFallback(gameId, apiKey, "logo");
  return fallback ? [fallback] : [];
}

/**
 * Récupère les heroes officiels d'un jeu SteamGridDB, filtrés sur le format 3840x1240
 * (équivalent du "library_hero_2x" de Steam), utilisés comme cover haute résolution.
 */
export async function getSteamGridDbHeroCandidates(
  title: string,
): Promise<ImageCandidate[]> {
  const apiKey = process.env.STEAMGRIDDB_API_KEY;
  if (!apiKey) return [];

  const gameId = await findGameId(title, apiKey);
  if (!gameId) return [];

  const heroes = await steamGridDbFetch<SteamGridDbHero>(
    `/heroes/game/${gameId}?dimensions=3840x1240`,
    apiKey,
  );
  if (heroes && heroes.length > 0) {
    return heroes.map((hero) => ({
      url: hero.url,
      thumbnailUrl: hero.thumb,
      width: hero.width,
      height: hero.height,
    }));
  }

  const fallback = await getSteamStoreAssetFallback(gameId, apiKey, "hero");
  return fallback ? [fallback] : [];
}

import { ImageCandidate } from "@/lib/brave/search";

// =========================================================================
// 1. CONFIGURATION ET CONSTANTES
// =========================================================================

const BASE_URL = "https://www.steamgriddb.com/api/v2";
const STEAM_CDN = "https://shared.steamstatic.com/store_item_assets/steam/apps";

// =========================================================================
// 2. UTILITAIRES ET CLIENT HTTP API
// =========================================================================

/**
 * Client HTTP générique pour les appels à l'API SteamGridDB.
 * Gère l'authentification Bearer et capture les erreurs réseau.
 */
async function sgdbFetch<T>(path: string, apiKey: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("[SteamGridDB] Erreur lors de l'appel API :", error);
    return null;
  }
}

/**
 * Normalise une chaîne de caractères (suppression des accents, minuscules, trim)
 * pour permettre des comparaisons strictes et fiables entre deux titres.
 */
function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

// =========================================================================
// 3. RECHERCHE D'IDENTIFIANT DE JEU
// =========================================================================

/**
 * Interroge l'autocomplétion SteamGridDB pour trouver l'ID unique d'un jeu.
 * Priorise une correspondance exacte avec le nom normalisé, sinon retombe sur le 1er résultat d'IGDB/SteamGridDB.
 */
async function findGameId(
  title: string,
  apiKey: string,
): Promise<number | null> {
  const games = await sgdbFetch<{ id: number; name: string }[]>(
    `/search/autocomplete/${encodeURIComponent(title)}`,
    apiKey,
  );
  if (!games?.length) return null;

  const norm = normalize(title);
  const exact = games.find((g) => normalize(g.name) === norm);
  return exact ? exact.id : games[0].id;
}

// =========================================================================
// 4. FALLBACK ASSETS STEAM (VISUELS OFFICIELS)
// =========================================================================

/**
 * Reconstruit l'URL d'un asset officiel sur le CDN Steam (logo 2x ou hero 2x)
 * lorsque aucun visuel communautaire n'a été créé sur SteamGridDB pour ce jeu.
 */
async function getSteamFallback(
  gameId: number,
  apiKey: string,
  assetType: "logo" | "hero",
): Promise<ImageCandidate | null> {
  const detail = await sgdbFetch<any>(
    `/games/id/${gameId}?platformdata=steam`,
    apiKey,
  );
  const steamData = detail?.external_platform_data?.steam?.[0];
  if (!steamData) return null;

  const { id: appId, metadata } = steamData;
  const imageDict =
    assetType === "logo"
      ? metadata?.library_logo_full?.image2x
      : metadata?.library_hero_full?.image2x;

  const filename = imageDict && Object.values(imageDict)[0];
  if (!filename || !metadata?.store_asset_mtime) return null;

  const url = `${STEAM_CDN}/${appId}/${filename}?t=${metadata.store_asset_mtime}`;
  return { url, thumbnailUrl: url };
}

// =========================================================================
// 5. MOTEUR DE RÉCUPÉRATION DES CANDIDATS VISUELS
// =========================================================================

/**
 * Récupère une liste de candidats visuels depuis SteamGridDB pour un endpoint spécifique (logos ou heroes).
 * En cas d'absence de visuels communautaires, bascule sur les assets officiels Steam via getSteamFallback.
 */
async function getCandidates(
  title: string,
  endpoint: "logos" | "heroes",
  params = "",
): Promise<ImageCandidate[]> {
  const apiKey = process.env.STEAMGRIDDB_API_KEY;
  if (!apiKey) return [];

  const gameId = await findGameId(title, apiKey);
  if (!gameId) return [];

  const items = await sgdbFetch<any[]>(
    `/${endpoint}/game/${gameId}${params}`,
    apiKey,
  );
  if (items?.length) {
    return items.map((item) => ({
      url: item.url,
      thumbnailUrl: item.thumb,
      width: item.width,
      height: item.height,
    }));
  }

  // Fallback vers les visuels Steam si aucun résultat sur SteamGridDB
  const fallbackAsset = endpoint === "logos" ? "logo" : "hero";
  const fallback = await getSteamFallback(gameId, apiKey, fallbackAsset);
  return fallback ? [fallback] : [];
}

// =========================================================================
// 6. EXPORTS PUBLICS DU SERVICE
// =========================================================================

/**
 * Récupère tous les logos candidats pour un jeu donné.
 */
export const getSteamGridDbLogoCandidates = (title: string) =>
  getCandidates(title, "logos");

/**
 * Récupère toutes les bannières candidates (format hero 3840x1240) pour un jeu donné.
 */
export const getSteamGridDbHeroCandidates = (title: string) =>
  getCandidates(title, "heroes", "?dimensions=3840x1240");

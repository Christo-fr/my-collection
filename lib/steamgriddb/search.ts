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
 * Normalise une chaîne de caractères (suppression des accents, minuscules, trim).
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
// 4. FALLBACK ASSETS STEAM (VISUELS OFFICIELS EN @2X)
// =========================================================================

/**
 * Reconstruit l'URL officielle de l'asset Steam en haute résolution (@2x)
 * depuis le CDN Steam (library_hero_2x.jpg ou logo_2x.png).
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
  if (!appId) return null;

  // Récupération de l'image dynamique OU fallback vers la convention officielle @2x de Steam
  const imageDict =
    assetType === "logo"
      ? metadata?.library_logo_full?.image2x
      : metadata?.library_hero_full?.image2x;

  const filename =
    (imageDict && Object.values(imageDict)[0]) ||
    (assetType === "logo" ? "logo_2x.png" : "library_hero_2x.jpg");

  const timeParam = metadata?.store_asset_mtime
    ? `?t=${metadata.store_asset_mtime}`
    : "";
  const url = `${STEAM_CDN}/${appId}/${filename}${timeParam}`;

  return { url, thumbnailUrl: url };
}

// =========================================================================
// 5. MOTEUR DE RÉCUPÉRATION DES CANDIDATS VISUELS
// =========================================================================

/**
 * Récupère les bannières ou logos depuis SteamGridDB, triés par résolution décroissante.
 * En cas d'absence d'images communautaires, bascule sur les visuels officiels Steam @2x.
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
  const fallbackAsset = endpoint === "logos" ? "logo" : "hero";

  if (items?.length) {
    // Tri par largeur décroissante (place les images 3840px / 2K / 4K au début)
    const sortedItems = [...items].sort(
      (a, b) => (b.width || 0) - (a.width || 0),
    );

    const candidates: ImageCandidate[] = sortedItems.map((item) => ({
      url: item.url,
      thumbnailUrl: item.thumb,
      width: item.width,
      height: item.height,
    }));

    // On ajoute également l'asset officiel Steam @2x dans les candidats si disponible
    const officialFallback = await getSteamFallback(
      gameId,
      apiKey,
      fallbackAsset,
    );
    if (officialFallback) {
      candidates.push(officialFallback);
    }

    return candidates;
  }

  // Fallback direct vers le CDN officiel Steam @2x si aucun résultat communautaire
  const fallback = await getSteamFallback(gameId, apiKey, fallbackAsset);
  return fallback ? [fallback] : [];
}

// =========================================================================
// 6. EXPORTS PUBLICS DU SERVICE
// =========================================================================

export const getSteamGridDbLogoCandidates = (title: string) =>
  getCandidates(title, "logos");

export const getSteamGridDbHeroCandidates = (title: string) =>
  getCandidates(title, "heroes");

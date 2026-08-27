import {
  getSteamGridDbHeroCandidates,
  getSteamGridDbLogoCandidates,
} from "@/lib/steamgriddb/search";

// =========================================================================
// 1. TYPES ET CONFIGURATION
// =========================================================================

export interface ImageCandidate {
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
}

/** Table de correspondance pour le repli vers les assets SteamGridDB */
const STEAMGRIDDB_HANDLERS = {
  logo: getSteamGridDbLogoCandidates,
  cover: getSteamGridDbHeroCandidates,
} as const;

/** Générateurs de mots-clés de recherche Brave selon le type d'asset */
const QUERY_TEMPLATES = {
  logo: (title: string, platform: string) =>
    `"${title}"${platform} logo transparent png webp cutout`,
  cover: (title: string, platform: string) =>
    `"${title}"${platform} official banner wallpaper artwork horizontal 1920x1080`,
  parallax: (title: string, platform: string) =>
    `"${title}"${platform} character key art render cutout transparent png webp`,
} as const;

// =========================================================================
// 2. CLIENT HTTP RECHERCHE BRAVE
// =========================================================================

/**
 * Exécute une requête d'images vers l'API Brave Search et formate les résultats.
 */
async function executeBraveImageSearch(
  apiKey: string,
  query: string,
  count: number = 12,
): Promise<ImageCandidate[]> {
  try {
    const endpoint = `https://api.search.brave.com/res/v1/images/search?q=${encodeURIComponent(query)}&count=${count}&safesearch=off`;

    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
        "X-Subscription-Token": apiKey,
      },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return (data.results || []).map((item: any) => ({
      url: item.properties?.url || item.url,
      thumbnailUrl: item.thumbnail?.src || item.properties?.url || item.url,
      width: item.properties?.width,
      height: item.properties?.height,
    }));
  } catch (error) {
    console.error("[Brave Search] Erreur lors de la recherche :", error);
    return [];
  }
}

// =========================================================================
// 3. SERVICE PRINCIPAL DE RÉCUPÉRATION ET FILTRAGE
// =========================================================================

/**
 * Récupère les candidats visuels (logo, cover, parallax) en priorisant SteamGridDB,
 * puis en basculant sur Brave Search avec filtrage de pertinence (transparence, résolution).
 */
export async function getBraveImageCandidates(
  title: string,
  type: "logo" | "cover" | "parallax",
  consoleName?: string,
): Promise<ImageCandidate[]> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;

  if (!apiKey) {
    console.warn("[Brave Search Warning] Clé BRAVE_SEARCH_API_KEY manquante.");
    return [];
  }

  // 1. Priorité aux visuels SteamGridDB pour les logos et les covers (heroes)
  if (type === "logo" || type === "cover") {
    const steamCandidates = await STEAMGRIDDB_HANDLERS[type](title);
    if (steamCandidates.length > 0) {
      return steamCandidates.slice(0, 12);
    }
  }

  // 2. Recherche principale sur Brave Search
  const platform = consoleName ? ` ${consoleName}` : "";
  const query = QUERY_TEMPLATES[type](title, platform);
  let candidates = await executeBraveImageSearch(apiKey, query, 12);

  // 3. Recherche complémentaire sur DeviantArt pour les assets transparents (Logos & Parallax)
  if (type === "logo" || type === "parallax") {
    const deviantArtCandidates = await executeBraveImageSearch(
      apiKey,
      `${query} site:deviantart.com`,
      12,
    );
    const seenUrls = new Set(candidates.map((c) => c.url));
    for (const item of deviantArtCandidates) {
      if (!seenUrls.has(item.url)) {
        candidates.push(item);
        seenUrls.add(item.url);
      }
    }
  }

  if (candidates.length === 0) return [];

  // 4. Élimination des formats sans transparence (JPEG) pour les logos et rendus parallax
  if (type === "logo" || type === "parallax") {
    const transparentOnly = candidates.filter(
      (c) => !/\.(jpe?g)$/i.test(c.url),
    );
    if (transparentOnly.length > 0) candidates = transparentOnly;
  }

  // 5. Filtrage selon les contraintes de résolution spécifiques
  if (type === "cover") {
    // Priorité aux bannières horizontales haute résolution (>= 1920px)
    const horizontalHd = candidates.filter(
      (c) =>
        (!c.width || c.width >= 1920) &&
        (!c.height || (c.width && c.width > c.height)),
    );
    if (horizontalHd.length > 0) candidates = horizontalHd;
  } else if (type === "parallax") {
    // Priorité aux renders d'une hauteur suffisante (>= 650px)
    const tallRenders = candidates.filter((c) => !c.height || c.height >= 650);
    if (tallRenders.length > 0) candidates = tallRenders;
  }

  return candidates;
}

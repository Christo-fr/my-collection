import {
  getSteamGridDbHeroCandidates,
  getSteamGridDbLogoCandidates,
} from "@/lib/steamgriddb/search";

// =========================================================================
// 1. TYPES
// =========================================================================

export interface ImageCandidate {
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
}

// =========================================================================
// 2. RECHERCHE BRAVE
// =========================================================================

// Exécute une recherche d'images via l'API Brave Search Image
async function executeBraveImageSearch(
  apiKey: string,
  query: string,
  count: number = 10,
): Promise<ImageCandidate[]> {
  try {
    const url = new URL("https://api.search.brave.com/res/v1/images/search");
    url.searchParams.append("q", query);
    url.searchParams.append("count", count.toString());
    url.searchParams.append("safesearch", "off");

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[Brave Search] Erreur HTTP ${response.status} :`,
        errorText,
      );
      return [];
    }

    const data = await response.json();
    const results = data.results || [];

    return results.map((item: any) => ({
      url: item.properties?.url || item.url,
      thumbnailUrl: item.thumbnail?.src || item.properties?.url || item.url,
      width: item.properties?.width,
      height: item.properties?.height,
    }));
  } catch (error) {
    console.error(
      "[Brave Search] Exception durant la recherche d'images :",
      error,
    );
    return [];
  }
}

// =========================================================================
// 3. RÉCUPÉRATION DE CANDIDATS
// =========================================================================

// Recherche des candidats d'images en priorisant SteamGridDB, avec repli sur Brave Search
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

  // Le logo est d'abord recherché sur SteamGridDB (source fiable), Brave ne sert que de repli
  if (type === "logo") {
    const steamGridDbCandidates = await getSteamGridDbLogoCandidates(title);
    if (steamGridDbCandidates.length > 0) {
      return steamGridDbCandidates.slice(0, 12);
    }
  }

  // Idem pour la cover, via le hero SteamGridDB au format x2 (haute résolution)
  if (type === "cover") {
    const steamGridDbCandidates = await getSteamGridDbHeroCandidates(title);
    if (steamGridDbCandidates.length > 0) {
      return steamGridDbCandidates.slice(0, 12);
    }
  }

  // Formatage propre du nom de la console s'il est renseigné
  const platform = consoleName ? ` ${consoleName}` : "";
  let query = "";

  if (type === "logo") {
    query = `"${title}"${platform} logo transparent png webp cutout`;
  } else if (type === "cover") {
    query = `"${title}"${platform} official banner wallpaper artwork horizontal 1920x1080`;
  } else if (type === "parallax") {
    query = `"${title}"${platform} character key art render cutout transparent png webp`;
  }

  let candidates = await executeBraveImageSearch(apiKey, query, 12);

  // Logo & Parallax : requête additionnelle sur DeviantArt (deux appels distincts car Brave
  // ne supporte pas OR/parenthèses avec "site:"), qui héberge de vrais PNG détourés en haute résolution
  if (type === "logo" || type === "parallax") {
    const deviantArtCandidates = await executeBraveImageSearch(
      apiKey,
      `${query} site:deviantart.com`,
      12,
    );
    const seenUrls = new Set(candidates.map((c) => c.url));
    for (const candidate of deviantArtCandidates) {
      if (!seenUrls.has(candidate.url)) {
        candidates.push(candidate);
        seenUrls.add(candidate.url);
      }
    }
  }

  // Cover : priorité aux bannières horizontales larges (>= 1920px)
  if (type === "cover" && candidates.length > 0) {
    const horizontalHighRes = candidates.filter(
      (c) =>
        (!c.width || c.width >= 1920) &&
        (!c.height || (c.width && c.width > c.height)),
    );
    if (horizontalHighRes.length > 0) {
      candidates = horizontalHighRes;
    }
  }

  // Logo & Parallax : élimination stricte des JPEG (pas de transparence)
  if ((type === "logo" || type === "parallax") && candidates.length > 0) {
    const transparentFormatsOnly = candidates.filter((c) => {
      const lowerUrl = c.url.toLowerCase();
      return !lowerUrl.endsWith(".jpg") && !lowerUrl.endsWith(".jpeg");
    });
    if (transparentFormatsOnly.length > 0) {
      candidates = transparentFormatsOnly;
    }
  }

  // Parallax : priorité aux visuels d'une hauteur minimale de 650px
  if (type === "parallax" && candidates.length > 0) {
    const minHeightCandidates = candidates.filter(
      (c) => !c.height || c.height >= 650,
    );
    if (minHeightCandidates.length > 0) {
      candidates = minHeightCandidates;
    }
  }

  return candidates;
}

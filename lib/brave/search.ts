export interface ImageCandidate {
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
}

/**
 * Exécute une recherche d'images via l'API Brave Search Image.
 */
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

/**
 * Recherche des candidats d'images via Brave Search API pour l'analyse visuelle.
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

  // Formatage propre du nom de la console s'il est renseigné
  const platform = consoleName ? ` ${consoleName}` : "";
  let query = "";

  if (type === "logo") {
    query = `"${title}"${platform} logo png webp site:steamgriddb.com`;
  } else if (type === "cover") {
    query = `"${title}"${platform} official banner wallpaper artwork horizontal 1920x1080`;
  } else if (type === "parallax") {
    query = `"${title}"${platform} character key art render cutout transparent png webp`;
  }

  let candidates = await executeBraveImageSearch(apiKey, query, 12);

  // Fallback Logo : secours si SteamGridDB ne renvoie aucun résultat
  if (type === "logo" && candidates.length === 0) {
    const fallbackQuery = `"${title}"${platform} logo transparent png webp cutout`;
    candidates = await executeBraveImageSearch(apiKey, fallbackQuery, 12);
  }

  // 1. Filtre Cover : priorité aux bannières horizontales larges (>= 1920px)
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

  // 2. Filtre Logo & Parallax : élimination stricte des fichiers JPEG / JPG
  if ((type === "logo" || type === "parallax") && candidates.length > 0) {
    const transparentFormatsOnly = candidates.filter((c) => {
      const lowerUrl = c.url.toLowerCase();
      return !lowerUrl.endsWith(".jpg") && !lowerUrl.endsWith(".jpeg");
    });
    if (transparentFormatsOnly.length > 0) {
      candidates = transparentFormatsOnly;
    }
  }

  // 3. Filtre Parallax : priorité aux visuels d'une hauteur minimale de 650px
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

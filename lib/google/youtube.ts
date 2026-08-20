/**
 * Recherche le trailer officiel d'un jeu sur YouTube
 * Priorité : Bande-annonce officielle en français -> Trailer officiel international.
 */
export async function getYouTubeTrailerId(
  title: string,
  consoleName?: string,
): Promise<string | null> {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.warn("[YouTube API Warning] Aucune clé GOOGLE_API_KEY configurée.");
    return null;
  }

  // Helper interne pour effectuer l'appel à l'API YouTube
  const fetchVideoId = async (query: string, lang?: string) => {
    try {
      const url = new URL("https://www.googleapis.com/youtube/v3/search");
      url.searchParams.append("part", "id");
      url.searchParams.append("type", "video");
      url.searchParams.append("maxResults", "1");
      url.searchParams.append("q", query);
      url.searchParams.append("videoEmbeddable", "true"); // Vidéo intégrable uniquement

      if (lang) {
        url.searchParams.append("relevanceLanguage", lang); // Priorise la langue demandée
      }

      url.searchParams.append("key", apiKey);

      const response = await fetch(url.toString());
      if (!response.ok) return null;

      const data = await response.json();
      return data.items?.[0]?.id?.videoId || null;
    } catch {
      return null;
    }
  };

  // 1. TENTATIVE IDÉALE : Recherche de la bande-annonce officielle en français
  const frenchQuery =
    `${title} ${consoleName || ""} bande annonce officielle`.trim();
  let videoId = await fetchVideoId(frenchQuery, "fr");

  // 2. TENTATIVE DE SECOURS : Recherche du trailer officiel international si rien n'est trouvé
  if (!videoId) {
    const globalQuery = `${title} ${consoleName || ""} official trailer`.trim();
    videoId = await fetchVideoId(globalQuery);
  }

  return videoId;
}

// =========================================================================
// SERVICE YOUTUBE — RECHERCHE DE TRAILERS
// =========================================================================

/**
 * Recherche l'identifiant YouTube de la bande-annonce officielle d'un jeu.
 *
 * Stratégie de recherche en 2 étapes :
 * 1. Recherche ciblée sur la bande-annonce officielle en français (`relevanceLanguage = "fr"`).
 * 2. Secours international sur le trailer officiel global si la requête FR ne renvoie rien.
 *
 * @param title - Titre du jeu vidéo.
 * @param consoleName - Nom de la console (optionnel, affine la pertinence de la recherche).
 * @returns L'ID de la vidéo YouTube intégrable ou `null` si introuvable / erreur API.
 */
export async function getYouTubeTrailerId(
  title: string,
  consoleName?: string,
): Promise<string | null> {
  // Contrôle de présence de la clé API dans l'environnement
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.warn(
      "[YouTube API Warning] : aucune clé GOOGLE_API_KEY configurée.",
    );
    return null;
  }

  // =========================================================================
  // HELPER INTERNE : REQUÊTE À L'API YOUTUBE DATA v3
  // =========================================================================
  /**
   * Effectue un appel à l'endpoint /search de l'API YouTube Data v3.
   * Filtre strictement pour n'extraire que des vidéos autorisées à l'intégration (embeddable).
   */
  const fetchVideoId = async (query: string, lang?: string) => {
    try {
      const url = new URL("https://www.googleapis.com/youtube/v3/search");
      url.searchParams.append("part", "id");
      url.searchParams.append("type", "video");
      url.searchParams.append("maxResults", "1");
      url.searchParams.append("q", query);
      url.searchParams.append("videoEmbeddable", "true"); // Exclut les vidéos privées ou bloquées en lecteur externe

      if (lang) {
        url.searchParams.append("relevanceLanguage", lang); // Priorise la pertinence linguistique
      }

      url.searchParams.append("key", apiKey);

      const response = await fetch(url.toString());
      if (!response.ok) return null;

      const data = await response.json();
      return data.items?.[0]?.id?.videoId || null;
    } catch {
      // Gestion silencieuse des erreurs réseau ou des quotas API
      return null;
    }
  };

  // =========================================================================
  // ÉTAPE 1 : STRATÉGIE PRINCIPALE (BANDE-ANNONCE FR)
  // =========================================================================
  const frenchQuery =
    `${title} ${consoleName || ""} bande annonce officielle`.trim();
  let videoId = await fetchVideoId(frenchQuery, "fr");

  // =========================================================================
  // ÉTAPE 2 : STRATÉGIE DE SECOURS (TRAILER INTERNATIONAL)
  // =========================================================================
  if (!videoId) {
    const globalQuery = `${title} ${consoleName || ""} official trailer`.trim();
    videoId = await fetchVideoId(globalQuery);
  }

  return videoId;
}

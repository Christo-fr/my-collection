import { useState, useMemo } from "react";
import { useGamesContext } from "@/components/providers/GamesProvider";
import { getConsoleOptions } from "@/features/game/gameUtils";

/**
 * Hook personnalisé calculant les statistiques globales et filtrées de la ludothèque.
 * Expose les métriques clés, le classement par genre équitable et les jeux d'exception.
 */
export function useStats() {
  // 1. Récupération des données globales via le contexte
  const { games, loading } = useGamesContext();

  // 2. État du filtre d'onglet par console
  const [selectedConsole, setSelectedConsole] = useState<string>("Toutes");

  // 3. Extraction dynamique des onglets disponibles (mémorisé pour éviter les recalculs inutiles)
  const consoleTabs = useMemo(() => getConsoleOptions(games), [games]);

  // 4. Sous-ensemble de jeux filtrés selon la console sélectionnée
  const filteredGames = useMemo(() => {
    if (selectedConsole === "Toutes") return games;
    return games.filter((game) => game.console === selectedConsole);
  }, [games, selectedConsole]);

  // 5. Calcul centralisé des métriques (exécuté uniquement si 'filteredGames' change)
  const stats = useMemo(() => {
    // --- MÉTRIQUES DE BASE ---

    // Volume total de jeux dans la vue actuelle
    const totalGames = filteredGames.length;

    // Un jeu est considéré comme "terminé" uniquement s'il possède une note attribuée (review.score != null)
    const totalCompletedGames = filteredGames.filter(
      (game) => game.review?.score != null,
    ).length;

    // Accumulation des heures de jeu (fallback à 0 via l'opérateur '??' si non renseigné)
    const totalPlaytime = filteredGames.reduce((counter, game) => {
      return counter + (game.review?.playtime ?? 0);
    }, 0);

    // Nombre de jeux possédés en version physique
    const totalPhysical = filteredGames.filter(
      (game) => game.format === "Physical",
    ).length;

    // Somme cumulée de toutes les notes
    const totalScoreSum = filteredGames.reduce((counter, game) => {
      return counter + (game.review?.score ?? 0);
    }, 0);

    // Moyenne arrondie à 1 décimale avec garde-fou contre la division par zéro (NaN)
    const totalAverageScore =
      totalCompletedGames > 0
        ? Math.round((totalScoreSum / totalCompletedGames) * 10) / 10
        : 0;

    // --- DICTIONNAIRE ET TRI DES GENRES ---

    // Comptage des occurrences par genre sous forme de Hash Map { "Genre": quantité }
    // Permet une mise à jour en temps linéaire O(N)
    const genreCounts = filteredGames.reduce(
      (counter, game) => {
        const genre = game.genre;
        // Si la clé existe on incrémente, sinon on l'initialise à 1
        counter[genre] = (counter[genre] ?? 0) + 1;
        return counter;
      },
      {} as Record<string, number>,
    );

    // Transformation du dictionnaire en tableau [genre, count] trié du plus grand au plus petit
    const sortedGenres = Object.entries(genreCounts).sort(
      (a, b) => b[1] - a[1],
    );

    // --- ALGORITHME DE CLASSEMENT ÉQUITABLE (PALIERS & EX ÆQUO) ---
    // Règle : On conserve au moins 3 éléments. Si le genre suivant a un score strictement
    // inférieur au dernier élément ajouté sur le podium, la boucle s'arrête.
    let topGenres: [string, number][] = [];

    for (const [genre, count] of sortedGenres) {
      const lastAddedCount = topGenres[topGenres.length - 1]?.[1];

      if (
        topGenres.length >= 3 &&
        lastAddedCount !== undefined &&
        count < lastAddedCount
      ) {
        break; // Arrêt : le palier suivant est strictement inférieur
      }

      topGenres.push([genre, count]);
    }

    // --- HALL OF FAME & HALL OF SHAME ---

    // Isolation des jeux disposant d'une évaluation pour éviter de biaiser avec les jeux non notés
    const ratedGames = filteredGames.filter(
      (game) => game.review?.score != null,
    );
    const hasRatedGames = ratedGames.length > 0;

    // Garde-fous : Math.max/min sur tableau vide renvoient -Infinity/Infinity
    const maxScore = hasRatedGames
      ? Math.max(...ratedGames.map((game) => game.review!.score))
      : 0;

    // Récupération de TOUS les jeux ayant la note maximale (gestion des ex æquo)
    const hallOfFame = hasRatedGames
      ? ratedGames
          .filter((game) => game.review?.score === maxScore)
          .sort((a, b) => a.title.localeCompare(b.title))
      : [];

    const minScore = hasRatedGames
      ? Math.min(...ratedGames.map((game) => game.review!.score))
      : 0;

    // Récupération de TOUS les jeux ayant la note minimale (gestion des ex æquo)
    const hallOfShame = hasRatedGames
      ? ratedGames
          .filter((game) => game.review?.score === minScore)
          .sort((a, b) => a.title.localeCompare(b.title))
      : [];

    return {
      totalGames,
      totalCompletedGames,
      totalPlaytime,
      totalPhysical,
      totalAverageScore,
      topGenres,
      hallOfFame,
      hallOfShame,
    };
  }, [filteredGames]);

  // 6. Exposition de l'API publique pour les composants React
  return {
    loading,
    selectedConsole,
    setSelectedConsole,
    consoleTabs,
    ...stats,
  };
}

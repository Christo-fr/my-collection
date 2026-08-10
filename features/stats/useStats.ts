import { useState, useMemo } from "react";
import { useGamesContext } from "@/components/providers/GamesProvider";
import { getConsoleOptions } from "@/features/game/gameUtils";
import { getTopPodium, getExtremeGames } from "@/features/game/gameUtils";
import type { Game } from "@/types/game";

/**
 * Hook personnalisé calculant les statistiques globales et filtrées de la ludothèque.
 * Expose les métriques clés, le classement par genre équitable et les jeux d'exception.
 */
export function useStats() {
  // =============================================================
  // 1. RÉCUPÉRATION DES DONNÉES GLOBALES
  // =============================================================
  const { games, loading } = useGamesContext();

  // =============================================================
  // 2. ÉTATS LOCAUX (FILTRES ET SÉLECTIONS)
  // =============================================================
  const [selectedConsole, setSelectedConsole] = useState<string>("Toutes");
  const [recordMetric, setRecordMetric] = useState<string>("score");

  // =============================================================
  // 3. EXTRACTION DYNAMIQUE DES ONGLETS DE CONSOLE
  // =============================================================
  const consoleTabs = useMemo(() => getConsoleOptions(games), [games]);

  // =============================================================
  // 4. SOUS-ENSEMBLE DE JEUX FILTRÉS SELON LA CONSOLE
  // =============================================================
  const filteredGames = useMemo(() => {
    if (selectedConsole === "Toutes") return games;
    return games.filter((game) => game.console === selectedConsole);
  }, [games, selectedConsole]);

  // =============================================================
  // 5. CALCUL CENTRALISÉ DES MÉTRIQUES (MEMOÏSÉ)
  // =============================================================
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

    const topGenres = getTopPodium(filteredGames, (game) => game.genre);
    const topFranchises = getTopPodium(filteredGames, (game) => game.franchise);

    // --- HALL OF FAME & HALL OF SHAME ---

    let recordMax: Game[] = [];
    let recordMin: Game[] = [];

    switch (recordMetric) {
      case "score":
        recordMax = getExtremeGames(
          filteredGames,
          (game) => game.review?.score,
          "max",
        );
        recordMin = getExtremeGames(
          filteredGames,
          (game) => game.review?.score,
          "min",
        );
        break;
      case "playtime":
        recordMax = getExtremeGames(
          filteredGames,
          (game) => game.review?.playtime,
          "max",
        );
        recordMin = getExtremeGames(
          filteredGames,
          (game) => game.review?.playtime,
          "min",
        );
        break;
      case "playtime_gap":
        recordMax = getExtremeGames(
          filteredGames,
          (game) =>
            game.review?.playtime != null
              ? game.review.playtime - game.estimatedPlaytime
              : undefined,
          "max",
        );
        recordMin = getExtremeGames(
          filteredGames,
          (game) =>
            game.review?.playtime != null
              ? game.review.playtime - game.estimatedPlaytime
              : undefined,
          "min",
        );
        break;
      case "completion_date":
        recordMax = getExtremeGames(
          filteredGames,
          (game) =>
            game.review?.completedDate != null
              ? Date.parse(game.review?.completedDate)
              : undefined,
          "max",
        );
        recordMin = getExtremeGames(
          filteredGames,
          (game) =>
            game.review?.completedDate != null
              ? Date.parse(game.review?.completedDate)
              : undefined,
          "min",
        );
        break;
      case "yearly_summary": {
        // 1. On isole tous les jeux qui ont une date de fin validée
        const completedGames = filteredGames.filter(
          (game) => game.review?.completedDate != null,
        );

        // Sécurité : si aucun jeu n'est terminé
        if (completedGames.length === 0) {
          recordMax = [];
          recordMin = [];
          break;
        }

        // 2. Année actuelle et liste de toutes les années disponibles
        const currentYear = new Date().getFullYear();
        const availableYears = completedGames.map((game) =>
          new Date(game.review.completedDate).getFullYear(),
        );

        // 3. Année cible : l'année en cours si elle existe, sinon la plus récente disponible
        const targetYear = availableYears.includes(currentYear)
          ? currentYear
          : Math.max(...availableYears);

        // 4. On remplit la colonne principale avec les jeux de cette année-là
        recordMax = completedGames.filter(
          (game) =>
            new Date(game.review.completedDate).getFullYear() === targetYear,
        );
        recordMin = []; // Pas de deuxième colonne pour le bilan annuel

        break;
      }
    }

    return {
      totalGames,
      totalCompletedGames,
      totalPlaytime,
      totalPhysical,
      totalAverageScore,
      topGenres,
      topFranchises,
      recordMin,
      recordMax,
    };
  }, [filteredGames, recordMetric]);

  // =============================================================
  // 6. RETOUR DU HOOK ("Le Paquet Cadeau")
  // =============================================================
  return {
    loading,
    selectedConsole,
    setSelectedConsole,
    consoleTabs,
    recordMetric,
    setRecordMetric,
    ...stats,
  };
}

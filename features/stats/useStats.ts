import { useState, useMemo } from "react";
import { useGamesContext } from "@/components/providers/GamesProvider";
import { getConsoleOptions } from "@/features/game/gameUtils";
import {
  getTopPodium,
  getRecordGames,
  getRecordColumnTitle,
} from "@/features/game/gameUtils";
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
  // 5. CALCUL CENTRALISÉ DES MÉTRIQUES
  // =============================================================
  const stats = useMemo(() => {
    // -------------------------------------------------------------
    // A. CHIFFRES CLÉS & VOLUMES GLOBATION
    // -------------------------------------------------------------

    const totalGames = filteredGames.length;

    // Jeux considérés comme évalués/terminés (note présente)
    const completedGames = filteredGames.filter(
      (game) => game.review?.score != null,
    );
    const totalCompletedGames = completedGames.length;

    // Cumul des heures de jeu enregistrées
    const totalPlaytime = filteredGames.reduce(
      (counter, game) => counter + (game.review?.playtime ?? 0),
      0,
    );

    // Cumul des heures de jeu estimés
    const totalEstimatedPlaytime = filteredGames.reduce(
      (counter, game) => counter + (game.estimatedPlaytime ?? 0),
      0,
    );

    // Jeux au format physique
    const totalPhysical = filteredGames.filter(
      (game) => game.format === "Physical",
    ).length;

    // -------------------------------------------------------------
    // B. QUALITÉ & MOYENNES
    // -------------------------------------------------------------
    const totalScoreSum = filteredGames.reduce(
      (counter, game) => counter + (game.review?.score ?? 0),
      0,
    );

    const totalAverageScore =
      totalCompletedGames > 0
        ? Math.round((totalScoreSum / totalCompletedGames) * 10) / 10
        : 0;

    // -------------------------------------------------------------
    // C. PODIUMS (TOPS 3)
    // -------------------------------------------------------------
    const topGenres = getTopPodium(filteredGames, (game) => game.genre);
    const topFranchises = getTopPodium(filteredGames, (game) => game.franchise);

    // -------------------------------------------------------------
    // D. RECORDS & SÉLECTIONS DYNAMIQUES (MAX / MIN)
    // -------------------------------------------------------------
    let recordMax: Game[] = [];
    let recordMin: Game[] = [];

    switch (recordMetric) {
      case "score":
        recordMax = getRecordGames(
          filteredGames,
          (game) => game.review?.score,
          "max",
        );
        recordMin = getRecordGames(
          filteredGames,
          (game) => game.review?.score,
          "min",
        );
        break;
      case "playtime":
        recordMax = getRecordGames(
          filteredGames,
          (game) => game.review?.playtime,
          "max",
        );
        recordMin = getRecordGames(
          filteredGames,
          (game) => game.review?.playtime,
          "min",
        );
        break;
      case "playtime_gap":
        recordMax = getRecordGames(
          filteredGames,
          (game) =>
            game.review?.playtime != null
              ? game.review.playtime - game.estimatedPlaytime
              : undefined,
          "max",
        );
        recordMin = getRecordGames(
          filteredGames,
          (game) =>
            game.review?.playtime != null
              ? game.review.playtime - game.estimatedPlaytime
              : undefined,
          "min",
        );
        break;
      case "completion_date":
        recordMax = getRecordGames(
          filteredGames,
          (game) =>
            game.review?.completedDate != null
              ? Date.parse(game.review?.completedDate)
              : undefined,
          "max",
        );
        recordMin = getRecordGames(
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
      totalEstimatedPlaytime,
      totalPhysical,
      totalAverageScore,
      topGenres,
      topFranchises,
      recordMin,
      recordMax,
    };
  }, [filteredGames, recordMetric]);

  // =============================================================
  // 6. RETOUR DU HOOK
  // =============================================================
  return {
    loading,
    totalDataGames: games.length,
    totalDataPlaytimeGames: games.reduce(
      (counter, game) => counter + (game.review?.playtime ?? 0),
      0,
    ),
    selectedConsole,
    setSelectedConsole,
    consoleTabs,
    recordMetric,
    setRecordMetric,
    getRecordColumnTitle,
    ...stats,
  };
}

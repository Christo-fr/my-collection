import { useState, useMemo } from "react";
import { useGamesContext } from "@/components/providers/GamesProvider";
import { getConsoleTabs } from "@/utils/gameUtils";
import {
  getTopPodium,
  getRecordGames,
  getRecordColumnTitle,
} from "@/utils/gameUtils";
import type { Game } from "@/types/game";

// =========================================================================
// 1. HOOK MAIN & INITIALISATION
// =========================================================================
/** Hook personnalisé calculant les statistiques globales et filtrées de la ludothèque */
export function useStats() {
  // Extraction du catalogue brut, des consoles et du state de chargement depuis le provider global
  const { games, consoles, loading } = useGamesContext();

  // =========================================================================
  // 2. ÉTATS LOCAUX (Filtres et métriques)
  // =========================================================================
  // Stocke la console sélectionnée dans les onglets ("Toutes" par défaut)
  const [selectedConsole, setSelectedConsole] = useState<string>("Toutes");
  // Stocke la métrique sélectionnée pour le select comparatif ("score" par défaut)
  const [recordMetric, setRecordMetric] = useState<string>("score");

  // =========================================================================
  // 3. CALCULS MÉMOÏSÉS (useMemo)
  // =========================================================================
  // Génère la liste des onglets de consoles uniquement si le tableau des consoles est mis à jour
  const consoleTabs = useMemo(() => getConsoleTabs(consoles), [consoles]);

  // Filtre la liste des jeux par console uniquement si games ou selectedConsole changent
  const filteredGames = useMemo(() => {
    if (selectedConsole === "Toutes") return games;
    return games.filter((game) => game.console === selectedConsole);
  }, [games, selectedConsole]);

  // Calcule l'ensemble des métriques et des records uniquement si le sous-ensemble ou la métrique évolue
  const stats = useMemo(() => {
    // -----------------------------------------------------------------------
    // A. Chiffres clés & Volumes
    // -----------------------------------------------------------------------
    // Nombre total de jeux filtrés pour la console active
    const totalGames = filteredGames.length;

    // Filtre les jeux possédant une note (et considérés comme "jeux terminés")
    const completedGames = filteredGames.filter(
      (game) => game.review?.score != null,
    );
    // Nombre total de jeux terminés
    const totalCompletedGames = completedGames.length;

    // Nombre d'heures de jeu joués
    const totalPlaytime = filteredGames.reduce(
      (counter, game) => counter + (game.review?.playtime ?? 0),
      0,
    );

    // Nombre d'heures de jeu estimés
    const totalEstimatedPlaytime = filteredGames.reduce(
      (counter, game) => counter + (game.estimatedPlaytime ?? 0),
      0,
    );

    // Nombre de jeux au support physique
    const totalPhysical = filteredGames.filter(
      (game) => game.format === "Physical",
    ).length;

    // -----------------------------------------------------------------------
    // B. Notes & Moyennes
    // -----------------------------------------------------------------------
    // Cumule l'ensemble des notes attribuées
    const totalScoreSum = filteredGames.reduce(
      (counter, game) => counter + (game.review?.score ?? 0),
      0,
    );

    // Calcule la note moyenne arrondie à une décimale (d'où le *10 lors du Math.round, pour ensuite le diviser par 10)
    const totalAverageScore =
      totalCompletedGames > 0
        ? Math.round((totalScoreSum / totalCompletedGames) * 10) / 10
        : 0;

    // -----------------------------------------------------------------------
    // C. Tops 3 des genres et franchises
    // -----------------------------------------------------------------------
    // Génère le top 3 des genres les plus représentés
    const topGenres = getTopPodium(filteredGames, (game) => game.genre);
    // Génère le top 3 des franchises les plus représentées
    const topFranchises = getTopPodium(filteredGames, (game) => game.franchise);

    // -----------------------------------------------------------------------
    // D. Records (Max / Min)
    // -----------------------------------------------------------------------
    let recordMax: Game[] = [];
    let recordMin: Game[] = [];

    switch (recordMetric) {
      case "score":
        // Recherche des jeux ayant la note maximale
        recordMax = getRecordGames(
          filteredGames,
          (game) => game.review?.score,
          "max",
        );
        // Recherche des jeux ayant la note minimale
        recordMin = getRecordGames(
          filteredGames,
          (game) => game.review?.score,
          "min",
        );
        break;

      case "playtime":
        // Recherche des jeux avec le temps de jeu le plus élevé
        recordMax = getRecordGames(
          filteredGames,
          (game) => game.review?.playtime,
          "max",
        );
        // Recherche des jeux avec le temps de jeu le plus faible
        recordMin = getRecordGames(
          filteredGames,
          (game) => game.review?.playtime,
          "min",
        );
        break;

      case "playtime_gap":
        // Recherche du plus grand dépassement du temps estimé
        recordMax = getRecordGames(
          filteredGames,
          (game) =>
            game.review?.playtime != null
              ? game.review.playtime - game.estimatedPlaytime
              : undefined,
          "max",
        );
        // Recherche de la plus grande avance sur le temps estimé
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
        // Recherche des derniers jeux terminés
        recordMax = getRecordGames(
          filteredGames,
          (game) =>
            game.review?.completedDate != null
              ? Date.parse(game.review?.completedDate)
              : undefined,
          "max",
        );
        // Recherche des premiers jeux terminés
        recordMin = getRecordGames(
          filteredGames,
          (game) =>
            game.review?.completedDate != null
              ? Date.parse(game.review?.completedDate)
              : undefined,
          "min",
        );
        break;
    }

    // Si la valeur min est égale à la valeur max (tableaux identiques), on vide recordMin pour masquer automatiquement la colonne Min dans l'UI
    if (
      recordMax.length > 0 &&
      recordMin.length > 0 &&
      recordMax[0].id === recordMin[0].id
    ) {
      recordMin = [];
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

  // =========================================================================
  // 4. RETOUR DU HOOK
  // =========================================================================
  // Exporte les données calculées et les fonctions d'action vers la vue
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

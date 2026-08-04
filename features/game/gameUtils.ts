import { Game } from "@/types/game";

/**
 * Options statiques pour le filtre de statut.
 */
export const OPTIONS_STATUS = [
  { label: "Tous", value: "all" },
  { label: "Terminé", value: "completed" },
  { label: "Non terminé", value: "not_completed" },
];

/**
 * Extrait la liste des consoles uniques à partir des jeux et les trie par ordre alphabétique.
 */
export function getConsoleOptions(games: Game[]) {
  return [
    { label: "Toutes", value: "Toutes" },
    ...Array.from(new Set(games.map((jeu) => jeu.console)))
      .map((nomConsole) => ({ label: nomConsole, value: nomConsole }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  ];
}

/**
 * Extrait la liste des genres/styles uniques à partir des jeux et les trie par ordre alphabétique.
 */
export function getStyleOptions(games: Game[]) {
  return [
    { label: "Tous", value: "Tous" },
    ...Array.from(new Set(games.map((jeu) => jeu.genre)))
      .map((nomGenre) => ({ label: nomGenre, value: nomGenre }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  ];
}

interface FilterParams {
  maxDuration: number;
  selectedConsole: string;
  selectedStyle: string;
  selectedStatus: string;
  searchQuery: string;
  sortBy: string;
}

/**
 * Fonction pure : applique l'ensemble des filtres (durée, console, style, statut, recherche)
 * ainsi que le tri demandé sur la liste des jeux.
 */
export function filterAndSortGames(
  games: Game[],
  filters: FilterParams,
): Game[] {
  const {
    maxDuration,
    selectedConsole,
    selectedStyle,
    selectedStatus,
    searchQuery,
    sortBy,
  } = filters;

  return games
    .filter(
      (game) =>
        // 1. Filtre durée
        game.estimatedPlaytime <= maxDuration &&
        // 2. Filtre console
        (selectedConsole === "Toutes" || game.console === selectedConsole) &&
        // 3. Filtre genre
        (selectedStyle === "Tous" || game.genre === selectedStyle) &&
        // 4. Filtre statut
        (selectedStatus === "all" ||
          (selectedStatus === "completed" && game.review?.score != null) ||
          (selectedStatus === "not_completed" && game.review?.score == null)) &&
        // 5. Filtre recherche textuelle
        game.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      let diff = 0;
      switch (sortBy) {
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "anti_alphabetical":
          return b.title.localeCompare(a.title);
        case "releaseDate_ascending":
          diff =
            new Date(a.releaseDate).getTime() -
            new Date(b.releaseDate).getTime();
          break;
        case "releaseDate_descending":
          diff =
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime();
          break;
        case "estimatedPlaytime_ascending":
          diff = a.estimatedPlaytime - b.estimatedPlaytime;
          break;
        case "estimatedPlaytime_descending":
          diff = b.estimatedPlaytime - a.estimatedPlaytime;
          break;
        case "score_ascending":
          diff = (a.review?.score ?? 0) - (b.review?.score ?? 0);
          break;
        case "score_descending":
          diff = (b.review?.score ?? 0) - (a.review?.score ?? 0);
          break;
        default:
          break;
      }
      return diff !== 0 ? diff : a.title.localeCompare(b.title);
    });
}
